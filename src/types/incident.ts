export type IncidentStatus = 'CRITICAL' | 'WARNING' | 'INFO';

export type Environment = 'production' | 'staging' | 'canary';

export interface RootCauseAnalysis {
  summary: string;
  triggerMechanism: string;
  affectedComponent: string;
  affectedFile: string;
  lineNumber: number;
  stackTraceSnippet: string;
}

export interface ProposedCodePatch {
  originalCode: string;
  fixedCode: string;
  language: string;
  explanation: string;
  hotfixCommitMessage: string;
}

export interface RiskAndSecurity {
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  cvssScore?: string;
  potentialSideEffects: string[];
  performanceImpact: string;
  securityConsiderations: string;
  rollbackStrategy: string;
}

export interface HumanInTheLoopSummary {
  slackTelegramMessage: string;
  executiveSummary: string;
}

export interface PipelineStep {
  id: string;
  phase: 'INGEST' | 'ISOLATE' | 'SYNTHESIS' | 'LINT' | 'DEVSECOPS' | 'CI_CD' | 'DISPATCH';
  label: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  detail: string;
  timestamp: string;
}

export interface IncidentReport {
  id: string;
  status: IncidentStatus;
  title: string;
  service: string;
  environment: Environment;
  timestamp: string;
  mttdSeconds: number;
  rootCauseAnalysis: RootCauseAnalysis;
  proposedCodePatch: ProposedCodePatch;
  riskAndSecurity: RiskAndSecurity;
  humanInTheLoopSummary: HumanInTheLoopSummary;
  suggestedInfraActions: string[];
  pipelineSteps?: PipelineStep[];
}

export interface IncidentScenario {
  id: string;
  title: string;
  service: string;
  category: 'Cloud Microservices' | 'Security & DevSecOps' | 'REST API 500';
  status: IncidentStatus;
  environment: Environment;
  description: string;
  sampleLogs: string;
  expectedFile: string;
  expectedLine: number;
}
