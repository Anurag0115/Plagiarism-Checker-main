const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_CSE_API_KEY;
const CX = process.env.GOOGLE_CSE_CX;

if (!API_KEY || !CX) console.warn('WARNING: GOOGLE_CSE_API_KEY or GOOGLE_CSE_CX not set. Web searches will fail.');

async function searchGoogle(query, num=5) {
  try {
    const url = 'https://www.googleapis.com/customsearch/v1';
    const res = await axios.get(url, { params: { key: API_KEY, cx: CX, q: query, num } });
    const items = res.data.items || [];
    return items.map(it => ({ title: it.title, snippet: it.snippet, link: it.link }));
  } catch (err) {
    console.error('Google CSE error', err?.response?.data || err.message);
    return [];
  }
}

module.exports = { searchGoogle };
