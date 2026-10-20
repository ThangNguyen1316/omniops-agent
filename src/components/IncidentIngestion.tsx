import React, { useState } from 'react';
import {
  Zap,
  Bomb,
  Code2,
  Radio,
  ArrowRight,
  ShieldAlert,
  Server,
  AlertTriangle,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Send,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { ENTERPRISE_SCENARIOS, CHAOS_SIMULATIONS } from '../data/scenarios';
import { IncidentScenario, IncidentStatus, Environment } from '../types/incident';

interface IncidentIngestionProps {
  onAnalyze: (payload: { logs: string; codeContext?: string; service?: string; environment?: string }) => void;
  isAnalyzing: boolean;
  selectedScenarioId?: string;
}

export const IncidentIngestion: React.FC<IncidentIngestionProps> = ({
  onAnalyze,
  isAnalyzing,
  selectedScenarioId,
}) => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'chaos' | 'sandbox' | 'webhooks'>('scenarios');
  const [scenarioFilter, setScenarioFilter] = useState<string>('All');
  const [customLogs, setCustomLogs] = useState<string>('');
  const [customService, setCustomService] = useState<string>('order-gateway');
  const [customEnv, setCustomEnv] = useState<Environment>('production');
  const [chaosFiringId, setChaosFiringId] = useState<string | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const categories = ['All', 'Cloud Microservices', 'Security & DevSecOps', 'REST API 500'];

  const filteredScenarios = scenarioFilter === 'All'
    ? ENTERPRISE_SCENARIOS
    : ENTERPRISE_SCENARIOS.filter((s) => s.category === scenarioFilter);

  const handleSelectScenario = (scenario: IncidentScenario) => {
    onAnalyze({
      logs: scenario.sampleLogs,
      service: scenario.service,
      environment: scenario.environment,
    });
  };

  const handleTriggerChaos = (chaos: typeof CHAOS_SIMULATIONS[0]) => {
    setChaosFiringId(chaos.id);
    const targetScenario = ENTERPRISE_SCENARIOS.find((s) => s.id === chaos.scenarioId);
    if (targetScenario) {
      setTimeout(() => {
        setChaosFiringId(null);
        onAnalyze({
          logs: targetScenario.sampleLogs,
          service: targetScenario.service,
          environment: targetScenario.environment,
        });
      }, 700);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLogs.trim()) return;
    onAnalyze({
      logs: customLogs,
      service: customService,
      environment: customEnv,
    });
  };

  const handleSimulateWebhook = (source: string) => {
    setWebhookStatus(`Received inbound event from ${source} (EventID: evt_${Math.random().toString(36).substring(2, 8)})`);
    const randomScenario = ENTERPRISE_SCENARIOS[Math.floor(Math.random() * ENTERPRISE_SCENARIOS.length)];
    setTimeout(() => {
      onAnalyze({
        logs: randomScenario.sampleLogs,
        service: randomScenario.service,
        environment: randomScenario.environment,
      });
      setWebhookStatus(null);
    }, 1200);
  };

  return (
    <div className="bg-[#0b101e] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-[#080d1a] px-3 pt-2 gap-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'scenarios'
              ? 'bg-[#0b101e] text-cyan-400 border-t-2 border-cyan-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Enterprise Scenarios
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
            {ENTERPRISE_SCENARIOS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('chaos')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'chaos'
              ? 'bg-[#0b101e] text-rose-400 border-t-2 border-rose-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bomb className="w-4 h-4" />
          Chaos Simulator
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-300 font-mono">
            LIVE INJECTION
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'sandbox'
              ? 'bg-[#0b101e] text-emerald-400 border-t-2 border-emerald-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Raw Log Sandbox
        </button>

        <button
          onClick={() => setActiveTab('webhooks')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'webhooks'
              ? 'bg-[#0b101e] text-indigo-400 border-t-2 border-indigo-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          Cloud Webhook Ingestion
        </button>
      </div>

      {/* Tab 1: Enterprise Scenarios */}
      {activeTab === 'scenarios' && (
        <div className="p-4 sm:p-5">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setScenarioFilter(cat)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                    scenarioFilter === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Select any incident to run autonomous root cause & hotfix generation
            </span>
          </div>

          {/* Scenario Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredScenarios.map((scenario) => {
              const isSelected = selectedScenarioId === scenario.id;
              return (
                <div
                  key={scenario.id}
                  onClick={() => !isAnalyzing && handleSelectScenario(scenario)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  } ${isAnalyzing ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {/* Status header with clean unboxed typography */}
                  <div className="flex items-center justify-between text-xs mb-2.5 font-mono">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${
                          scenario.status === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      >
                        {scenario.status}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{scenario.service}</span>
                    </div>
                    <span className="text-slate-500">{scenario.environment}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1">
                    {scenario.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {scenario.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">
                    <span className="truncate max-w-[190px] text-slate-400">
                      {scenario.expectedFile}:{scenario.expectedLine}
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform">
                      Investigate <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Chaos Simulator */}
      {activeTab === 'chaos' && (
        <div className="p-4 sm:p-5">
          <div className="mb-4 bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 text-xs text-rose-300 flex items-start gap-2.5">
            <Bomb className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Interactive Chaos Engineering Suite</p>
              <p className="text-rose-300/80">
                Trigger targeted faults in microservice pods, database pools, and auth layers to verify OmniOps Agent autonomous detection, hotfix synthesis, and automated PR generation in under 2 seconds.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CHAOS_SIMULATIONS.map((chaos) => {
              const isFiring = chaosFiringId === chaos.id;
              return (
                <div
                  key={chaos.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-rose-800/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-rose-400 font-bold">{chaos.severity}</span>
                      <span className="text-slate-500">FAULT INJECTION</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">{chaos.label}</h4>
                    <p className="text-xs text-slate-400 mb-4">{chaos.description}</p>
                  </div>

                  <button
                    disabled={isAnalyzing || isFiring}
                    onClick={() => handleTriggerChaos(chaos)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono font-semibold rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-200 transition-all disabled:opacity-50"
                  >
                    {isFiring ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                        INJECTING OUTAGE...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-rose-400" />
                        Trigger Chaos Event
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Raw Log Sandbox */}
      {activeTab === 'sandbox' && (
        <form onSubmit={handleCustomSubmit} className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Service</label>
              <input
                type="text"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder="e.g. auth-gateway, billing-api"
                className="w-full px-3 py-1.5 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Environment</label>
              <select
                value={customEnv}
                onChange={(e) => setCustomEnv(e.target.value as Environment)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="canary">Canary</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setCustomService('payment-processor');
                  setCustomLogs(`2026-10-19T21:30:15.112Z [FATAL] [payment-processor] [worker-0]
ZeroDivisionError: division by zero
  File "/app/src/billing/calculator.py", line 89, in calculate_fee_percentage
    discount_ratio = total_rebate / volume_tier_count
  File "/app/src/billing/settlement.py", line 142, in process_settlement
    fee = calculate_fee_percentage(rebate, count)
ZeroDivisionError: float division by zero in settlement reconciliation batch #4182`);
                }}
                className="w-full py-1.5 px-3 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
              >
                Insert Sample Crash Trace
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono text-slate-400">
                Raw Server Logs / Stack Trace / Syslog
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                Accepts multi-language stack traces (Python, Node/TS, Go, Java, Rust)
              </span>
            </div>
            <textarea
              rows={6}
              value={customLogs}
              onChange={(e) => setCustomLogs(e.target.value)}
              placeholder="Paste raw server logs, Kubernetes pod events, or uncaught exception stack traces here..."
              className="w-full p-3 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isAnalyzing || !customLogs.trim()}
              className="flex items-center gap-2 py-2 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-semibold text-xs transition-colors disabled:opacity-50 shadow-md shadow-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isAnalyzing ? 'Analyzing Root Cause...' : 'Run Autonomous Investigation'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Live Webhooks & Cloud Streams */}
      {activeTab === 'webhooks' && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="text-xs text-slate-400">
            OmniOps Agent natively ingests streaming webhooks and real-time alerts from Google Cloud Logging, Firebase Crashlytics, Datadog APM, and GitHub CI/CD webhooks.
          </div>

          {webhookStatus && (
            <div className="bg-cyan-950/30 border border-cyan-800/40 p-3 rounded-lg flex items-center gap-2 text-xs text-cyan-300 font-mono animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              {webhookStatus}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-emerald-400">LISTENING</span>
                  <span className="text-slate-500">GCP CLOUD LOGGING</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Google Cloud Logging Sink</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Pub/Sub push subscription connected to production microservices sink.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-950 p-2 rounded border border-slate-800/60 mb-3 break-all">
                  POST /api/webhook/gcp-logging
                </div>
              </div>
              <button
                disabled={isAnalyzing}
                onClick={() => handleSimulateWebhook('Google Cloud Logging')}
                className="w-full py-1.5 px-3 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
              >
                Emit Sample GCP Alert
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-emerald-400">LISTENING</span>
                  <span className="text-slate-500">CRASHLYTICS</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Firebase Crashlytics Feed</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Automatic webhook trigger on velocity spike or fatal mobile/SSR crash.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-950 p-2 rounded border border-slate-800/60 mb-3 break-all">
                  POST /api/webhook/crashlytics
                </div>
              </div>
              <button
                disabled={isAnalyzing}
                onClick={() => handleSimulateWebhook('Firebase Crashlytics')}
                className="w-full py-1.5 px-3 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
              >
                Emit Crashlytics Spike
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-emerald-400">LISTENING</span>
                  <span className="text-slate-500">GITHUB ACTIONS</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">GitHub CI/CD Failure Hook</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Workflow dispatch trigger on deployment failure or synthetic test regression.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-950 p-2 rounded border border-slate-800/60 mb-3 break-all">
                  POST /api/webhook/github-actions
                </div>
              </div>
              <button
                disabled={isAnalyzing}
                onClick={() => handleSimulateWebhook('GitHub Actions CI')}
                className="w-full py-1.5 px-3 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
              >
                Emit CI Build Failure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
