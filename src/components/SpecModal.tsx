import React from 'react';
import { X, Terminal, Shield, CheckCircle2 } from 'lucide-react';

interface SpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecModal: React.FC<SpecModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl font-mono text-xs">
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#080d1a] border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>OMNIOPS AGENT SPECIFICATION & MANDATORY FORMAT</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-slate-300">
          <p className="font-sans text-xs text-slate-300">
            OmniOps Agent is an Autonomous DevSecOps & Incident Response AI System. Its core mission is to analyze application/server logs, identify root causes, and propose actionable code fixes (hotfixes) alongside infrastructure deployment recommendations.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold">Mandatory Output Contract:</div>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-white">Status:</strong> [CRITICAL / WARNING / INFO]</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-white">Root Cause Analysis:</strong> Concise breakdown of what broke and why.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-white">Affected File & Location:</strong> e.g., src/services/auth_service.py (Line 42)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-white">Proposed Code Patch:</strong> Modern, clean, and bug-free code diff/replacement.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-white">Human-in-the-loop Summary:</strong> A 2-sentence summary ready to be sent to an engineer via Slack/Telegram.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-indigo-400 font-bold">Integration Architecture:</div>
            <p className="text-[11px] text-slate-400">
              Native server proxy routes at <code className="text-cyan-300">/api/analyze-incident</code> with Gemini 3.8-Flash intelligence, deterministic zero-fail fallback parser, simulated GitHub PR dispatch, and multi-channel Slack/Telegram webhook test harnesses.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-[#080d1a] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
