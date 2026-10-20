import React, { useState } from 'react';
import {
  AlertCircle,
  FileCode,
  MapPin,
  Clock,
  CheckCircle,
  ShieldAlert,
  Server,
  Zap,
  RotateCcw,
  Terminal,
} from 'lucide-react';
import { IncidentReport } from '../types/incident';
import { CodeDiffViewer } from './CodeDiffViewer';
import { RiskMatrix } from './RiskMatrix';
import { HumanInTheLoopPanel } from './HumanInTheLoopPanel';
import { PipelineTerminal } from './PipelineTerminal';
import { PRModal } from './PRModal';

interface SREIncidentRoomProps {
  report: IncidentReport;
  isAnalyzing: boolean;
}

export const SREIncidentRoom: React.FC<SREIncidentRoomProps> = ({ report, isAnalyzing }) => {
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/80';
      case 'WARNING':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/80';
      case 'INFO':
      default:
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/80';
    }
  };

  return (
    <div className="space-y-5">
      {/* Primary Incident Banner */}
      <div className="bg-[#0b101e] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className={`px-2.5 py-0.5 rounded font-bold border ${getStatusBadge(report.status)}`}>
                STATUS: [{report.status}]
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300 font-semibold">{report.id}</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-400">{report.service}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{report.environment}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {report.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
            <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Detected:</span>
              <span className="text-slate-200 tabular-nums">
                {new Date(report.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-500">MTTD:</span>
              <span className="text-emerald-400 font-semibold tabular-nums">{report.mttdSeconds}s</span>
            </div>
          </div>
        </div>

        {/* Root Cause Analysis & Affected File Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="md:col-span-2 space-y-1.5">
            <span className="font-mono text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">
              Root Cause Analysis
            </span>
            <p className="text-slate-200 leading-relaxed font-sans text-sm">
              {report.rootCauseAnalysis.summary}
            </p>
            <div className="text-slate-400 font-mono text-[11px] pt-1">
              <span className="text-slate-500">Trigger Mechanism: </span>
              <span className="text-rose-300/90">{report.rootCauseAnalysis.triggerMechanism}</span>
            </div>
          </div>

          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 font-mono">
            <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">
              Affected File & Location
            </span>
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs truncate">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{report.rootCauseAnalysis.affectedFile}</span>
            </div>
            <div className="text-[11px] text-amber-400">
              Line Number: <span className="font-bold underline">{report.rootCauseAnalysis.lineNumber}</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Component: {report.rootCauseAnalysis.affectedComponent}
            </div>
          </div>
        </div>
      </div>

      {/* Code Diff Viewer */}
      <CodeDiffViewer
        patch={report.proposedCodePatch}
        filePath={report.rootCauseAnalysis.affectedFile}
        lineNumber={report.rootCauseAnalysis.lineNumber}
      />

      {/* Risk & Security Matrix */}
      <RiskMatrix
        risk={report.riskAndSecurity}
        suggestedInfraActions={report.suggestedInfraActions}
      />

      {/* Real-time CI/CD Pipeline Terminal Stream */}
      <PipelineTerminal
        steps={report.pipelineSteps}
        isAnalyzing={isAnalyzing}
        incidentId={report.id}
      />

      {/* Human In The Loop Slack/Telegram/JSON & PR Orchestration */}
      <HumanInTheLoopPanel
        report={report}
        onOpenPRModal={() => setIsPRModalOpen(true)}
      />

      {/* PR Modal */}
      <PRModal
        report={report}
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
      />
    </div>
  );
};
