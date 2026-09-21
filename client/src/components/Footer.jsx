import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 mt-12 text-slate-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Top Disclaimer Banner */}
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-3 flex items-start gap-2.5 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-200">AI Verification Notice:</strong> AI-generated summaries, Q&A responses, and role recommendations are created using Generative AI (Google Gemini API) to assist policy comprehension. Always verify critical compliance actions against official organizational policy documents.
          </p>
        </div>

        {/* Bottom Credits & Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>AI-Powered Cybersecurity Policy Assistant &bull; College AI Project (LO 6.1 & LO 6.2)</span>
          </div>

          <div className="flex items-center gap-3">
            <span>React + Vite</span>
            <span>&bull;</span>
            <span>Express Backend</span>
            <span>&bull;</span>
            <span className="text-cyan-400 font-medium">Google Gemini API</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
