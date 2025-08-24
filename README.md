# 🤖 RAG-Based Chatbot

A **Retrieval-Augmented Generation (RAG)** powered chatbot that allows users to upload `.txt`, `.pdf`, or `.docx` files.  
The system processes and converts the document content into vector embeddings, stores them in **Supabase**, and enables semantic querying.  
Ask questions, and the chatbot retrieves relevant context from your documents to generate accurate responses.

🔗 **Live Project Review:** [View on LinkedIn](https://www.linkedin.com/posts/realmuhammadabrar_i-created-a-rag-based-chabot-from-scratch-activity-7363174252759384064-3yMz?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADCLKSoBXiBFK_JeKXmSGbiN7N8HhFV-xMc)

---

## ✨ Features

- 📄 **Upload** `.txt`, `.pdf`, or `.docx` files  
- 🔍 **Convert** document content into vector embeddings using **Ollama** + **nomic-embed-text**  
- 💾 **Store** embeddings in **Supabase** (vector database)  
- 💬 **Ask questions** and get context-aware answers based on your uploaded documents  
- ⚡ **Fast, local inference** with **LangChain** for RAG pipeline  
- 🖥️ **Full-stack interface** built with **MERN stack** + **TypeScript**

> 💡 **Note:** Using Deepseek via OpenRouter may result in slower responses. For faster performance, other models are recommended.

---

## 🛠️ Technologies Used

- **LangChain** – Framework for building RAG pipelines  
- **Supabase** – Vector storage and backend services  
- **Ollama** – Local hosting of embedding model (`nomic-embed-text`)  
- **MERN Stack** – MongoDB, Express.js, React, Node.js (with TypeScript)  
- **TypeScript** – For type-safe full-stack development  

---

## 🚀 How to Run the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```
2. **Start the backend server**
   ```bash
   cd backend
   node index.js
   ```
3. **Start the frontend**
   ```bash
   cd frontend
   pnpm run dev
   ```

4. **Open your browser and navigate to**
   ```bash
   http://localhost:5173
   asfasfa
   ```
## 🧩 Setup Requirements ##
   ```bash
   ollama pull nomic-embed-text
   ```
**environment variables in```.env```**
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
OLLAMA_MODEL=nomic-embed-text
```
**⭐ If you found this project helpful, don’t forget to check out the LinkedIn post
 and connect!**


 

   

