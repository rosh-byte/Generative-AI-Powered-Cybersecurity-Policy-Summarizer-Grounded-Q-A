require('dotenv').config();
const express = require('express');
const cors = require('cors');
const policyRoutes = require('./routes/policyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount policy API routes
app.use('/api/policy', policyRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    project: 'AI-Powered Cybersecurity Policy Assistant',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/policy/health',
      summarize: 'POST /api/policy/summarize',
      chat: 'POST /api/policy/chat',
      roleGuidance: 'POST /api/policy/role-guidance',
      upload: 'POST /api/policy/upload'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error: ' + err.message });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  AI Cybersecurity Policy Assistant Server`);
  console.log(`📡  Server listening on http://localhost:${PORT}`);
  console.log(`🔑  Gemini API Key configured: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'YES' : 'NO (Update server/.env)'}`);
  console.log(`====================================================`);
});
