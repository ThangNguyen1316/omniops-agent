import React from 'react';
import { ShieldAlert, Activity, Server, Radio, RefreshCw, Terminal, ExternalLink } from 'lucide-react';
import { Environment } from '../types/incident';

interface HeaderProps {
  currentEnv: Environment;
  onEnvChange: (env: Environment) => void;
  isAnalyzing: boolean;
  onReset: () => void;
  onOpenSpecs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentEnv,
  onEnvChange,
  isAnalyzing,
  onReset,
  onOpenSpecs,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#080d1a] px-4 lg:px-6 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#080d1a] rounded-[7px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white font-mono">
                OMNIOPS<span className="text-cyan-400">.AGENT</span>
              </h1>
              <span className="text-[11px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                v2.6.4-AUTONOMOUS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous DevSecOps & Incident Response AI System
            </p>
          </div>
        </div>

        {/* Telemetry & Cluster Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <div className="hidden lg:flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">MTTD</span>
              <span className="text-emerald-400 font-semibold tabular-nums">14.2s</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">MTTR</span>
              <span className="text-cyan-400 font-semibold tabular-nums">1.8m</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">AUTO-HOTFIX RATE</span>
              <span className="text-emerald-400 font-semibold tabular-nums">98.2%</span>
            </div>
          </div>

          {/* Environment Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => onEnvChange('production')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                currentEnv === 'production'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Prod (us-east1)
            </button>
            <button
              onClick={() => onEnvChange('staging')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                currentEnv === 'staging'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Staging
            </button>
            <button
              onClick={() => onEnvChange('canary')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                currentEnv === 'canary'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Canary
            </button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline font-mono">
                {isAnalyzing ? 'AGENT ANALYZING...' : 'SENTINEL ACTIVE'}
              </span>
            </div>

            <button
              onClick={onOpenSpecs}
              title="View Strict Output Specification"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
