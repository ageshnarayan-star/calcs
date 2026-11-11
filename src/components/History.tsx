import React, { useState } from 'react';
import { History as HistoryIcon, Trash2, ArrowUpRight, Sparkles, Copy, Check, Clock } from 'lucide-react';
import { AngleMode } from '../lib/math';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  angleMode: AngleMode;
  timestamp: number;
}

interface HistoryProps {
  history: HistoryItem[];
  onSelectEntry: (item: HistoryItem) => void;
  onExplainEntry: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({
  history,
  onSelectEntry,
  onExplainEntry,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-sm text-slate-200">Calculation History</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {history.length}
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            aria-label="Clear calculation history"
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-center px-4">
            <Clock className="w-8 h-8 mb-2 stroke-1 text-slate-600" />
            <p className="text-xs">No previous calculations yet.</p>
            <p className="text-[11px] text-slate-600 mt-1">Calculations you evaluate will be saved here automatically.</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectEntry(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectEntry(item);
              }}
              className="group relative p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/40 hover:border-indigo-500/50 transition-all cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-mono text-slate-500">{formatTime(item.timestamp)}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-700/60 font-semibold text-slate-300">
                  {item.angleMode}
                </span>
              </div>

              <div className="font-mono text-xs text-slate-300 group-hover:text-white truncate mb-1">
                {item.expression}
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-slate-400 text-xs font-mono">=</span>
                <span className="font-mono text-base font-bold text-indigo-300 group-hover:text-indigo-200">
                  {item.result}
                </span>
              </div>

              {/* Actions bar on hover */}
              <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={(e) => handleCopy(item.id, item.result, e)}
                  aria-label="Copy result"
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-700/40 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy result"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExplainEntry(item);
                  }}
                  aria-label="Explain this calculation with AI"
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 transition-colors"
                  title="Explain with AI Math Tutor"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Explain</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEntry(item);
                  }}
                  aria-label="Reuse expression in calculator"
                  className="p-1 rounded bg-slate-700/40 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Insert into calculator"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
