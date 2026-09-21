export const SAMPLE_POLICIES = [
  {
    id: 'remote-access',
    title: 'Remote Access & Multi-Factor Authentication Policy',
    category: 'Access Control',
    content: `CYBERSECURITY POLICY: REMOTE ACCESS & MULTI-FACTOR AUTHENTICATION (MFA)

1. PURPOSE & SCOPE
This policy defines security mandates for all employees, contractors, and third-party vendors accessing organizational networks, corporate applications, and internal data stores from remote locations.

2. MANDATORY MULTI-FACTOR AUTHENTICATION
2.1 All remote access to organizational resources, Virtual Private Networks (VPN), cloud services, and email systems MUST be protected using Multi-Factor Authentication (MFA).
2.2 Acceptable MFA factors include hardware tokens, authenticator apps (TOTP), and push notifications. SMS-based authentication is strictly prohibited due to SIM-swapping vulnerabilities.
2.3 Re-authentication is required every 12 hours or immediately upon detecting suspicious network activity.

3. DEVICE & NETWORK REQUIREMENTS
3.1 Remote connections may only be established from company-managed endpoints equipped with updated Endpoint Detection & Response (EDR) software.
3.2 Connecting to corporate systems from public Wi-Fi networks (e.g., coffee shops, airports) without an encrypted VPN tunnel is strictly forbidden.
3.3 Personal devices (BYOD) must pass compliance checks including enabled firewall, full-disk encryption (BitLocker/FileVault), and current OS security patches before access is granted.

4. INCIDENT REPORTING & PENALTIES
4.1 Any lost or stolen remote access device must be reported to the IT Security Operation Center (SOC) within 1 hour.
4.2 Shared credentials, password sharing, or bypassing MFA controls constitutes a Critical Security Violation.
4.3 Non-compliance may lead to immediate revocation of system access, disciplinary action, up to and including termination of employment.`,
    sampleQuestions: [
      "Is MFA mandatory for remote employees?",
      "Can employees use SMS for multi-factor authentication?",
      "What is required when connecting from public Wi-Fi?",
      "How quickly must a lost device be reported?",
      "What is the policy for biometric data?" // Not in policy test
    ]
  },
  {
    id: 'data-protection',
    title: 'Data Classification & Incident Response Policy',
    category: 'Data Security',
    content: `CYBERSECURITY POLICY: DATA CLASSIFICATION & INCIDENT RESPONSE

1. DATA CLASSIFICATION STANDARDS
All organizational data must be categorized into one of three sensitivity levels:
- PUBLIC: Marketing materials, public press releases.
- INTERNAL: Internal memos, departmental schedules.
- CONFIDENTIAL: Personally Identifiable Information (PII), financial records, source code, encryption keys.

2. CONFIDENTIAL DATA HANDLING RULES
2.1 Confidential data must be encrypted both in transit (TLS 1.3) and at rest (AES-256).
2.2 Storing Confidential data on unencrypted USB flash drives, personal cloud accounts (e.g., personal Google Drive, Dropbox), or local desktop storage is strictly prohibited.
2.3 External email transmission of Confidential records must use automated DLP (Data Loss Prevention) email encryption tags.

3. INCIDENT DETECTION & REPORTING
3.1 An Incident is defined as any unauthorized access, ransomware activity, email phishing attack, or accidental data exposure.
3.2 All employees must immediately report suspected security incidents to security-reports@org-domain.com or call the Security Hotline within 30 minutes of discovery.
3.3 Staff must NEVER attempt to clean malware or restore infected machines independently without Security Team authorization.

4. AUDITING & COMPLIANCE
4.1 IT Security conducts quarterly compliance audits. Failure to comply with data protection controls will result in mandatory security retraining and formal written reprimand.`,
    sampleQuestions: [
      "What are the three data sensitivity levels?",
      "Are employees allowed to store confidential data on personal Google Drive?",
      "How soon must security incidents be reported?",
      "What encryption standards are required for confidential data?",
      "Does this policy mention server backup schedules?" // Not in policy test
    ]
  },
  {
    id: 'device-acceptable-use',
    title: 'Acceptable Use & Device Security Policy',
    category: 'Operational Security',
    content: `CYBERSECURITY POLICY: ACCEPTABLE USE & DEVICE SECURITY

1. ACCEPTABLE USE GUIDELINES
1.1 Corporate computing equipment (laptops, mobile devices, workstations) are provided solely for authorized business activities.
1.2 Downloading or installing unauthorized third-party software, torrent clients, peer-to-peer file sharing applications, or unvetted browser extensions is strictly forbidden.
1.3 Workstations must be locked (Windows Key + L / Ctrl + Cmd + Q) whenever left unattended, even for short breaks.

2. PASSWORD & AUTHENTICATION CREDENTIALS
2.1 Passwords must be a minimum of 16 characters long and include uppercase letters, numbers, and special symbols.
2.2 Default vendor passwords on hardware or IoT devices must be changed immediately upon installation.
2.3 Passwords must not be written on sticky notes, stored in plain-text documents, or shared with colleagues.

3. PHYSICAL & HARDWARE SECURITY
3.1 Unidentified visitors in secure facility areas must be challenged or reported to building security.
3.2 Tailgating into server rooms or restricted zones is forbidden.
3.3 Hardware locks must be used for workstations in high-traffic office areas.`,
    sampleQuestions: [
      "What software is forbidden from being installed?",
      "What is the minimum length required for passwords?",
      "What should an employee do when leaving their desk unattended?",
      "Can passwords be stored on sticky notes?",
      "What is the policy on social media usage?" // Not in policy test
    ]
  }
];
