const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function parseFileBuffer(file) {
  const name = (file.originalname || '').toLowerCase();
  if (name.endsWith('.pdf') || file.mimetype === 'application/pdf') {
    const data = await pdfParse(file.buffer);
    return data.text || '';
  }
  if (name.endsWith('.docx') || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const res = await mammoth.extractRawText({ buffer: file.buffer });
    return res.value || '';
  }
  return file.buffer.toString('utf8');
}

module.exports = { parseFileBuffer };
