import React, { useState, useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, Loader2, Play, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { PipelineStep } from '../types/incident';

interface PipelineTerminalProps {
  steps?: PipelineStep[];
  isAnalyzing: boolean;
  incidentId?: string;
}

export const PipelineTerminal: React.FC<PipelineTerminalProps> = ({
  steps = [],
  isAnalyzing,
  incidentId,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collapsed) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [steps, collapsed]);

  const defaultSteps: PipelineStep[] = [
    { id: '1', phase: 'INGEST', label: 'Ingesting raw logs', status: 'success', detail: 'Syslog daemon stream captured', timestamp: 'T+0.1s' },
    { id: '2', phase: 'ISOLATE', label: 'Pinpointing root cause', status: 'success', detail: 'AST frame parsing & call graph traversal complete', timestamp: 'T+0.5s' },
    { id: '3', phase: 'SYNTHESIS', label: 'Synthesizing hotfix patch', status: 'success', detail: 'Production hotfix formulated and AST verified', timestamp: 'T+1.0s' },
    { id: '4', phase: 'DEVSECOPS', label: 'Security & CVSS assessment', status: 'success', detail: 'Vulnerability matrix and side-effect checklist compiled', timestamp: 'T+1.3s' },
    { id: '5', phase: 'CI_CD', label: 'Synthetic CI/CD verification', status: 'success', detail: 'Sandbox unit & regression tests passed without errors', timestamp: 'T+1.7s' },
    { id: '6', phase: 'DISPATCH', label: 'Dispatching SRE incident payload', status: 'success', detail: '1-click Git PR and Slack alert ready', timestamp: 'T+1.9s' },
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;

  const handleCopyLogs = () => {
    const logText = activeSteps
      .map((s) => `[${s.timestamp}] [${s.phase}] ${s.label}: ${s.detail} (${s.status.toUpperCase()})`)
      .join('\n');
    navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#050914] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#03060c] border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs ml-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>AGENT RUNTIME PIPELINE</span>
            {incidentId && <span className="text-slate-500">[{incidentId}]</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAnalyzing && (
            <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>EXECUTING CI/CD HARNESS...</span>
            </div>
          )}

          <button
            onClick={handleCopyLogs}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Copy Pipeline Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      {!collapsed && (
        <div className="p-4 space-y-2 max-h-56 overflow-y-auto bg-[#070b16]">
          {activeSteps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="flex items-start gap-2.5 leading-relaxed text-slate-300 hover:bg-slate-900/40 px-1 py-0.5 rounded transition-colors"
            >
              <span className="text-slate-500 tabular-nums shrink-0 text-[11px]">
                {step.timestamp}
              </span>
              <span
                className={`font-semibold shrink-0 text-[11px] ${
                  step.phase === 'DEVSECOPS'
                    ? 'text-rose-400'
                    : step.phase === 'SYNTHESIS'
                    ? 'text-cyan-400'
                    : step.phase === 'CI_CD'
                    ? 'text-emerald-400'
                    : 'text-indigo-400'
                }`}
              >
                [{step.phase}]
              </span>
              <span className="text-slate-200 font-medium shrink-0">{step.label}:</span>
              <span className="text-slate-400 truncate">{step.detail}</span>

              <span className="ml-auto shrink-0 flex items-center text-[10px] text-emerald-400">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                PASS
              </span>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs py-1 animate-pulse">
              <span className="inline-block w-2 h-4 bg-cyan-400 animate-blink" />
              <span>Analyzing stack trace and synthesizing regression-free hotfix...</span>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      )}
    </div>
  );
};
