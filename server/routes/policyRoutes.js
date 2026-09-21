const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { 
  summarizePolicy, 
  answerPolicyQuestion, 
  generateRoleGuidance, 
  isValidApiKey,
  formatErrorMessage 
} = require('../services/geminiService');

// Multer in-memory storage for file processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Health check & API status endpoint
 */
router.get('/health', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = isValidApiKey(apiKey);

  return res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    apiConfigured: isKeyConfigured,
    message: isKeyConfigured
      ? 'Backend active and Gemini API key is configured.'
      : 'Backend active with offline analysis engine. (Configure GEMINI_API_KEY in server/.env to use live Gemini API)'
  });
});

/**
 * Endpoint to extract text from uploaded PDF or TXT files
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const file = req.file;
    let extractedText = '';

    const isPdf = file.mimetype === 'application/pdf' || (file.originalname && file.originalname.toLowerCase().endsWith('.pdf'));

    if (isPdf) {
      try {
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse({ data: file.buffer });
        const result = await parser.getText();
        extractedText = result?.text || '';
        await parser.destroy().catch(() => {});
      } catch (pdfErr) {
        console.error('PDF extraction failed:', pdfErr);
        // Fallback: try raw text buffer string if simple text-based format
        extractedText = file.buffer.toString('utf-8').replace(/[^\x20-\x7E\t\n\r]/g, ' ');
        if (!extractedText || extractedText.trim().length < 20) {
          return res.status(422).json({ 
            error: 'Failed to extract text from PDF. The PDF may be scanned/image-based or encrypted. Please copy & paste the text directly into the Paste Text tab.' 
          });
        }
      }
    } else {
      // Plain text or markdown
      extractedText = file.buffer.toString('utf-8');
    }

    extractedText = extractedText.trim();

    if (!extractedText || extractedText.length < 10) {
      return res.status(400).json({ error: 'Uploaded file appears to be empty or contains insufficient text.' });
    }

    return res.json({
      filename: file.originalname,
      characterCount: extractedText.length,
      policyText: extractedText
    });
  } catch (error) {
    console.error('File Upload Route Error:', error);
    return res.status(500).json({ error: 'Error processing uploaded file: ' + error.message });
  }
});

/**
 * Endpoint to summarize policy text
 */
router.post('/summarize', async (req, res) => {
  try {
    const { policyText } = req.body;

    if (!policyText || typeof policyText !== 'string' || policyText.trim().length === 0) {
      return res.status(400).json({ error: 'Policy text is required.' });
    }

    if (policyText.trim().length < 20) {
      return res.status(400).json({ error: 'Policy text is too short. Please provide a detailed policy document.' });
    }

    const MAX_CHARS = 50000;
    const truncatedText = policyText.length > MAX_CHARS ? policyText.substring(0, MAX_CHARS) : policyText;

    const summaryResult = await summarizePolicy(truncatedText);
    return res.json({
      success: true,
      data: summaryResult,
      isTruncated: policyText.length > MAX_CHARS
    });
  } catch (error) {
    console.error('Summarize API Error:', error.message);
    const cleanMsg = formatErrorMessage(error);
    return res.status(500).json({ error: cleanMsg });
  }
});

/**
 * Endpoint for Grounded Policy Q&A
 */
router.post('/chat', async (req, res) => {
  try {
    const { policyText, question } = req.body;

    if (!policyText || typeof policyText !== 'string' || policyText.trim().length === 0) {
      return res.status(400).json({ error: 'Policy text is required to answer questions.' });
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question text cannot be empty.' });
    }

    const MAX_CHARS = 40000;
    const truncatedText = policyText.length > MAX_CHARS ? policyText.substring(0, MAX_CHARS) : policyText;

    const chatResult = await answerPolicyQuestion(truncatedText, question.trim());
    return res.json({
      success: true,
      data: chatResult
    });
  } catch (error) {
    console.error('Chat API Error:', error.message);
    const cleanMsg = formatErrorMessage(error);
    return res.status(500).json({ error: cleanMsg });
  }
});

/**
 * Endpoint for Role-Based Guidance
 */
router.post('/role-guidance', async (req, res) => {
  try {
    const { policyText, role } = req.body;

    if (!policyText || typeof policyText !== 'string' || policyText.trim().length === 0) {
      return res.status(400).json({ error: 'Policy text is required for role-based guidance.' });
    }

    if (!role) {
      return res.status(400).json({ error: 'Target role is required.' });
    }

    const MAX_CHARS = 40000;
    const truncatedText = policyText.length > MAX_CHARS ? policyText.substring(0, MAX_CHARS) : policyText;

    const guidanceResult = await generateRoleGuidance(truncatedText, role);
    return res.json({
      success: true,
      data: guidanceResult
    });
  } catch (error) {
    console.error('Role Guidance API Error:', error.message);
    const cleanMsg = formatErrorMessage(error);
    return res.status(500).json({ error: cleanMsg });
  }
});

module.exports = router;
