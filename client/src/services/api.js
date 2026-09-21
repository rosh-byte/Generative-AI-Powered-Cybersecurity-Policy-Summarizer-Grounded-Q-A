import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/policy';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout for AI generation
});

function extractErrorMessage(error, defaultMsg) {
  const errData = error.response?.data?.error || error.response?.data;
  if (!errData) return error.message || defaultMsg;
  
  if (typeof errData === 'string') {
    try {
      const parsed = JSON.parse(errData);
      if (parsed.error?.message) {
        if (parsed.error.message.includes('API key not valid') || parsed.error.message.includes('API_KEY_INVALID')) {
          return 'Invalid or missing Gemini API Key. Please add a valid API key in server/.env from Google AI Studio (https://aistudio.google.com/).';
        }
        return parsed.error.message;
      }
      if (parsed.message) return parsed.message;
    } catch (_) {
      if (errData.includes('API key not valid') || errData.includes('API_KEY_INVALID')) {
        return 'Invalid or missing Gemini API Key. Please add a valid API key in server/.env from Google AI Studio (https://aistudio.google.com/).';
      }
    }
    return errData;
  }
  
  if (typeof errData === 'object') {
    if (errData.error?.message) {
      if (errData.error.message.includes('API key not valid') || errData.error.message.includes('API_KEY_INVALID')) {
        return 'Invalid or missing Gemini API Key. Please add a valid API key in server/.env from Google AI Studio (https://aistudio.google.com/).';
      }
      return errData.error.message;
    }
    if (errData.message) return errData.message;
  }
  return defaultMsg;
}

/**
 * Check Backend Health & API Key Status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('API Health check failed:', error);
    return {
      status: 'error',
      apiConfigured: false,
      message: extractErrorMessage(error, 'Cannot connect to backend server at http://localhost:5000')
    };
  }
};

/**
 * Summarize Policy Text
 */
export const summarizePolicy = async (policyText) => {
  try {
    const response = await apiClient.post('/summarize', { policyText });
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, 'Failed to communicate with AI Policy Summarizer service.');
    throw new Error(errorMsg);
  }
};

/**
 * Ask Policy Q&A Question
 */
export const askPolicyQuestion = async (policyText, question) => {
  try {
    const response = await apiClient.post('/chat', { policyText, question });
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, 'Failed to send question to AI Chatbot service.');
    throw new Error(errorMsg);
  }
};

/**
 * Get Role-Based Compliance Guidance
 */
export const getRoleGuidance = async (policyText, role) => {
  try {
    const response = await apiClient.post('/role-guidance', { policyText, role });
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, 'Failed to fetch role-based guidance.');
    throw new Error(errorMsg);
  }
};

/**
 * Upload File (PDF or TXT)
 */
export const uploadPolicyFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, 'Failed to upload and parse file.');
    throw new Error(errorMsg);
  }
};
