# 🔍 Smart Plagiarism Checker

A **full-stack plagiarism checker** that combines **Google Custom Search API** for verbatim detection with optional **OpenAI embeddings** for paraphrase detection.  

It includes:  
- 📝 **Google Custom Search** for n-gram plagiarism detection  
- 🤖 **OpenAI embeddings** for semantic similarity checks  
- 🔒 **Secure backend** with rate limiting, logging, and `helmet` headers  
- 📊 **Frontend dashboard** to view recent checks (in-memory storage)  

---

## 🚀 Features
- Google CSE-based **verbatim detection**
- OpenAI embeddings for **semantic similarity & paraphrase detection**
- Express.js backend with:
  - `morgan` logging
  - `helmet` security headers
  - API rate limiting
- React frontend with simple **real-time dashboard**
- In-memory store of **recent checks**

---

## 📂 Project Structure

├── backend/ # Node.js/Express API server
│ ├── src/ # Backend source code
│ ├── .env.example # Example env variables
│ ├── package.json
│ └── ...
├── frontend/ # React-based UI
│ ├── src/ # React components
│ ├── package.json
│ └── ...
└── README.md
