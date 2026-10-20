# OmniOps Agent: Autonomous DevSecOps & Incident Response AI System

Autonomous DevSecOps & Incident Response platform that ingests raw server logs, pinpoints root causes with file/line precision, generates verified production hotfixes with side-by-side code diffs, assesses security/performance risks, and automates multi-channel notifications (Slack/Telegram) alongside 1-click Git Pull Request creation.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your confirmed choices in Phase 1, OmniOps Agent will be built with:
> 1. **Enterprise Multi-layer Scenarios**: Microservice crashes (K8s/Python/Node.js/SQL), Security breaches (Token leaks/SQLi), and REST API 500 errors.
> 2. **Hybrid Command View**: SRE Incident Room with side-by-side Code Diff, Risk Matrix, 1-click PR approval, streaming pipeline terminal, and Slack/Telegram notifications.
> 3. **Unified Multi-Source Ingestion**: Live webhook listeners (Cloud Logging / Crashlytics / GitHub), Interactive Chaos Simulator (Pod failure, OOM, SQL leak), and manual log paste sandbox.

- **Confirmed Decision 1**: Server-side Gemini 3.8-Flash engine (`/api/analyze-incident`) for instant root-cause analysis, hotfix generation, and risk classification.
- **Confirmed Decision 2**: Interactive Chaos Simulator with one-click outage injections to test agent autonomy in real time.
- **Confirmed Decision 3**: High-density DevSecOps dark theme (`#090D16` / `#0F172A`) with JetBrains Mono tabular code viewers and zero-pill typographic discipline.

---

## 1. Overview & Core Concept

- **What It Does**: OmniOps Agent operates as an automated on-call SRE & DevSecOps engineer. When an error occurs or a log batch is ingested, the agent traces the execution flow, isolates the malfunctioning file and line, evaluates the vulnerability/risk profile, writes hotfix code, validates the patch through a simulated CI/CD test harness, and provides an enterprise-ready response for both executive managers and on-call engineers.
- **Target Audience**: Site Reliability Engineers (SREs), DevOps/DevSecOps teams, backend developers, and engineering managers running cloud microservices.
- **Key Value**: Drastically reduces Mean Time to Detection (MTTD) and Mean Time to Remediation (MTTR) from hours to seconds while maintaining human-in-the-loop control through clear risk assessments and one-click PR approvals.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Incident Ingestion & Inflow**:
   - Choose from preloaded enterprise incidents (e.g., *Postgres Connection Pool Exhaustion*, *Kubernetes OOMKilled Pod Crash*, *JWT Secret Auth Bypass Leak*, *Python Asyncio Event Loop Deadlock*), trigger an instant Chaos scenario, or paste custom raw logs & stack traces.
2. **Autonomous Agent Analysis**:
   - The Agent spins up in the **Live Pipeline Terminal**, streaming verification phases: `[LOG INGESTION] -> [STACK TRACE PARSING] -> [ROOT CAUSE ISOLATION] -> [HOTFIX SYNTHESIS] -> [SECURITY & RISK SCAN] -> [PR & ALERT DISPATCH]`.
3. **SRE Incident Room & Code Diff**:
   - Inspect the **Root Cause Analysis** breakdown (File, Line, Failure Mechanism).
   - Side-by-side **Code Diff Viewer** showing original broken code vs. proposed hotfix with line-level red/green diffing and syntax highlighting.
   - **Risk & Security Matrix**: Severity badge (`CRITICAL` / `WARNING` / `INFO`), CVSS score, performance side-effects, backward compatibility check, and rollback strategy.
4. **Action & Remediation**:
   - **1-Click Pull Request Approval**: Generates and simulates a GitHub Pull Request with branch naming, commit message, and full markdown description.
   - **Slack / Telegram Alerts**: Formatted executive and engineer-ready cards with 1-click copy and simulated webhook dispatch.
   - **Export Clean JSON**: Enterprise-ready strict JSON payload for automated CI/CD processing.

### Visual Identity & Theme
- **Theme**: Deep dark cyber-ops console (`bg-[#0B0F19]`, card surfaces `bg-[#111827]`, subtle borders `border-slate-800`).
- **Accent Palette**: 
  - Status Crimson (`#EF4444`) for Critical outages and red diffs.
  - Emerald (`#10B981`) for Clean hotfixes, nominal state, and green diffs.
  - Amber (`#F59E0B`) for Warnings and risk flags.
  - Cyan (`#06B6D4`) for Autonomous Agent pipeline execution steps.
- **Typography**: Clean display structure via `Plus Jakarta Sans` or modern sans, with `font-mono` (`JetBrains Mono` / tabular numerals) for all logs, file paths, and code patches.
- **Zero-Pill Discipline**: Status and metadata displayed as clean unboxed typography with semantic color accents and bullet separators (`CRITICAL · src/db/pool.py:84 · CVSS 8.9`).

---

## 3. Key Product Decisions & Trade-Offs

- **Server-Side Gemini Integration**:
  - *Chosen Approach*: Node/Express server proxy (`/api/analyze-incident`) using `@google/genai` with model `gemini-3.8-flash`.
  - *Why*: Fast latency (<2s), structured JSON output guarantee, and keeps credentials secure on the server.
- **Built-in Chaos Outage Generator**:
  - *Chosen Approach*: Interactive Chaos Engineering engine that injects realistic microservice crashes, memory leaks, and auth security bypasses with realistic multi-line stack traces.
  - *Why*: Allows immediate, rich interactive exploration without requiring external infrastructure setup.
- **Interactive Code Diff Engine**:
  - *Chosen Approach*: Dedicated side-by-side and unified diff component with line numbering, syntax highlighting, and copyable patches.
  - *Why*: SREs require line-by-line inspection before approving autonomous patches.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OmniOps Command Center UI                       │
├───────────────────┬───────────────────────────────────┬────────────────┤
│ Ingestion Console │      SRE Incident Room View       │ Agent Pipeline │
│ - Chaos Simulator │  - Side-by-Side Code Diff Viewer  │ - Live Terminal│
│ - Scenario Preset │  - Root Cause Breakdown (File/Line)│ - Step Stream  │
│ - Raw Log Paste   │  - Risk & Security Matrix         │ - CI/CD Check  │
│ - Webhook Hub     │  - Slack / Telegram Card Previews │ - PR Dispatch  │
└─────────┬─────────┴─────────────────┬─────────────────┴────────┬───────┘
          │                           │                          │
          ▼                           ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Express Full-Stack Server & Proxy                     │
│  - POST /api/analyze-incident  (Gemini 3.8-Flash Structured JSON)      │
│  - POST /api/simulate-pr       (GitHub PR Dispatcher)                  │
│  - POST /api/webhook/ingest    (Cloud Logging / Crashlytics Ingestion) │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema (Strict Output Format)
```typescript
interface IncidentReport {
  id: string;
  status: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  service: string;
  environment: 'production' | 'staging' | 'canary';
  timestamp: string;
  rootCauseAnalysis: {
    summary: string;
    triggerMechanism: string;
    affectedComponent: string;
    affectedFile: string;
    lineNumber: number;
    stackTraceSnippet: string;
  };
  proposedCodePatch: {
    originalCode: string;
    fixedCode: string;
    language: string;
    explanation: string;
    hotfixCommitMessage: string;
  };
  riskAndSecurity: {
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    cvssScore?: string;
    potentialSideEffects: string[];
    performanceImpact: string;
    securityConsiderations: string;
    rollbackStrategy: string;
  };
  humanInTheLoopSummary: {
    slackTelegramMessage: string;
    executiveSummary: string;
  };
  suggestedInfraActions: string[];
}
```
