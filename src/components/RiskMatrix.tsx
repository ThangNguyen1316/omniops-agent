import React from 'react';
import {
  ShieldAlert,
  Gauge,
  RotateCcw,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  Server,
} from 'lucide-react';
import { RiskAndSecurity } from '../types/incident';

interface RiskMatrixProps {
  risk: RiskAndSecurity;
  suggestedInfraActions?: string[];
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ risk, suggestedInfraActions }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
      case 'MEDIUM':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
      case 'LOW':
      default:
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    }
  };

  return (
    <div className="bg-[#0b101e] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Title & CVSS Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono">
            RISK & SECURITY ASSESSMENT
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={`px-2.5 py-0.5 rounded border font-semibold ${getRiskColor(risk.riskLevel)}`}>
            RISK: {risk.riskLevel}
          </span>
          {risk.cvssScore && (
            <span className="px-2.5 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300 font-semibold tabular-nums">
              CVSS: {risk.cvssScore}
            </span>
          )}
        </div>
      </div>

      {/* Grid of assessments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Security Considerations */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 mb-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            Security & Vulnerability Impact
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {risk.securityConsiderations}
          </p>
        </div>

        {/* Performance Impact */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-1.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            Performance & Latency Delta
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono text-[11px]">
            {risk.performanceImpact}
          </p>
        </div>
      </div>

      {/* Potential Side Effects */}
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-lg p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          Potential Side Effects & Regression Guardrails
        </div>
        <ul className="space-y-1.5">
          {risk.potentialSideEffects.map((effect, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{effect}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rollback Strategy */}
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-lg p-3 flex items-start gap-3">
        <RotateCcw className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-slate-200">Safe Rollback & Canary Strategy: </span>
          <span className="text-slate-400">{risk.rollbackStrategy}</span>
        </div>
      </div>

      {/* Recommended Infrastructure / Deployment Actions */}
      {suggestedInfraActions && suggestedInfraActions.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-2">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            Infrastructure & Cluster Remediation Steps
          </div>
          <div className="space-y-1.5">
            {suggestedInfraActions.map((action, idx) => (
              <div
                key={idx}
                className="font-mono text-[11px] text-slate-300 bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800/60 flex items-center gap-2"
              >
                <span className="text-cyan-500 font-bold select-none">{idx + 1}.</span>
                <span className="truncate">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
