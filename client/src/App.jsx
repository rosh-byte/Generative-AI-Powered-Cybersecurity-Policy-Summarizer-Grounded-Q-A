import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatusBanner from './components/StatusBanner';
import PolicyInput from './components/PolicyInput';
import PolicySummary from './components/PolicySummary';
import PolicyChatbot from './components/PolicyChatbot';
import RoleGuidance from './components/RoleGuidance';
import Footer from './components/Footer';
import { SAMPLE_POLICIES } from './data/samplePolicies';
import { checkHealth, summarizePolicy } from './services/api';
import { Shield, Sparkles, MessageSquare, UserCheck, ArrowRight, Info } from 'lucide-react';

export default function App() {
  const [policyText, setPolicyText] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [inputError, setInputError] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [activeSample, setActiveSample] = useState(SAMPLE_POLICIES[0]);

  // Check Backend Health on mount
  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = async () => {
    const res = await checkHealth();
    setHealthStatus(res);
  };

  // Select pre-loaded sample policy
  const handleSelectSample = (sampleId) => {
    const found = SAMPLE_POLICIES.find(p => p.id === sampleId) || SAMPLE_POLICIES[0];
    setActiveSample(found);
    setPolicyText(found.content);
    setSummaryData(null);
    setInputError(null);
  };

  // Summarize Handler
  const handleSummarize = async () => {
    if (!policyText.trim()) {
      setInputError('Policy text cannot be empty. Please paste a policy or choose a preset.');
      return;
    }

    setIsSummarizing(true);
    setInputError(null);

    try {
      const response = await summarizePolicy(policyText);
      setSummaryData(response.data);

      // Scroll smoothly to summary section
      setTimeout(() => {
        const summaryElem = document.getElementById('summary-section');
        if (summaryElem) {
          summaryElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      setInputError(err.message || 'Failed to generate AI policy summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Navbar with Health Status */}
      <Navbar healthStatus={healthStatus} onSelectSample={handleSelectSample} />

      {/* System Warning Banner if key missing or server down */}
      <StatusBanner healthStatus={healthStatus} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* College Project & Quick Demo Guide Header */}
        <section className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>LO 6.1 & LO 6.2 Generative AI Implementation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                AI-Powered Cybersecurity Policy Assistant
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Transform complex, lengthy organizational security policies into actionable summaries, grounded answers, and persona-specific compliance checklists using Google Gemini Generative AI.
              </p>
            </div>

            {/* 3-Step Demo Walkthrough Chips */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs shrink-0">
              <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 3-Minute Demo Walkthrough:
              </h4>
              <ol className="space-y-1.5 text-slate-300 text-[11px] font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Click <strong className="text-cyan-300">"Load Quick Demo Preset"</strong> above</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Click <strong className="text-cyan-300">"Summarize Policy (AI)"</strong> below</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Ask questions in <strong className="text-cyan-300">Chatbot</strong> or check <strong className="text-cyan-300">Roles</strong></span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 1: Policy Input */}
        <section>
          <PolicyInput
            policyText={policyText}
            setPolicyText={setPolicyText}
            onSummarize={handleSummarize}
            isLoading={isSummarizing}
            error={inputError}
            setError={setInputError}
          />
        </section>

        {/* Section 2: AI Policy Summarizer */}
        <section id="summary-section" className="scroll-mt-20">
          <PolicySummary summaryData={summaryData} isLoading={isSummarizing} />
        </section>

        {/* Section 3: Interactive Q&A Chatbot & Role Guidance */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Policy Q&A Chatbot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Policy Q&A Chatbot</span>
              </h3>
              <span className="text-[11px] text-slate-400">Grounding Strictness: Active</span>
            </div>
            <PolicyChatbot
              policyText={policyText}
              sampleQuestions={activeSample?.sampleQuestions || []}
            />
          </div>

          {/* Column 2: Role-Based Guidance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Role-Based Guidance</span>
              </h3>
              <span className="text-[11px] text-slate-400">Persona-Specific Checklist</span>
            </div>
            <RoleGuidance policyText={policyText} />
          </div>

        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
