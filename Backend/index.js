import express from 'express'
import cors from 'cors'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import { config } from 'dotenv'
import multer from 'multer'
import fs from 'fs'
import * as docx from 'docx-parser';
import pdf from 'pdf-parse/lib/pdf-parse.js'
import pg from 'pg'
import { combineDocument } from './utils/combineDocument.js';
import { formatConvHistory } from './utils/formatConvHistory.js';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';



config();


const app = express();

app.use(express.json())
app.use(cors())

const storage = multer.diskStorage({})
const upload = multer({ storage })

const supabaseKey = process.env.SUPABASE_KEY
const supabaseUrl = process.env.SUPABASE_URL


const supabase = createClient(supabaseUrl, supabaseKey)

const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: "http://127.0.0.1:11434/",
});


app.post('/upload', upload.single('file'), async (req, res) => {
    try {

        const file = req.file
        let result = ''
        if (
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // .docx
            file.mimetype === 'application/msword' // .doc
        ) {
            result = await new Promise((resolve, reject) => {
                docx.parseDocx(file.path, function (data) {
                    fs.unlinkSync(file.path); // Clean up uploaded file
                    resolve(data);
                });
            });
        }
        else if (
            file.mimetype === 'application/pdf'
        ) {
            const dataBuffer = fs.readFileSync(file.path)
            const data = await pdf(dataBuffer)
            result = data.text
            fs.unlinkSync(file.path);
        }
        else if (
            file.mimetype === 'text/plain'
        ) {
            result = fs.readFileSync(file.path, 'utf-8')
            fs.unlinkSync(file.path);
        }
        else {
            fs.unlinkSync(file.path); // Clean up uploaded file
            return res.status(400).json({ error: 'Unsupported file type. Please upload a Word document, PDF, or .txt file.' });
        }


        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            separators: ['\n\n', '\n', ' ', ''],
            chunkOverlap: 50
        })

        const output = await splitter.createDocuments([result])


        if (!supabaseKey || !supabaseUrl) {
            return res.status(500).json({ error: 'Missing Supabase configuration (SUPABASE_URL or SUPABASE_KEY).' })
        }


        const client = new pg.Client({
            connectionString: `postgresql://postgres.jhwidktvqlpgwxnzipne:${process.env.SUPABASE_PASS}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
            ssl: {
                rejectUnauthorized: false
            }
        });

        await client.connect();

        const query = `
-- Create a table to store your documents
create table a${file.filename} (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(768) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for documents
create function a${file.filename} (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  embedding jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    (embedding::text)::jsonb as embedding,
    1 - (a${file.filename}.embedding <=> query_embedding) as similarity
  from a${file.filename}
  where metadata @> filter
  order by a${file.filename}.embedding <=> query_embedding
  limit match_count;
end;
$$;
            
  `;
        try {
            await client.query(query);
            console.log('Table created successfully');
        } catch (err) {
            console.error('Error:', err);
        } finally {
            await client.end();
        }

        await SupabaseVectorStore.fromDocuments(output, embeddings, {
            client: supabase,
            tableName: `a${file.filename} `
        })

        res.json({
            message: 'File processed and indexed successfully',
            fileName: `a${file.filename}`
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Failed to process and index the uploaded file.' })
    }
})

app.post('/message', async (req, res) => {
    try {
        const { question, history, fileName } = req.body;

        const llm = new ChatOpenAI({
            model: 'deepseek/deepseek-r1-0528:free',
            temperature: 0.8,
            streaming: true,
            apiKey: process.env.LLM_API_KEY,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
            }
        });

        const standAloneQuestionPrompt = PromptTemplate.fromTemplate(`Given some conversation history (if any) and a question,
convert the question in to a standalone question.
conversation history: {conv_history}
question: {question}
standalone question:`);

        const answerPrompt = PromptTemplate.fromTemplate(`You are a helpful and enthusiastic support bot...
    context: {context}
    conversation history: {conv_history}
    question: {question}
    answer:`);
        const questionChain = standAloneQuestionPrompt
            .pipe(llm)
            .pipe(new StringOutputParser());


        const vectorStore = new SupabaseVectorStore(embeddings, {
            client: supabase,
            tableName: fileName,
            queryName: fileName
        })

        const retriever = vectorStore.asRetriever()

        const retrieverChain = RunnableSequence.from([
            prevResult => prevResult.standAlone,
            retriever,
            combineDocument,
        ]);

        const answer = answerPrompt
            .pipe(llm)
            .pipe(new StringOutputParser());

        const answerChain = RunnableSequence.from([
            {
                standAlone: questionChain,
                originalInput: new RunnablePassthrough(),
            },
            {
                context: retrieverChain,
                question: ({ originalInput }) => originalInput.question,
                conv_history: ({ originalInput }) => originalInput.conv_history,
            },
            answer,
        ]);

        const stream = await answerChain.stream({
            question,
            conv_history: formatConvHistory(history),
        });

        for await (const chunk of stream) {
            res.write(chunk);
        }
        res.end();
    } catch (error) {
        console.error('Stream Error:', error);
        res.write(`event: error\ndata: ${JSON.stringify(error.message)}\n\n`);
        res.end();
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} `)
})