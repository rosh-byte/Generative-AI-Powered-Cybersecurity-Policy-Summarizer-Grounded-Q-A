import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, Trash2, FileUp, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { SAMPLE_POLICIES } from '../data/samplePolicies';
import { uploadPolicyFile } from '../services/api';

export default function PolicyInput({
  policyText,
  setPolicyText,
  onSummarize,
  isLoading,
  error,
  setError
}) {
  const [activeInputTab, setActiveInputTab] = useState('paste'); // 'paste' | 'upload'
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef(null);

  const wordCount = policyText.trim() ? policyText.trim().split(/\s+/).length : 0;
  const charCount = policyText.length;
  const estReadTime = Math.ceil(wordCount / 200);

  const handlePresetSelect = (presetId) => {
    const selected = SAMPLE_POLICIES.find(p => p.id === presetId);
    if (selected) {
      setPolicyText(selected.content);
      setUploadedFileName('');
      setError(null);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isTxt = lowerName.endsWith('.txt') || lowerName.endsWith('.md') || file.type.includes('text');
    const isPdf = lowerName.endsWith('.pdf') || file.type.includes('pdf');

    if (!isTxt && !isPdf) {
      setError('Unsupported file type. Please upload a .pdf, .txt, or markdown (.md) document.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadPolicyFile(file);
      setPolicyText(result.policyText);
      setUploadedFileName(result.filename);
      setActiveInputTab('paste'); // switch to text view to review
    } catch (err) {
      setError(err.message || 'Error processing uploaded file.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      
      {/* Header Bar */}
      <div className="bg-slate-950/80 px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            1. Cybersecurity Policy Document Input
          </h2>
        </div>

        {/* Input Method Tabs */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveInputTab('paste')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeInputTab === 'paste'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setActiveInputTab('upload')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeInputTab === 'upload'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload PDF/TXT
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-4">

        {/* Preset Selector Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">Quick Demo Preset Policies:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_POLICIES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handlePresetSelect(sample.id)}
                className="bg-slate-900 hover:bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-900/60 transition-colors text-xs font-medium"
              >
                {sample.title.split(' ')[0]} {sample.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert inside component */}
        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200 font-bold">×</button>
          </div>
        )}

        {/* Tab 1: Text Area */}
        {activeInputTab === 'paste' && (
          <div className="relative">
            <textarea
              value={policyText}
              onChange={(e) => {
                setPolicyText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste your organization's cybersecurity policy here (e.g. Remote access guidelines, Data encryption rules, Password standards, Incident response procedures)..."
              rows={9}
              className="w-full bg-slate-950/90 text-slate-200 placeholder-slate-500 rounded-xl p-4 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none font-mono text-xs leading-relaxed resize-y min-h-[200px]"
            />
            {uploadedFileName && (
              <div className="absolute top-3 right-3 bg-cyan-950/90 border border-cyan-800 text-cyan-300 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Loaded from: {uploadedFileName}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: File Upload Zone */}
        {activeInputTab === 'upload' && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-cyan-900/60 hover:border-cyan-500/80 bg-slate-950/50 hover:bg-slate-950 rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-800">
              {uploading ? (
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                {uploading ? 'Parsing policy document...' : 'Drag & Drop policy file (PDF, TXT, or MD)'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF policies or plain text (.txt / .md) up to 5MB
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-2 inline-flex items-center gap-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              <FileUp className="w-4 h-4" />
              <span>Browse Files</span>
            </button>

            {/* Quick Sample Downloads */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-400"
            >
              <span>Sample Test Files:</span>
              <a
                href="/sample_cybersecurity_policy.pdf"
                download="sample_cybersecurity_policy.pdf"
                className="text-cyan-400 hover:text-cyan-300 underline font-medium bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-800 transition-colors"
              >
                📥 Download sample_cybersecurity_policy.pdf
              </a>
              <a
                href="/sample_incident_response_policy.txt"
                download="sample_incident_response_policy.txt"
                className="text-indigo-400 hover:text-indigo-300 underline font-medium bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-indigo-800 transition-colors"
              >
                📥 Download sample_incident_response_policy.txt
              </a>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              onClick={(e) => { e.target.value = ''; }}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          {/* Document Metrics */}
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span>Words: <strong className="text-cyan-300 font-bold">{wordCount}</strong></span>
            <span>Chars: <strong className="text-cyan-300 font-bold">{charCount}</strong></span>
            <span>Est. Read: <strong className="text-cyan-300 font-bold">{estReadTime} min</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {policyText && (
              <button
                onClick={() => {
                  setPolicyText('');
                  setUploadedFileName('');
                  setError(null);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-slate-400" />
                <span>Clear</span>
              </button>
            )}

            <button
              onClick={onSummarize}
              disabled={isLoading || !policyText.trim()}
              className={`flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg ${
                isLoading || !policyText.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>AI Processing Policy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Summarize Policy (AI)</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
