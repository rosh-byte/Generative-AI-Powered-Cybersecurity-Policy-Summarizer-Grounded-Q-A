import React from 'react';
import { ShieldCheck, Cpu, Key, AlertTriangle, Sparkles } from 'lucide-react';

export default function Navbar({ healthStatus, onSelectSample }) {
  const isOk = healthStatus && healthStatus.status === 'ok';
  const isKeyConfigured = healthStatus && healthStatus.apiConfigured;

  return (
    <header className="border-b border-cyan-950/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Project Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-wide">
                CyberPolicy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">AI Assistant</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                LO 6.1 Project
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generative AI-Powered Cybersecurity Policy Summarizer & Grounded Q&A
            </p>
          </div>
        </div>

        {/* Action Controls & API Status Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectSample('remote-access')}
            className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 px-3 py-1.5 rounded-lg border border-cyan-800/40 transition-all shadow-sm"
            title="Load realistic sample policy for fast demo"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Quick Demo Preset</span>
          </button>

          {/* Status Indicators */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isOk ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-slate-300 font-medium">
                {isOk ? 'Backend Ready' : 'Connecting...'}
              </span>
            </div>

            <div className="h-3 w-px bg-slate-800 my-auto mx-1" />

            <div className="flex items-center gap-1.5">
              {isKeyConfigured ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                  <Key className="w-3 h-3" /> Gemini Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 font-medium text-[11px]" title="GEMINI_API_KEY missing in server/.env">
                  <AlertTriangle className="w-3 h-3" /> Key Needed
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
