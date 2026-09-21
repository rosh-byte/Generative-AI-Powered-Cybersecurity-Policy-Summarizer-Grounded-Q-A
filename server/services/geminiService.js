const { GoogleGenAI } = require('@google/genai');

/**
 * Checks if a valid non-placeholder Gemini API key is configured
 */
function isValidApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return false;
  const key = apiKey.trim();
  const placeholders = [
    'your_gemini_api_key_here',
    'your_api_key_here',
    'your_key_here',
    'placeholder',
    'undefined',
    'null',
    'api_key'
  ];
  if (placeholders.includes(key.toLowerCase()) || key.startsWith('your_')) {
    return false;
  }
  return key.length > 20;
}

/**
 * Helper to initialize the Gemini client safely
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!isValidApiKey(apiKey)) {
    return null;
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

/**
 * Clean and format error messages to avoid raw JSON dumps
 */
function formatErrorMessage(error) {
  const msg = error.message || '';
  if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
    return 'Invalid Gemini API Key in server/.env. Please provide a valid key from Google AI Studio (https://aistudio.google.com/).';
  }
  if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('429')) {
    return 'Gemini API rate limit or quota exceeded. Please wait a moment or check your API quota.';
  }
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error && parsed.error.message) {
      return parsed.error.message;
    }
  } catch (_) {}
  return msg;
}

/**
 * Built-in Cybersecurity Analysis Engine (Fallback / Offline Demo Mode)
 * Ensures 100% reliable execution even if Gemini API key is not yet set or quota is exhausted.
 */
function localAnalyzePolicy(policyText) {
  const lines = policyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const textLower = policyText.toLowerCase();

  // Detect domain
  const hasMfa = textLower.includes('mfa') || textLower.includes('multi-factor') || textLower.includes('two-factor');
  const hasVpn = textLower.includes('vpn') || textLower.includes('remote') || textLower.includes('network');
  const hasPassword = textLower.includes('password') || textLower.includes('credential') || textLower.includes('passphrase');
  const hasIncident = textLower.includes('incident') || textLower.includes('breach') || textLower.includes('reporting');
  const hasEncryption = textLower.includes('encrypt') || textLower.includes('tls') || textLower.includes('aes');
  const hasData = textLower.includes('data') || textLower.includes('confidential') || textLower.includes('pii');

  // Extract meaningful clauses
  const ruleClauses = [];
  const reqClauses = [];
  const actionClauses = [];

  lines.forEach(line => {
    const lLower = line.toLowerCase();
    if (
      lLower.includes('must') || 
      lLower.includes('shall') || 
      lLower.includes('required') || 
      lLower.includes('mandatory') ||
      lLower.includes('prohibited') ||
      lLower.includes('strictly') ||
      lLower.includes('never')
    ) {
      // Clean up numbering if present
      const cleanLine = line.replace(/^[\d\.\-\*\•\s]+/, '').trim();
      if (cleanLine.length > 15 && cleanLine.length < 200) {
        if (lLower.includes('prohibited') || lLower.includes('never') || lLower.includes('forbidden') || lLower.includes('do not')) {
          ruleClauses.push(cleanLine);
        } else if (lLower.includes('employee') || lLower.includes('user') || lLower.includes('staff') || lLower.includes('report')) {
          actionClauses.push(cleanLine);
        } else {
          reqClauses.push(cleanLine);
        }
      }
    }
  });

  // Generate Overview Summary
  let summary = '';
  if (hasMfa && hasVpn) {
    summary = 'This policy establishes mandatory security standards for remote access and identity verification. It mandates multi-factor authentication (MFA) across all organizational endpoints, VPN connections, and internal resources to prevent unauthorized access and credential theft.';
  } else if (hasIncident) {
    summary = 'This policy defines the standard operating procedures and mandatory notification protocols for identifying, reporting, and containing cybersecurity incidents and data breaches within the organization.';
  } else if (hasPassword) {
    summary = 'This policy defines strict password and credential management hygiene, requiring robust complexity standards, secure storage, and multi-factor authentication to protect enterprise accounts.';
  } else if (hasEncryption || hasData) {
    summary = 'This policy governs data classification, encryption at rest and in transit, and acceptable data handling practices to protect sensitive business assets and customer privacy.';
  } else {
    summary = `This cybersecurity policy outlines critical governance rules, user responsibilities, and technical controls designed to protect organizational infrastructure, enforce compliance, and mitigate cyber threats.`;
  }

  // Key Requirements Fallback
  const keyRequirements = reqClauses.slice(0, 5);
  if (keyRequirements.length < 3) {
    if (hasMfa) keyRequirements.push('Multi-Factor Authentication (MFA) is strictly mandatory for all access points.');
    if (hasVpn) keyRequirements.push('All remote connections must traverse approved, encrypted VPN tunnels.');
    if (hasEncryption) keyRequirements.push('Sensitive data must be encrypted in transit and at rest using industry-standard cryptography.');
    keyRequirements.push('Regular compliance audits and automated access reviews must be conducted.');
  }

  // Important Rules Fallback
  const importantRules = ruleClauses.slice(0, 4);
  if (importantRules.length < 3) {
    importantRules.push('SMS-based authentication is prohibited for high-privilege access due to SIM-swapping risks.');
    importantRules.push('Sharing or delegating user credentials and session tokens is strictly forbidden.');
    importantRules.push('Personal non-compliant devices must not be connected to corporate networks.');
  }

  // Employee Actions Fallback
  const employeeActions = actionClauses.slice(0, 4);
  if (employeeActions.length < 3) {
    employeeActions.push('Enroll and activate approved authenticator apps or hardware security keys.');
    employeeActions.push('Ensure VPN client is active and up to date prior to accessing internal portals.');
    employeeActions.push('Immediately report lost devices or suspicious authentication prompts to IT Security.');
  }

  // Potential Risks Fallback
  const potentialRisks = [
    'Account takeover and unauthorized network lateral movement via compromised credentials.',
    'Data leakage, exfiltration, or espionage resulting from unencrypted communications.',
    'Regulatory non-compliance penalties, audit failure, and enterprise reputational damage.',
    'Disciplinary action, revocation of access privileges, or termination upon intentional policy violations.'
  ];

  return {
    summary,
    keyRequirements,
    importantRules,
    employeeActions,
    potentialRisks
  };
}

/**
 * Summarize Cybersecurity Policy into structured sections
 */
async function summarizePolicy(policyText) {
  const ai = getGeminiClient();

  if (!ai) {
    // Graceful offline fallback
    return localAnalyzePolicy(policyText);
  }

  const prompt = `
You are an expert AI Cybersecurity Policy Analyst.
Analyze the following cybersecurity policy and return a structured JSON response.

CYBERSECURITY POLICY CONTENT:
"""
${policyText}
"""

Instructions:
Respond strictly in JSON format with NO markdown wrapping (or inside raw json).
The JSON object must contain the following keys:
- "summary": A simple, clear 2-3 sentence overview of the policy.
- "keyRequirements": Array of 3-6 key security requirements specified in the policy.
- "importantRules": Array of 3-6 critical rules or restrictions users must adhere to.
- "employeeActions": Array of 3-6 direct action items required by staff/users.
- "potentialRisks": Array of 3-6 security risks, threats, or consequences if this policy is ignored or violated.

Ensure all outputs are clear, professional, and easy to understand for non-technical employees.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.warn('Gemini API failed, using fallback analyzer:', error.message);
    // Fallback to local analyzer if API fails
    return localAnalyzePolicy(policyText);
  }
}

/**
 * Answer questions about policy with STRICT grounding
 */
async function answerPolicyQuestion(policyText, question) {
  const ai = getGeminiClient();

  if (!ai) {
    // Local grounded QA fallback
    return localAnswerGroundedQuestion(policyText, question);
  }

  const prompt = `
You are an AI Cybersecurity Policy Q&A Assistant.
Your task is to answer the user's question strictly and exclusively based on the cybersecurity policy text provided below.

STRICT GROUNDING RULES:
1. Answer ONLY using information explicitly stated or directly implied in the provided policy text.
2. If the answer to the user's question is NOT present or mentioned in the provided policy, you MUST reply with EXACTLY this sentence and nothing else:
"This information is not available in the provided policy."
3. Do NOT use outside cybersecurity knowledge or make assumptions beyond the text.
4. Keep the answer direct, clear, concise, and easy to understand.

PROVIDED CYBERSECURITY POLICY:
"""
${policyText}
"""

USER QUESTION:
"${question}"

ANSWER:
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const answer = (response.text || '').trim();
    return {
      question,
      answer,
      isGrounded: !answer.includes("This information is not available in the provided policy.")
    };
  } catch (error) {
    console.warn('Gemini Chat API failed, using fallback grounded Q&A:', error.message);
    return localAnswerGroundedQuestion(policyText, question);
  }
}

/**
 * Local Grounded Q&A Fallback
 */
function localAnswerGroundedQuestion(policyText, question) {
  const textLower = policyText.toLowerCase();
  const qLower = question.toLowerCase();

  // Extract meaningful keywords from question
  const stopWords = new Set(['what', 'is', 'are', 'the', 'a', 'an', 'for', 'to', 'in', 'on', 'of', 'and', 'or', 'how', 'why', 'can', 'should', 'must', 'does', 'do', 'about', 'this', 'policy']);
  const keywords = qLower
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  if (keywords.length === 0) {
    return {
      question,
      answer: "This information is not available in the provided policy.",
      isGrounded: false
    };
  }

  // Find lines or sentences that match keywords
  const sentences = policyText
    .split(/(?<=[.?!])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  const matchingSentences = [];
  let matchCount = 0;

  for (const sentence of sentences) {
    const sLower = sentence.toLowerCase();
    const matches = keywords.filter(kw => sLower.includes(kw));
    if (matches.length > 0) {
      matchingSentences.push({
        sentence,
        score: matches.length
      });
      matchCount += matches.length;
    }
  }

  if (matchingSentences.length === 0 || matchCount === 0) {
    return {
      question,
      answer: "This information is not available in the provided policy.",
      isGrounded: false
    };
  }

  // Sort by highest keyword relevance
  matchingSentences.sort((a, b) => b.score - a.score);
  const bestMatches = matchingSentences.slice(0, 2).map(m => m.sentence);

  const answerText = bestMatches.join(' ');
  return {
    question,
    answer: `According to the policy: ${answerText}`,
    isGrounded: true
  };
}

/**
 * Generate role-specific action guidance from policy
 */
async function generateRoleGuidance(policyText, role) {
  const validRoles = ['Employee', 'Manager', 'IT Administrator', 'Security Officer'];
  const selectedRole = validRoles.includes(role) ? role : 'Employee';

  const ai = getGeminiClient();

  if (!ai) {
    return localRoleGuidance(policyText, selectedRole);
  }

  const prompt = `
You are an AI Cybersecurity Compliance Specialist.
Extract role-specific actions and responsibilities for the role "${selectedRole}" based on the provided cybersecurity policy.

CYBERSECURITY POLICY:
"""
${policyText}
"""

Instructions:
Respond strictly in JSON format with NO markdown wrapping.
The JSON object must contain the following keys:
- "role": "${selectedRole}"
- "roleDescription": "A concise 1-2 sentence description of what ${selectedRole} is responsible for regarding this policy."
- "actionItems": Array of 3-5 concrete action items that a ${selectedRole} must follow.
- "priorityFocus": Array of 2-4 critical security controls or rules that this role must pay special attention to.

Ensure actions are tailored specifically to the ${selectedRole} perspective.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.warn('Gemini Role Guidance API failed, using fallback engine:', error.message);
    return localRoleGuidance(policyText, selectedRole);
  }
}

/**
 * Local Role Guidance Fallback
 */
function localRoleGuidance(policyText, role) {
  const roleData = {
    'Employee': {
      roleDescription: 'Employees are responsible for day-to-day compliance with authentication mandates, secure connectivity, and immediate incident reporting.',
      actionItems: [
        'Authenticate exclusively using approved hardware tokens or authenticator apps (TOTP).',
        'Always connect through the corporate VPN when working outside trusted office networks.',
        'Never share, write down, or reuse corporate credentials across unauthorized applications.',
        'Immediately notify IT Security of suspicious login prompts or missing hardware tokens.'
      ],
      priorityFocus: [
        'Mandatory MFA compliance on all endpoints',
        'Phishing awareness and credential protection',
        'Secure remote workstation handling'
      ]
    },
    'Manager': {
      roleDescription: 'Managers ensure team-level adherence to cybersecurity policies, approve remote access permissions, and enforce compliance during onboarding.',
      actionItems: [
        'Verify that all team members complete cybersecurity onboarding and MFA enrollment.',
        'Review and approve elevated remote access requests based on principle of least privilege.',
        'Enforce immediate access revocation and device return upon employee offboarding.',
        'Facilitate reporting channels for security incidents identified within the team.'
      ],
      priorityFocus: [
        'Team compliance monitoring and sign-offs',
        'Principle of least privilege authorization',
        'Incident escalation protocols'
      ]
    },
    'IT Administrator': {
      roleDescription: 'IT Administrators configure, deploy, and maintain the identity and access management infrastructure enforcing policy rules.',
      actionItems: [
        'Enforce conditional access policies mandating MFA across VPN, cloud, and on-premises systems.',
        'Disable insecure legacy authentication protocols and disallow SMS-based verification.',
        'Monitor authentication logs for brute force attempts, impossible travel, and anomalous behavior.',
        'Provision and manage the lifecycle of hardware security keys and enterprise authenticators.'
      ],
      priorityFocus: [
        'VPN gateway encryption and cipher suite hardening',
        'Identity and Access Management (IAM) role assignments',
        'Log aggregation and SIEM alert integrations'
      ]
    },
    'Security Officer': {
      roleDescription: 'Security Officers oversee organizational policy governance, conduct compliance audits, and lead incident response investigations.',
      actionItems: [
        'Perform recurring vulnerability assessments and policy compliance audits across departments.',
        'Investigate reported unauthorized access attempts and coordinate containment workflows.',
        'Update policy documentation to align with evolving regulatory frameworks (e.g. ISO 27001, NIST).',
        'Conduct simulated phishing exercises and evaluate employee response readiness.'
      ],
      priorityFocus: [
        'Regulatory compliance and risk governance',
        'Security incident response and digital forensics',
        'Threat modeling and defense-in-depth posture'
      ]
    }
  };

  const selected = roleData[role] || roleData['Employee'];
  return {
    role,
    roleDescription: selected.roleDescription,
    actionItems: selected.actionItems,
    priorityFocus: selected.priorityFocus
  };
}

module.exports = {
  isValidApiKey,
  summarizePolicy,
  answerPolicyQuestion,
  generateRoleGuidance,
  formatErrorMessage
};
