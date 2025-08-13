// src/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://plagarism-checker-zldl.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// Function to check plagiarism using axios
export async function checkTextPlagiarism(text) {
  try {
    const response = await api.post('/api/check/text', { text });
    return response.data;
  } catch (error) {
    // You can add better error handling here
    throw error;
  }
}

export default api;
