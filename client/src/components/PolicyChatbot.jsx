import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, ShieldCheck, AlertCircle, RefreshCw, Trash2, HelpCircle } from 'lucide-react';
import { askPolicyQuestion } from '../services/api';

export default function PolicyChatbot({ policyText, sampleQuestions = [] }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Policy Q&A Assistant. Ask me any question about the uploaded cybersecurity policy. I will answer strictly based on the policy content.',
      isGrounded: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const defaultSuggested = [
    "What are the main security requirements?",
    "Is MFA required for remote employees?",
    "What happens if an employee does not follow this policy?"
  ];

  const suggestedQuestions = sampleQuestions.length > 0 ? sampleQuestions : defaultSuggested;

  const handleSend = async (questionText) => {
    const q = (questionText || inputQuestion).trim();
    if (!q) return;

    if (!policyText.trim()) {
      setError('Please enter or upload a policy document before asking questions.');
      return;
    }

    setError(null);
    setInputQuestion('');

    // Add user message
    const userMsg = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await askPolicyQuestion(policyText, q);
      const botAnswer = response.data.answer;
      const isGrounded = response.data.isGrounded;

      const botMsg = {
        sender: 'bot',
        text: botAnswer,
        isGrounded,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(err.message || 'Failed to get answer from AI Chatbot.');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'Chat history cleared. How can I help you analyze the policy?',
        isGrounded: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setError(null);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px]">
      
      {/* Chat Header */}
      <div className="bg-slate-950/90 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Policy Q&A Chatbot
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                Grounded Mode
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Answers strictly constrained to provided policy content
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
          title="Clear chat feed"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions Chips */}
      <div className="bg-slate-950/40 px-4 py-2 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="text-slate-400 shrink-0 font-medium text-[11px]">Quick Questions:</span>
        {suggestedQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq)}
            disabled={loading}
            className="bg-slate-900 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-800 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors text-[11px]"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-950/80 border-b border-rose-800 px-4 py-2 text-rose-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 font-bold">×</button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                msg.sender === 'user'
                  ? 'bg-cyan-950 border-cyan-800 text-cyan-400'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-500/10 font-medium'
                    : msg.text.includes("This information is not available in the provided policy.")
                    ? 'bg-amber-950/40 border border-amber-800/80 text-amber-200 rounded-tl-none font-mono'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none font-sans'
                }`}
              >
                {msg.text}
              </div>

              {/* Grounded Status Tag */}
              {msg.sender === 'bot' && (
                <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
                  <span className="font-mono">{msg.timestamp}</span>
                  {msg.isGrounded ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> Grounded in policy
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-400">
                      <AlertCircle className="w-3 h-3" /> Not found in policy
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 text-slate-400 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Analyzing policy content for answer...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-slate-950 p-3 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a question about the policy (e.g. 'Is MFA required for remote employees?')..."
          disabled={loading}
          className="flex-1 bg-slate-900 text-slate-200 placeholder-slate-500 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !inputQuestion.trim()}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            loading || !inputQuestion.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>

    </div>
  );
}
