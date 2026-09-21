import React, { useState } from 'react';
import { UserCheck, Shield, Briefcase, Terminal, CheckCircle2, AlertOctagon, RefreshCw, Sparkles } from 'lucide-react';
import { getRoleGuidance } from '../services/api';

const ROLES = [
  { id: 'Employee', label: 'Employee', icon: UserCheck, desc: 'General Staff & Standard System Users' },
  { id: 'Manager', label: 'Manager', icon: Briefcase, desc: 'Departmental Leads & People Managers' },
  { id: 'IT Administrator', label: 'IT Administrator', icon: Terminal, desc: 'System Admins & Infrastructure Ops' },
  { id: 'Security Officer', label: 'Security Officer', icon: Shield, desc: 'SOC Analysts & Compliance Auditors' },
];

export default function RoleGuidance({ policyText }) {
  const [selectedRole, setSelectedRole] = useState('Employee');
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRoleSelect = async (roleId) => {
    setSelectedRole(roleId);
    if (!policyText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getRoleGuidance(policyText, roleId);
      setRoleData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch role-based guidance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-5">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            5. Role-Based Compliance Guidance
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Tailored security responsibilities per organizational persona
        </span>
      </div>

      {/* Role Selection Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-500 shadow-md shadow-cyan-500/10 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">{role.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">{role.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Generate / Refresh Button */}
      {!roleData && policyText && (
        <div className="text-center py-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
          <p className="text-xs text-slate-400">
            Generate specific compliance actions for the selected role based on the uploaded policy.
          </p>
          <button
            onClick={() => handleRoleSelect(selectedRole)}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Guidance for {selectedRole}</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Generating persona recommendations for {selectedRole}...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs">
          {error}
        </div>
      )}

      {/* Display Guidance Data */}
      {roleData && !loading && (
        <div className="space-y-4 pt-2">
          {/* Role Description Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
              {roleData.role} Responsibility Scope:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {roleData.roleDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action Items List */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Action Checklist
              </h4>
              <ul className="space-y-2">
                {roleData.actionItems?.map((act, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Priority Focus */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-cyan-400" />
                Priority Compliance Focus
              </h4>
              <ul className="space-y-2">
                {roleData.priorityFocus?.map((foc, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{foc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
