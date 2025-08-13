const { searchGoogle } = require('../search/googleClient');
const { Configuration, OpenAIApi } = require('openai');
const stringSimilarity = require('string-similarity');

const OPENAI_KEY = process.env.OPENAI_API_KEY;
let openai = null;
if (OPENAI_KEY) {
  const conf = new Configuration({ apiKey: OPENAI_KEY });
  openai = new OpenAIApi(conf);
}

function normalize(s='') {
  return s.replace(/\s+/g,' ').trim();
}
function tokenizeWords(text='') {
  return normalize(text).split(/\s+/).filter(Boolean);
}
function makeNgrams(words, n) {
  const out = [];
  for (let i=0;i+n<=words.length;i++) out.push(words.slice(i,i+n).join(' '));
  return out;
}
async function embeddingSimilarity(a, b) {
  if (!openai) return null;
  try {
    // Use the OpenAI embeddings endpoint
    const m = 'text-embedding-3-small';
    const r1 = await openai.createEmbedding({ model: m, input: a });
    const r2 = await openai.createEmbedding({ model: m, input: b });
    const e1 = r1.data.data[0].embedding;
    const e2 = r2.data.data[0].embedding;
    // cosine
    const dot = e1.reduce((s, v, i) => s + v * e2[i], 0);
    const n1 = Math.sqrt(e1.reduce((s,v)=>s+v*v,0));
    const n2 = Math.sqrt(e2.reduce((s,v)=>s+v*v,0));
    return dot / (n1 * n2);
  } catch (err) {
    console.error('Embedding error', err?.message || err);
    return null;
  }
}

async function checkPlagiarism(text, opts={}) {
  const ngramSize = opts.ngramSize||8;
  const step = opts.step||3;
  const maxQueries = opts.maxQueries||60;
  const words = tokenizeWords(text);
  if (words.length < ngramSize) return { score: 0, matches: [] };
  const ngrams = [];
  for (let i=0;i+ngramSize<=words.length;i+=step) {
    ngrams.push(words.slice(i,i+ngramSize).join(' '));
    if (ngrams.length >= maxQueries) break;
  }
  let matched = 0;
  const matches = [];
  for (const ng of ngrams) {
    const query = '"'+ng+'"';
    const results = await searchGoogle(query, 5);
    const found = results.find(r => (r.snippet && r.snippet.toLowerCase().includes(ng.toLowerCase())) || (r.title && r.title.toLowerCase().includes(ng.toLowerCase())));
    if (found) {
      matched++;
      matches.push({ ngram: ng, source: found });
    } else if (openai) {
      // fallback: fetch top results and run embedding similarity to detect paraphrase
      const top = await searchGoogle(ng.split(' ').slice(0,5).join(' '), 3);
      for (const t of top) {
        const sim = await embeddingSimilarity(ng, t.snippet || t.title || '');
        if (sim && sim > 0.80) { // heuristics
          matched++;
          matches.push({ ngram: ng, source: t, paraphraseScore: Math.round(sim*1000)/1000 });
          break;
        }
      }
    }
  }
  const ratio = matched / ngrams.length;
  const percentage = Math.round(ratio * 10000) / 100;
  return { score: percentage, matches, checked: ngrams.length, matched };
}

module.exports = { checkPlagiarism, embeddingSimilarity };
