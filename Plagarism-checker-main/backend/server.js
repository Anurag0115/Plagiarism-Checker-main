const express = require('express');
const cors = require('cors');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const { parseFileBuffer } = require('./utils/parser');
const { checkPlagiarism, embeddingSimilarity } = require('./utils/plagiarism');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(helmet());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: (parseInt(process.env.MAX_QUERIES_PER_MINUTE || '60') * 1000) || 60000,
  max: 120, // global requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const upload = multer({ storage: multer.memoryStorage() });

const PORT = process.env.PORT || 5000;

// in-memory dashboard store (simple)
const recentChecks = []; // { type, score, timestamp, detail }

app.get('/', (req,res)=>res.json({ status:'ok' }));

app.get('/api/dashboard', (req,res)=>{
  // return last 50 checks
  res.json({ success:true, recent: recentChecks.slice(-50).reverse() });
});

app.post('/api/check/text', async (req,res)=>{
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text required' });
    const result = await checkPlagiarism(text, { ngramSize:8, step:3, maxQueries:60 });
    recentChecks.push({ type:'text', score: result.score, timestamp: Date.now(), detail: { checked: result.checked, matched: result.matched } });
    res.json({ success:true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'server_error' });
  }
});

app.post('/api/check/file', upload.single('file'), async (req,res)=>{
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    const text = await parseFileBuffer(req.file);
    const result = await checkPlagiarism(text, { ngramSize:8, step:3, maxQueries:80 });
    recentChecks.push({ type:'file', score: result.score, timestamp: Date.now(), detail: { checked: result.checked, matched: result.matched, filename: req.file.originalname } });
    res.json({ success:true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'server_error' });
  }
});

app.post('/api/compare', upload.fields([{ name:'file1' }, { name:'file2' }]), async (req,res)=>{
  try {
    let text1 = req.body.text1;
    let text2 = req.body.text2;
    if (req.files && req.files.file1 && req.files.file1[0]) text1 = await parseFileBuffer(req.files.file1[0]);
    if (req.files && req.files.file2 && req.files.file2[0]) text2 = await parseFileBuffer(req.files.file2[0]);
    if (!text1 || !text2) return res.status(400).json({ error:'Provide both texts or files' });

    // first try fast string similarity
    const simFast = require('string-similarity').compareTwoStrings(text1.slice(0,100000), text2.slice(0,100000));
    let percentage = Math.round(simFast * 10000) / 100;

    let embedSim = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        embedSim = await require('./utils/plagiarism').embeddingSimilarity(text1.slice(0,2000), text2.slice(0,2000));
        if (embedSim !== null) {
          percentage = Math.round(embedSim * 10000) / 100;
        }
      } catch(e){ console.error('embed compare failed', e); }
    }

    recentChecks.push({ type:'compare', score: percentage, timestamp: Date.now(), detail: { len1: text1.length, len2: text2.length } });
    res.json({ success:true, similarity: percentage, sampleComparison: { len1:text1.length, len2:text2.length }, embedSim });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'server_error' });
  }
});

app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`));
