import React, { useState } from 'react';
import {
  X,
  GitPullRequest,
  GitCommit,
  CheckCircle2,
  ShieldCheck,
  Check,
  ExternalLink,
  GitMerge,
  Terminal,
  Loader2,
} from 'lucide-react';
import { IncidentReport } from '../types/incident';

interface PRModalProps {
  report: IncidentReport;
  isOpen: boolean;
  onClose: () => void;
}

export const PRModal: React.FC<PRModalProps> = ({ report, isOpen, onClose }) => {
  const [isMerging, setIsMerging] = useState(false);
  const [isMerged, setIsMerged] = useState(false);

  if (!isOpen) return null;

  const prNumber = 1042;
  const branchName = `hotfix/${report.id.toLowerCase()}-hotfix`;

  const handleMerge = () => {
    setIsMerging(true);
    setTimeout(() => {
      setIsMerging(false);
      setIsMerged(true);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#080d1a] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Pull Request #{prNumber}</span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                    isMerged
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {isMerged ? 'MERGED' : 'OPEN & PASSING'}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white font-mono mt-0.5">
                {report.proposedCodePatch.hotfixCommitMessage}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PR Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {/* Branch metadata */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500">Base branch:</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-200">main</span>
            <span className="text-slate-500">←</span>
            <span className="text-slate-500">Compare:</span>
            <span className="bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold">
              {branchName}
            </span>
            <span className="text-slate-600 ml-auto">Author: omniops-agent[bot]</span>
          </div>

          {/* Description */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3 font-sans text-slate-300">
            <div className="font-bold text-white text-xs uppercase tracking-wider font-mono">
              Hotfix Summary & Root Cause Mitigation
            </div>
            <p className="text-slate-300 leading-relaxed">
              {report.rootCauseAnalysis.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block">Affected Target:</span>
                <span className="text-slate-200">{report.rootCauseAnalysis.affectedFile}:{report.rootCauseAnalysis.lineNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Risk Evaluation:</span>
                <span className="text-amber-400">{report.riskAndSecurity.riskLevel} · {report.riskAndSecurity.cvssScore || 'Verified'}</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 font-mono text-[11px]">
              <span className="text-emerald-400 font-semibold block mb-1">Human-in-the-Loop Slack Summary:</span>
              <span className="text-slate-400">{report.humanInTheLoopSummary.slackTelegramMessage}</span>
            </div>
          </div>

          {/* Automated CI/CD & Security Checks */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">
              Automated Verification Harness (All Passed)
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">ci/sandbox-regression-tests</span>
                </div>
                <span className="text-slate-400 text-[11px]">4 / 4 passed (0 errors)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">security/sast-cvss-audit</span>
                </div>
                <span className="text-slate-400 text-[11px]">No regressions detected</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800/60">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-200">diff/lint-and-ast-validation</span>
                </div>
                <span className="text-slate-400 text-[11px]">Syntax clean (0 warnings)</span>
              </div>
            </div>
          </div>

          {isMerged && (
            <div className="p-4 bg-purple-950/30 border border-purple-800/60 rounded-xl text-purple-200 font-mono text-xs flex items-center gap-3">
              <GitMerge className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <p className="font-bold">Hotfix merged into main and triggered rolling canary deployment!</p>
                <p className="text-purple-300/80 text-[11px] mt-0.5">
                  Kubernetes cluster rollout triggered for {report.service}. MTTD: {report.mttdSeconds}s.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#080d1a] border-t border-slate-800">
          <div className="text-xs font-mono text-slate-500">
            Enterprise GitHub Enterprise Cloud Integration
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>

            {!isMerged ? (
              <button
                disabled={isMerging}
                onClick={handleMerge}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-emerald-950/50 border border-emerald-400/40 transition-all"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Merging Hotfix & Deploying...
                  </>
                ) : (
                  <>
                    <GitMerge className="w-3.5 h-3.5" />
                    Confirm & Merge Pull Request
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold rounded-lg transition-colors"
              >
                Close Dialog
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
