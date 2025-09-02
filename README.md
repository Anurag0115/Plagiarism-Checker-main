Smart Plagiarism Checker (Google CSE + OpenAI embeddings)
This package contains a backend (Node/Express) and a frontend (React) implementing:

Google Custom Search for verbatim n-gram detection.
Optional OpenAI embeddings for paraphrase detection and improved comparison.
Rate limiting, logging (morgan), helmet security headers.
Simple dashboard that shows recent checks in-memory.
Getting started
Backend:
cd backend
npm install
copy .env.example -> .env and fill keys
npm run dev
Frontend:
cd frontend
npm install
npm start
You will need:

GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX (search engine id)
(optional but recommended) OPENAI_API_KEY
