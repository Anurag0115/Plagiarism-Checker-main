# Backend

## Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and add your keys:
   - GOOGLE_CSE_API_KEY
   - GOOGLE_CSE_CX
   - OPENAI_API_KEY (optional but recommended for paraphrase detection)
4. `npm run dev` or `npm start`

Endpoints:
- GET /api/dashboard
- POST /api/check/text  { text }
- POST /api/check/file  multipart form file 'file'
- POST /api/compare     either text1/text2 or file1/file2
