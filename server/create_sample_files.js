const fs = require('fs');
const path = require('path');

// Generate realistic cybersecurity policy PDF using valid PDF binary structures
function generatePDF(outputPath, title, sections) {
  let streamContent = `BT\n/F1 14 Tf\n50 740 Td\n(${escapePdf(title)}) Tj\nET\n`;
  let y = 710;

  sections.forEach((sec) => {
    // Heading
    streamContent += `BT\n/F1 11 Tf\n50 ${y} Td\n(${escapePdf(sec.heading)}) Tj\nET\n`;
    y -= 20;

    // Content lines
    sec.lines.forEach((line) => {
      streamContent += `BT\n/F2 9 Tf\n60 ${y} Td\n(${escapePdf(line)}) Tj\nET\n`;
      y -= 15;
    });
    y -= 10;
  });

  const streamBuf = Buffer.from(streamContent, 'utf-8');

  const objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n');
  objects.push(`4 0 obj\n<< /Length ${streamBuf.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`);
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');
  objects.push('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  let body = '%PDF-1.4\n';
  const xrefOffsets = [0];

  objects.forEach((obj) => {
    xrefOffsets.push(Buffer.byteLength(body, 'utf-8'));
    body += obj;
  });

  const startxref = Buffer.byteLength(body, 'utf-8');
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  
  for (let i = 1; i <= objects.length; i++) {
    xref += String(xrefOffsets[i]).padStart(10, '0') + ' 00000 n \n';
  }

  body += `${xref}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  fs.writeFileSync(outputPath, Buffer.from(body, 'utf-8'));
  console.log('Created PDF:', outputPath);
}

function escapePdf(str) {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

const title = 'ENTERPRISE CYBERSECURITY & ACCESS GOVERNANCE POLICY';
const sections = [
  {
    heading: '1. PURPOSE & SCOPE',
    lines: [
      'This policy defines mandatory security requirements for corporate network access, data handling,',
      'and remote device management across all internal departments and third-party contractors.'
    ]
  },
  {
    heading: '2. MANDATORY REQUIREMENTS & AUTHENTICATION',
    lines: [
      '- Multi-Factor Authentication (MFA) is strictly mandatory for all employees and system administrators.',
      '- Acceptable MFA methods include hardware security keys (FIDO2) and authenticator apps (TOTP).',
      '- SMS-based OTP verification is prohibited for administrative roles due to SIM-swapping vulnerabilities.',
      '- Passwords must be at least 16 characters in length and updated every 90 days.'
    ]
  },
  {
    heading: '3. SECURE REMOTE ACCESS & ENCRYPTION',
    lines: [
      '- All remote connections must traverse the corporate encrypted VPN tunnel with TLS 1.3 enabled.',
      '- Unmanaged personal devices (BYOD) are strictly forbidden from directly connecting to production servers.',
      '- Confidential data stored on laptops or portable drives must use AES-256 full-disk encryption.'
    ]
  },
  {
    heading: '4. INCIDENT REPORTING & COMPLIANCE ACTIONS',
    lines: [
      '- Any suspected credential compromise or phishing attempt must be reported to SOC within 15 minutes.',
      '- Employees must complete mandatory bi-annual security awareness and phishing simulations.',
      '- Failure to adhere to this policy will result in immediate revocation of access privileges.'
    ]
  }
];

// 1. Create PDF on project root
const rootPdfPath = path.resolve(__dirname, '..', 'sample_cybersecurity_policy.pdf');
generatePDF(rootPdfPath, title, sections);

// 2. Also create a formatted sample text file
const rootTxtPath = path.resolve(__dirname, '..', 'sample_incident_response_policy.txt');
const sampleTxtContent = `================================================================================
ENTERPRISE CYBERSECURITY INCIDENT RESPONSE & BREACH NOTIFICATION POLICY
Document ID: SEC-POL-2026-V3 | Classification: Restricted / Internal Use
================================================================================

1. PURPOSE & OBJECTIVE
This policy outlines mandatory procedures for detecting, containing, analyzing, 
and reporting cybersecurity incidents, unauthorized system intrusions, ransomware 
attacks, and confidential data breaches.

2. MANDATORY INCIDENT TRIAGE & ESCALATION
2.1 All employees who detect anomalous network activity, ransomware screens, or 
    phishing messages MUST notify the Security Operations Center (SOC) within 15 minutes.
2.2 The Lead Incident Handler must classify incidents within 30 minutes of notification:
    - Severity 1 (Critical): Active data exfiltration or operational disruption.
    - Severity 2 (High): Compromised domain administrator credential.
    - Severity 3 (Medium): Isolated endpoint malware infection.

3. CONTAINMENT & FORENSICS PROTOCOLS
3.1 Network Isolation: Affected workstations and servers must be immediately 
    isolated from the corporate LAN/VLAN without powering off the machines to preserve RAM forensics.
3.2 Evidence Preservation: System memory dumps, firewall logs, and packet captures 
    must be cryptographically hashed (SHA-256) and archived securely.
3.3 Credential Revocation: All Active Directory and Cloud IAM credentials associated 
    with compromised accounts must be revoked and regenerated immediately.

4. USER RESPONSIBILITIES & COMPLIANCE
4.1 Employees are strictly forbidden from attempting independent investigation or 
    communicating incident details to media or external parties without Legal approval.
4.2 IT Administrators must maintain immutable daily off-site backups with air-gapped protection.
4.3 Non-compliance with incident reporting timelines may lead to disciplinary review and regulatory fines.
`;

fs.writeFileSync(rootTxtPath, sampleTxtContent, 'utf-8');
console.log('Created TXT:', rootTxtPath);
