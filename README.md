# 🛡️ AI-Powered Cybersecurity Policy Assistant Using Generative AI

> **College AI Project (LO 6.1 & LO 6.2 Implementation)**  
> A full-stack web application designed to help users understand, summarize, query, and enforce complex cybersecurity policies using Generative AI (Google Gemini API).

---

## 📋 Problem Statement
Cybersecurity policies in organizations and universities are often dense, lengthy, legalistic, and difficult for employees or students to digest. As a result, critical security rules (such as Multi-Factor Authentication requirements, remote work encryption guidelines, and incident reporting deadlines) are frequently overlooked, leading to heightened security risks and compliance breaches.

## 🎯 Objective
This project demonstrates **Learning Outcomes 6.1 and 6.2** by implementing a practical Generative AI feature: an **AI Cybersecurity Policy Summarizer & Grounded Q&A Chatbot**. It converts complex policy documents into clear, structured summaries, answers questions strictly constrained to the policy content, and provides persona-tailored action checklists for different organizational roles.

---

## ✨ Main Features

### 1. 🖥️ Cybersecurity Dashboard UI
- Sleek, modern dark-themed cybersecurity interface with responsive cards and status badges.
- Live backend connection status and Gemini API key initialization indicator.
- 1-click **Quick Demo Presets** for instant demonstration.

### 2. 📄 Policy Document Input
- **Paste Policy Text**: Full-featured text editor with word counter, character counter, and estimated reading time.
- **Upload Policy File**: Supports `.pdf` and `.txt` file parsing directly in memory.
- **Preloaded Realistic Sample Policies**: Includes 3 ready-to-use policies (*Remote Access & MFA*, *Data Classification & Incident Response*, *Acceptable Use & Device Security*).

### 3. 🤖 AI Policy Summarizer (LO 6.1 Core Feature)
Sends policy text to Google Gemini with structured JSON output constraints, generating 5 clear cards:
1. **Simple Overview Summary**: 2-3 sentence executive summary.
2. **Key Security Requirements**: Essential compliance mandates.
3. **Important Rules & Restrictions**: Critical operational rules.
4. **Employee Actions Required**: Direct actionable steps for staff.
5. **Potential Risks if Ignored**: Threat vectors, penalties, and security risks of non-compliance.

### 4. 💬 Grounded Policy Q&A Chatbot
- Interactive chat feed with quick question chips (e.g., *"Is MFA required for remote employees?"*).
- **Strict Grounding Rule**: Answers ONLY using provided policy content.
- **Fallback Response**: If the answer is not present in the policy, the chatbot responds strictly:
  > *"This information is not available in the provided policy."*

### 5. 👥 Role-Based Guidance
Generates persona-tailored compliance checklists and focus areas for selected roles:
- 👤 **Employee**
- 👔 **Manager**
- 💻 **IT Administrator**
- 🛡️ **Security Officer**

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + Vite 8 |
| **Styling** | Tailwind CSS v4 + Lucide React Icons |
| **API Client** | Axios |
| **Backend Runtime** | Node.js (v25+) + Express |
| **Generative AI SDK** | `@google/genai` (Google Gemini API - `gemini-2.5-flash`) |
| **File Parser** | Multer + `pdf-parse` |
| **Environment Config** | `dotenv` |

---

## 🏗️ Project Structure

```
AI cia/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Dashboard Header & Health Status
│   │   │   ├── PolicyInput.jsx      # Input Area, File Dropzone & Presets
│   │   │   ├── PolicySummary.jsx    # 5 Executive Summary Cards
│   │   │   ├── PolicyChatbot.jsx    # Grounded Q&A Chatbot Interface
│   │   │   ├── RoleGuidance.jsx     # Persona-Based Guidance Cards
│   │   │   ├── StatusBanner.jsx     # System Alerts & Key Missing Warnings
│   │   │   └── Footer.jsx           # Disclaimer & Project Attribution
│   │   ├── data/
│   │   │   └── samplePolicies.js    # Pre-built realistic sample policies
│   │   ├── services/
│   │   │   └── api.js               # Frontend API Client for Express Server
│   │   ├── App.jsx                  # Main Application Dashboard
│   │   ├── index.css                # Dark Cybersecurity Theme Styles
│   │   └── main.jsx                 # Vite Entry Point
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── routes/
│   │   └── policyRoutes.js      # REST API endpoints (summarize, chat, roles, upload, health)
│   ├── services/
│   │   └── geminiService.js     # Gemini API Prompts & JSON Parsing
│   ├── server.js                # Express app entry & CORS config
│   ├── .env.example             # Environment Variable Template
│   ├── .env                     # Local Environment File (GEMINI_API_KEY)
│   └── package.json
├── .gitignore                  # Git Ignore rules (.env, node_modules)
├── package.json                # Root package configuration
└── README.md                   # Project Documentation
```

---

## 🚀 Installation & Configuration

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- A Google Gemini API Key (free from [Google AI Studio](https://aistudio.google.com/))

### Step 1: Clone or Navigate to Project Directory
```bash
cd "c:\Users\Rolston\Desktop\AI cia"
```

### Step 2: Install Dependencies
Install dependencies for both `server` and `client`:

```bash
# Option A: Install all dependencies at once
npm run install:all

# Option B: Install manually
cd server && npm install
cd ../client && npm install
```

### Step 3: Configure Gemini API Key
1. Open the file `server/.env`.
2. Add your Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
> ⚠️ **Security Note**: Never commit `server/.env` to GitHub. It is included in `.gitignore`.

---

## 🏃 Running the Application

### Option A: Run Backend & Frontend in separate terminals

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
```
*Backend will run on `http://localhost:5000`*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*Frontend will run on `http://localhost:3000` or `http://localhost:5173`*

---

## 🎬 3-Minute Demonstration Guide (Faculty / Evaluators Flow)

To demonstrate LO 6.1 and LO 6.2 quickly to your faculty:

1. **Open Application**: Navigate to `http://localhost:3000` in your web browser.
2. **Load Sample Policy**: Click **"Load Quick Demo Preset"** in the top navigation bar. (Or paste your own policy text / upload a `.pdf` file).
3. **Click "Summarize Policy (AI)"**: Watch the animated loader parse the document. Review the **5 structured executive summary cards** (Overview, Key Requirements, Rules, Employee Actions, Potential Risks).
4. **Ask a Grounded Question in Chatbot**:
   - Click quick chip: *"Is MFA required for remote employees?"* -> Observe accurate policy answer grounded in text.
5. **Test Grounding Fallback**:
   - Type a question not present in the policy (e.g. *"What is the refund policy for software purchases?"*).
   - Observe the exact grounded fallback response:  
     > *"This information is not available in the provided policy."*
6. **Select Role Guidance**:
   - Scroll to **Role-Based Guidance**.
   - Click **"Employee"**, **"IT Administrator"**, or **"Security Officer"** to show role-specific compliance checklists.

---

## ⚠️ Limitations
- **Token Limits**: Extremely long policies (>50,000 characters) are truncated before being sent to the LLM to stay within context limits.
- **PDF Formatting**: Complex multi-column PDFs with embedded images may require text pre-processing.

## 🔮 Future Scope
- **Policy Comparison Tool**: Compare two versions of a policy to highlight updated compliance clauses.
- **Compliance Score Calculator**: Assess organizational readiness score based on policy coverage.
- **Multilingual Translation**: Summarize policies into regional languages for global workforces.

---

## 📜 Legal & AI Disclaimer
*AI-generated summaries, Q&A responses, and role recommendations are generated using Google Gemini AI to assist policy comprehension. Always verify critical compliance actions against official organizational policy documents.*
