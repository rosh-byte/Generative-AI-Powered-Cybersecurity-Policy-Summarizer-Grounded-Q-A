import React, { useState } from 'react';
import { AlertCircle, Key, ServerOff, Terminal, X, CheckCircle, Sparkles } from 'lucide-react';

export default function StatusBanner({ healthStatus }) {
  const [dismissed, setDismissed] = useState(false);

  if (!healthStatus || dismissed) return null;

  const isServerDown = healthStatus.status === 'error';
  const isKeyMissing = healthStatus.status === 'ok' && !healthStatus.apiConfigured;

  if (!isServerDown && !isKeyMissing) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      {isServerDown && (
        <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl p-4 flex items-start justify-between gap-3.5 text-rose-200 text-sm shadow-lg shadow-rose-950/50">
          <div className="flex items-start gap-3.5">
            <ServerOff className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-rose-300">Backend Server Unreachable</h4>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                Unable to connect to Node.js backend server at <code className="bg-rose-900/60 px-1.5 py-0.5 rounded text-rose-100 font-mono">http://localhost:5000</code>.
                Please start the server by running:
              </p>
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-rose-900/50 font-mono text-xs text-emerald-400 mt-1">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>cd server && npm start</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-rose-400 hover:text-rose-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isKeyMissing && (
        <div className="bg-amber-950/50 border border-amber-700/60 rounded-xl p-4 flex items-start justify-between gap-3.5 text-amber-200 text-sm shadow-lg shadow-amber-950/40">
          <div className="flex items-start gap-3.5">
            <Key className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-amber-300">Gemini API Key Notice (Optional)</h4>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> Offline Demo Mode Active
                </span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                The application is running in <strong>Offline Analysis Engine Mode</strong> and is 100% functional. To switch to live Google Gemini AI:
              </p>
              <div className="bg-slate-950/90 p-3 rounded-lg border border-amber-900/40 font-mono text-xs text-amber-100 space-y-1">
                <p className="text-slate-400">1. Get a free API key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Google AI Studio</a></p>
                <p className="text-slate-400">2. In <code className="text-cyan-300">server/.env</code> set: <span className="text-emerald-400 font-bold">GEMINI_API_KEY=AIzaSy...</span></p>
                <p className="text-slate-400">3. Restart server (<code className="text-slate-300">cd server && npm start</code>)</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-400 hover:text-amber-200 p-1 shrink-0"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
