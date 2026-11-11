import React from 'react';
import { AngleMode } from '../lib/math';
import { Delete } from 'lucide-react';

interface DisplayProps {
  expression: string;
  result: string | null;
  livePreview: string | null;
  error: string | null;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  hasMemory: boolean;
  onBackspace: () => void;
  onClear: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  livePreview,
  error,
  angleMode,
  onToggleAngleMode,
  hasMemory,
  onBackspace,
  onClear,
}) => {
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-5 border border-slate-800 shadow-inner flex flex-col justify-between min-h-[140px] sm:min-h-[160px] text-right">
      {/* Top status bar: DEG/RAD badge, Memory indicator, clear/backspace */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 select-none pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAngleMode}
            aria-label={`Toggle angle mode, current is ${angleMode}`}
            className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-indigo-400 font-bold tracking-wider text-[11px] transition-colors border border-slate-700/50"
            title="Toggle between Degree and Radian modes"
          >
            {angleMode}
          </button>
          {hasMemory && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
              title="Memory contains saved value"
            >
              M
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {expression && (
            <>
              <button
                type="button"
                onClick={onBackspace}
                aria-label="Delete last character"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Backspace (Delete)"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear display"
                className="px-2 py-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
                title="Clear all (Escape)"
              >
                AC
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Expression Input display */}
      <div className="flex-1 flex flex-col justify-end mt-2 overflow-hidden">
        <div className="overflow-x-auto whitespace-nowrap text-right py-1 custom-scrollbar">
          <span
            className="font-mono text-xl sm:text-2xl text-slate-300 tracking-wide font-normal select-all inline-block"
            title={expression || '0'}
          >
            {expression || <span className="text-slate-600">0</span>}
          </span>
        </div>

        {/* Live Preview or Evaluated Result or Error */}
        <div className="min-h-[36px] flex items-center justify-end">
          {error ? (
            <div className="flex items-center gap-1 text-rose-400 font-medium text-sm sm:text-base animate-pulse">
              <span>{error}</span>
            </div>
          ) : result !== null ? (
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-indigo-400 text-lg font-mono">=</span>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight select-all">
                {result}
              </span>
            </div>
          ) : livePreview !== null ? (
            <div className="flex items-baseline justify-end gap-1.5 opacity-70">
              <span className="text-slate-500 text-sm font-mono">≈</span>
              <span className="font-mono text-lg sm:text-xl font-semibold text-indigo-300">
                {livePreview}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
