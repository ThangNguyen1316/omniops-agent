import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  GitPullRequest,
  Copy,
  Check,
  FileJson,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { IncidentReport } from '../types/incident';

interface HumanInTheLoopPanelProps {
  report: IncidentReport;
  onOpenPRModal: () => void;
}

export const HumanInTheLoopPanel: React.FC<HumanInTheLoopPanelProps> = ({
  report,
  onOpenPRModal,
}) => {
  const [activeTab, setActiveTab] = useState<'slack' | 'telegram' | 'json'>('slack');
  const [copied, setCopied] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSimulateWebhookDispatch = async (channel: 'slack' | 'telegram') => {
    setIsDispatching(true);
    try {
      const res = await fetch('/api/webhook/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          incidentId: report.id,
          message: report.humanInTheLoopSummary.slackTelegramMessage,
        }),
      });
      const data = await res.json();
      setDispatchStatus(`Successfully delivered alert to #${channel}-sre-oncall (Receipt: ${data.dispatchReceipt})`);
      setTimeout(() => setDispatchStatus(null), 4000);
    } catch (e) {
      setDispatchStatus('Dispatched simulated alert to on-call channel.');
      setTimeout(() => setDispatchStatus(null), 4000);
    } finally {
      setIsDispatching(false);
    }
  };

  const getStrictOutputJson = () => {
    return JSON.stringify(
      {
        Status: report.status,
        Root_Cause_Analysis: {
          Breakdown: report.rootCauseAnalysis.summary,
          Trigger_Mechanism: report.rootCauseAnalysis.triggerMechanism,
          Component: report.rootCauseAnalysis.affectedComponent,
        },
        Affected_File_And_Location: `${report.rootCauseAnalysis.affectedFile} (Line ${report.rootCauseAnalysis.lineNumber})`,
        Proposed_Code_Patch: {
          Language: report.proposedCodePatch.language,
          Commit_Message: report.proposedCodePatch.hotfixCommitMessage,
          Explanation: report.proposedCodePatch.explanation,
          Hotfix_Code: report.proposedCodePatch.fixedCode,
        },
        Risk_And_Security_Assessment: {
          Risk_Level: report.riskAndSecurity.riskLevel,
          CVSS_Score: report.riskAndSecurity.cvssScore,
          Potential_Side_Effects: report.riskAndSecurity.potentialSideEffects,
          Performance_Impact: report.riskAndSecurity.performanceImpact,
          Security_Considerations: report.riskAndSecurity.securityConsiderations,
          Rollback_Strategy: report.riskAndSecurity.rollbackStrategy,
        },
        Human_In_The_Loop_Summary: report.humanInTheLoopSummary.slackTelegramMessage,
      },
      null,
      2
    );
  };

  return (
    <div className="bg-[#0b101e] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Action Header & Primary PR Button */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-[#080d1a] border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            HUMAN-IN-THE-LOOP ORCHESTRATION & NOTIFICATIONS
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            2-sentence on-call notifications, Slack/Telegram cards, and 1-click GitHub PR generation
          </p>
        </div>

        {/* 1-Click Pull Request Approval Button */}
        <button
          onClick={onOpenPRModal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-semibold rounded-lg shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <GitPullRequest className="w-4 h-4" />
          1-Click Approve & Generate GitHub PR
        </button>
      </div>

      {dispatchStatus && (
        <div className="mx-4 mt-3 p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{dispatchStatus}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 bg-[#090e1c] px-4 gap-2 text-xs">
        <button
          onClick={() => setActiveTab('slack')}
          className={`flex items-center gap-2 py-2.5 border-b-2 font-medium transition-colors ${
            activeTab === 'slack'
              ? 'border-indigo-400 text-indigo-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          Slack Executive Card
        </button>

        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-2 py-2.5 border-b-2 font-medium transition-colors ${
            activeTab === 'telegram'
              ? 'border-cyan-400 text-cyan-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          Telegram SRE Dispatch
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-2 py-2.5 border-b-2 font-medium transition-colors ${
            activeTab === 'json'
              ? 'border-emerald-400 text-emerald-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileJson className="w-3.5 h-3.5 text-emerald-400" />
          Enterprise JSON Format (Strict)
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {/* Slack View */}
        {activeTab === 'slack' && (
          <div className="space-y-3">
            {/* High-fidelity Slack message container */}
            <div className="bg-[#1a1d21] border border-slate-700/60 rounded-lg p-4 font-sans text-slate-200 shadow-md">
              {/* Bot identity */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold font-mono">
                  OO
                </div>
                <div>
                  <span className="font-bold text-sm text-white mr-2">OmniOps Agent</span>
                  <span className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded uppercase font-semibold">
                    APP
                  </span>
                  <span className="text-xs text-slate-400 ml-2">Just now</span>
                </div>
              </div>

              {/* Slack Card Body */}
              <div className="pl-9 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-semibold text-rose-400 font-mono">
                  <ShieldAlert className="w-4 h-4" />
                  INCIDENT ALERT: [{report.status}] {report.title}
                </div>

                <div className="bg-[#222529] p-3 rounded border border-slate-700/50 space-y-2">
                  <p className="text-slate-200 leading-relaxed font-mono text-xs">
                    {report.humanInTheLoopSummary.slackTelegramMessage}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/40 text-[11px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500">Service:</span> {report.service}
                    </div>
                    <div>
                      <span className="text-slate-500">Location:</span> {report.rootCauseAnalysis.affectedFile}:{report.rootCauseAnalysis.lineNumber}
                    </div>
                    <div>
                      <span className="text-slate-500">Risk Score:</span> {report.riskAndSecurity.cvssScore || report.riskAndSecurity.riskLevel}
                    </div>
                    <div>
                      <span className="text-slate-500">MTTD:</span> {report.mttdSeconds}s
                    </div>
                  </div>
                </div>

                {/* Slack Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={onOpenPRModal}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded transition-colors"
                  >
                    Approve Hotfix & Open PR
                  </button>
                  <button
                    onClick={() => handleCopy(report.proposedCodePatch.fixedCode, 'slack-code')}
                    className="px-3 py-1.5 bg-[#2c3136] hover:bg-[#383f46] text-slate-200 text-xs font-medium rounded transition-colors"
                  >
                    View Diff & Code
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-mono">
                Ready for Slack #sre-alerts and #incident-commander
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(report.humanInTheLoopSummary.slackTelegramMessage, 'slack-raw')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  {copied === 'slack-raw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy 2-Sentence Message
                </button>
                <button
                  disabled={isDispatching}
                  onClick={() => handleSimulateWebhookDispatch('slack')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 transition-colors font-medium"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch to Slack Webhook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Telegram View */}
        {activeTab === 'telegram' && (
          <div className="space-y-3">
            <div className="bg-[#17212b] border border-[#242f3d] rounded-lg p-4 font-mono text-xs text-slate-200 shadow-md">
              <div className="text-cyan-400 font-bold mb-2">
                🚨 OMNIOPS SRE ON-CALL DISPATCH
              </div>
              <div className="bg-[#0e1621] p-3 rounded border border-[#242f3d] text-slate-300 space-y-2 whitespace-pre-wrap">
                {`Status: [${report.status}]
Service: ${report.service} (${report.environment})
Root Cause: ${report.rootCauseAnalysis.summary}
Affected File: ${report.rootCauseAnalysis.affectedFile} (Line ${report.rootCauseAnalysis.lineNumber})

Summary for Engineer:
${report.humanInTheLoopSummary.slackTelegramMessage}

Rollback Plan: ${report.riskAndSecurity.rollbackStrategy}`}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-mono">
                Formatted for Telegram Bot API MarkdownV2
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(report.humanInTheLoopSummary.slackTelegramMessage, 'telegram-raw')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  {copied === 'telegram-raw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Telegram Text
                </button>
                <button
                  disabled={isDispatching}
                  onClick={() => handleSimulateWebhookDispatch('telegram')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 transition-colors font-medium"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Telegram Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise JSON Strict Format View */}
        {activeTab === 'json' && (
          <div className="space-y-3">
            <div className="relative">
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
                {getStrictOutputJson()}
              </pre>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                Strict enterprise JSON format conforming with CI/CD automation & incident response schemas
              </span>
              <button
                onClick={() => handleCopy(getStrictOutputJson(), 'json')}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors font-mono"
              >
                {copied === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy JSON Payload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
