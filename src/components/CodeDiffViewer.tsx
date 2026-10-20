import React, { useState } from 'react';
import { Copy, Check, Columns, AlignLeft, Download, FileCode2 } from 'lucide-react';
import { ProposedCodePatch } from '../types/incident';

interface CodeDiffViewerProps {
  patch: ProposedCodePatch;
  filePath: string;
  lineNumber: number;
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({
  patch,
  filePath,
  lineNumber,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copiedType, setCopiedType] = useState<'patch' | 'code' | null>(null);

  const originalLines = patch.originalCode.split('\n');
  const fixedLines = patch.fixedCode.split('\n');
  const maxLines = Math.max(originalLines.length, fixedLines.length);

  const handleCopy = (text: string, type: 'patch' | 'code') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadPatch = () => {
    const patchContent = `--- a/${filePath}
+++ b/${filePath}
@@ -${lineNumber},${originalLines.length} +${lineNumber},${fixedLines.length} @@
${originalLines.map((l) => `-${l}`).join('\n')}
${fixedLines.map((l) => `+${l}`).join('\n')}
`;
    const blob = new Blob([patchContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotfix-${filePath.replace(/[/\\.]/g, '_')}.patch`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#090d18] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#060911] border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <FileCode2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white">{filePath}</span>
          <span className="text-slate-500">·</span>
          <span className="text-amber-400">Target Line: {lineNumber}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 uppercase text-[11px]">{patch.language}</span>
        </div>

        {/* View toggles & copy actions */}
        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded transition-colors ${
                viewMode === 'split'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Split Diff
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded transition-colors ${
                viewMode === 'unified'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              Unified
            </button>
          </div>

          <button
            onClick={() => handleCopy(patch.fixedCode, 'code')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300 hover:text-white transition-colors text-[11px]"
          >
            {copiedType === 'code' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Code
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Code
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPatch}
            title="Download .patch file"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300 hover:text-white transition-colors text-[11px]"
          >
            <Download className="w-3.5 h-3.5" />
            .patch
          </button>
        </div>
      </div>

      {/* Code Body */}
      {viewMode === 'split' ? (
        /* Side-by-Side Split View */
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-mono text-xs overflow-x-auto">
          {/* Left Column: Broken / Original */}
          <div className="bg-[#0b0709]/70">
            <div className="px-3 py-1.5 bg-rose-950/40 border-b border-rose-900/30 text-[11px] font-semibold text-rose-300 flex items-center justify-between">
              <span>ORIGINAL CODE (VULNERABLE / DEFECTIVE)</span>
              <span className="text-rose-400/80 font-normal">Line {lineNumber}</span>
            </div>
            <div className="py-2 overflow-x-auto">
              {Array.from({ length: maxLines }).map((_, idx) => {
                const line = originalLines[idx];
                const lineNum = lineNumber + idx;
                const hasLine = line !== undefined;
                return (
                  <div
                    key={`orig-${idx}`}
                    className={`flex items-start px-2 py-0.5 ${
                      hasLine ? 'bg-rose-950/20 text-rose-200 hover:bg-rose-950/40' : 'text-transparent'
                    }`}
                  >
                    <span className="w-8 shrink-0 select-none text-right pr-3 text-rose-600/70 tabular-nums text-[11px]">
                      {hasLine ? lineNum : ''}
                    </span>
                    <span className="w-4 shrink-0 select-none text-rose-500 font-bold">
                      {hasLine ? '-' : ''}
                    </span>
                    <span className="whitespace-pre overflow-x-visible leading-relaxed">
                      {hasLine ? line : ' '}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Fixed / Hotfix */}
          <div className="bg-[#050f0c]/70">
            <div className="px-3 py-1.5 bg-emerald-950/40 border-b border-emerald-900/30 text-[11px] font-semibold text-emerald-300 flex items-center justify-between">
              <span>PROPOSED PRODUCTION HOTFIX</span>
              <span className="text-emerald-400/80 font-normal">Automated Patch</span>
            </div>
            <div className="py-2 overflow-x-auto">
              {Array.from({ length: maxLines }).map((_, idx) => {
                const line = fixedLines[idx];
                const lineNum = lineNumber + idx;
                const hasLine = line !== undefined;
                return (
                  <div
                    key={`fixed-${idx}`}
                    className={`flex items-start px-2 py-0.5 ${
                      hasLine ? 'bg-emerald-950/25 text-emerald-200 hover:bg-emerald-950/40' : 'text-transparent'
                    }`}
                  >
                    <span className="w-8 shrink-0 select-none text-right pr-3 text-emerald-600/70 tabular-nums text-[11px]">
                      {hasLine ? lineNum : ''}
                    </span>
                    <span className="w-4 shrink-0 select-none text-emerald-400 font-bold">
                      {hasLine ? '+' : ''}
                    </span>
                    <span className="whitespace-pre overflow-x-visible leading-relaxed">
                      {hasLine ? line : ' '}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Unified Inline View */
        <div className="font-mono text-xs overflow-x-auto py-2 bg-[#090d18]">
          {/* Deleted lines */}
          {originalLines.map((line, idx) => (
            <div
              key={`u-del-${idx}`}
              className="flex items-start px-3 py-0.5 bg-rose-950/25 text-rose-200 hover:bg-rose-950/40"
            >
              <span className="w-9 shrink-0 select-none text-right pr-3 text-rose-500/70 tabular-nums text-[11px]">
                {lineNumber + idx}
              </span>
              <span className="w-9 shrink-0 select-none text-right pr-3 text-slate-700 tabular-nums text-[11px]">
                -
              </span>
              <span className="w-4 shrink-0 select-none text-rose-400 font-bold">-</span>
              <span className="whitespace-pre leading-relaxed">{line}</span>
            </div>
          ))}

          {/* Added lines */}
          {fixedLines.map((line, idx) => (
            <div
              key={`u-add-${idx}`}
              className="flex items-start px-3 py-0.5 bg-emerald-950/30 text-emerald-200 hover:bg-emerald-950/50"
            >
              <span className="w-9 shrink-0 select-none text-right pr-3 text-slate-700 tabular-nums text-[11px]">
                -
              </span>
              <span className="w-9 shrink-0 select-none text-right pr-3 text-emerald-500/70 tabular-nums text-[11px]">
                {lineNumber + idx}
              </span>
              <span className="w-4 shrink-0 select-none text-emerald-400 font-bold">+</span>
              <span className="whitespace-pre leading-relaxed">{line}</span>
            </div>
          ))}
        </div>
      )}

      {/* Explanation & Commit message footer */}
      <div className="px-4 py-3 bg-[#060911] border-t border-slate-800 text-xs">
        <div className="mb-2">
          <span className="text-slate-400 font-medium">Patch Rationale: </span>
          <span className="text-slate-200">{patch.explanation}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
          <span className="text-cyan-400 font-semibold">Commit:</span>
          <span className="text-slate-300 truncate">{patch.hotfixCommitMessage}</span>
        </div>
      </div>
    </div>
  );
};
