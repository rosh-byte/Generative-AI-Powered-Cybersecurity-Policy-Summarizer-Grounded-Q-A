import React from 'react';
import { FileText, ShieldAlert, CheckSquare, AlertTriangle, UserCheck, Shield } from 'lucide-react';

export default function PolicySummary({ summaryData, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center animate-pulse">
          <Shield className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">Generating AI Policy Analysis...</h3>
          <p className="text-xs text-slate-400 mt-1">
            Google Gemini is parsing safety rules, compliance requirements, and risk factors.
          </p>
        </div>
      </div>
    );
  }

  if (!summaryData) return null;

  const {
    summary = '',
    keyRequirements = [],
    importantRules = [],
    employeeActions = [],
    potentialRisks = []
  } = summaryData;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-slate-950/80 px-5 py-3.5 rounded-2xl border border-cyan-900/50">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            AI Policy Executive Summary & Insights
          </h2>
        </div>
        <span className="text-xs text-cyan-300 font-mono bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800/60">
          Generated via Google Gemini API
        </span>
      </div>

      {/* Card 1: Simple Summary (Full Width Hero Card) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-cyan-800/40 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Simple Overview Summary</span>
        </div>

        <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
          {summary || 'No summary available.'}
        </p>
      </div>

      {/* Grid of 4 Structured Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 2: Key Security Requirements */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-cyan-800/60 transition-colors shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <Shield className="w-4 h-4" />
            <span>Key Security Requirements</span>
          </div>
          <ul className="space-y-2">
            {keyRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 3: Important Rules */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-cyan-800/60 transition-colors shadow-lg">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <CheckSquare className="w-4 h-4" />
            <span>Important Rules & Restrictions</span>
          </div>
          <ul className="space-y-2">
            {importantRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 4: Employee Actions Required */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-cyan-800/60 transition-colors shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <UserCheck className="w-4 h-4" />
            <span>Employee Actions Required</span>
          </div>
          <ul className="space-y-2">
            {employeeActions.map((act, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 5: Potential Risks if Ignored */}
        <div className="bg-slate-900/90 rounded-2xl border border-rose-900/40 p-5 space-y-3 hover:border-rose-800/70 transition-colors shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <ShieldAlert className="w-4 h-4" />
            <span>Potential Risks if Policy Ignored</span>
          </div>
          <ul className="space-y-2">
            {potentialRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
