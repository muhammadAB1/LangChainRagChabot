```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>RAG-Based Chatbot</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f7f9;
      color: #333;
      line-height: 1.6;
      padding: 20px;
    }
    .container {
      max-width: 900px;
      margin: auto;
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul {
      padding-left: 20px;
    }
    code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.95em;
    }
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.95em;
    }
    .note {
      background: #fffacd;
      padding: 10px 15px;
      border-left: 4px solid #ffd700;
      margin: 20px 0;
      font-style: italic;
    }
  </style>
</head>
<body>

<div class="container">
  <h1>RAG-Based Chatbot</h1>
  <p>A Retrieval-Augmented Generation (RAG) powered chatbot that allows users to upload <code>.txt</code>, <code>.pdf</code>, or <code>.docx</code> files. The system processes and converts the document content into vector embeddings, stores them in Supabase, and enables semantic querying. Ask questions, and the chatbot retrieves relevant context from your documents to generate accurate responses.</p>

  <p><strong>🔗 Live Project Review:</strong> <a href="https://www.linkedin.com/posts/realmuhammadabrar_i-created-a-rag-based-chabot-from-scratch-activity-7363174252759384064-3yMz?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADCLKSoBXiBFK_JeKXmSGbiN7N8HhFV-xMc" target="_blank">View on LinkedIn</a></p>

  <h2>✨ Features</h2>
  <ul>
    <li><strong>📄 Upload</strong> <code>.txt</code>, <code>.pdf</code>, or <code>.docx</code> files</li>
    <li><strong>🔍 Convert</strong> document content into vector embeddings using <strong>Ollama</strong> and <strong>nomic-embed-text</strong></li>
    <li><strong>💾 Store</strong> embeddings in <strong>Supabase</strong> (vector database)</li>
    <li><strong>💬 Ask questions</strong> and get context-aware answers based on your uploaded documents</li>
    <li><strong>⚡ Fast, local inference</strong> with <strong>LangChain</strong> for RAG pipeline</li>
    <li><strong>🖥️ Full-stack interface</strong> built with <strong>MERN stack</strong> and <strong>TypeScript</strong></li>
  </ul>

  <div class="note">
    💡 <strong>Note:</strong> Using Deepseek via OpenRouter may result in slower responses. For faster performance, other models are recommended.
  </div>

  <h2>🛠️ Technologies Used</h2>
  <ul>
    <li><strong>LangChain</strong> – Framework for building RAG pipelines</li>
    <li><strong>Supabase</strong> – Vector storage and backend services</li>
    <li><strong>Ollama</strong> – Local hosting of embedding model (<code>nomic-embed-text</code>)</li>
    <li><strong>MERN Stack</strong> – MongoDB, Express.js, React, Node.js (with TypeScript)</li>
    <li><strong>TypeScript</strong> – For type-safe full-stack development</li>
  </ul>

  <h2>🚀 How to Run the Project</h2>
  <ol>
    <li>Clone the repository:
      <pre>git clone https://github.com/your-username/your-repo-name.git<br>cd your-repo-name</pre>
    </li>
    <li>Start the backend server:
      <pre>cd backend<br>node index.js</pre>
    </li>
    <li>In a new terminal, start the frontend:
      <pre>cd frontend<br>pnpm run dev</pre>
    </li>
    <li>Open your browser and navigate to the provided frontend URL (usually <a href="http://localhost:5173">http://localhost:5173</a>).</li>
    <li>Upload a document and start chatting!</li>
  </ol>

  <h2>📂 Project Structure</h2>
  <pre>
project-root/
│
├── backend/            # Node.js + Express server (TypeScript)
│   └── index.js        # Entry point – runs the API and RAG logic
│
├── frontend/           # React app (TypeScript + pnpm)
│   └── src/            # Components, hooks, UI logic
│
├── .env                # Environment variables (Supabase URL, API keys, etc.)
└── README.md           # You are here!
  </pre>

  <h2>🧩 Setup Requirements</h2>
  <ul>
    <li><a href="https://ollama.com" target="_blank">Ollama</a> installed and running locally</li>
    <li>Pull the <code>nomic-embed-text</code> model:
      <pre>ollama pull nomic-embed-text</pre>
    </li>
    <li>Supabase project with vector database enabled</li>
    <li>Environment variables configured in <code>.env</code>:
      <pre>SUPABASE_URL=your_supabase_url<br>SUPABASE_KEY=your_supabase_anon_key<br>OLLAMA_MODEL=nomic-embed-text</pre>
    </li>
  </ul>

  <h2>🌟 Acknowledgments</h2>
  <p>Inspired by the need for fast, private, and customizable document-based AI assistants. This project demonstrates how powerful local models and modern AI frameworks can be combined into a production-ready chatbot.</p>
  <p>Big thanks to the open-source community behind LangChain, Ollama, and Supabase.</p>

  <h2>📬 Feedback & Contributions</h2>
  <p>Feel free to <strong>open an issue</strong> or <strong>submit a pull request</strong>. Your feedback helps improve the project!</p>

  <hr />
  <p><strong>⭐ If you found this project helpful, don’t forget to check out the <a href="https://www.linkedin.com/posts/realmuhammadabrar_i-created-a-rag-based-chabot-from-scratch-activity-7363174252759384064-3yMz?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADCLKSoBXiBFK_JeKXmSGbiN7N8HhFV-xMc" target="_blank">LinkedIn post</a> and connect!</strong></p>
</div>

</body>
</html>
```
