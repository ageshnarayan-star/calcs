import React, { useState, useEffect } from 'react';
import { solveWithAI } from '../lib/api';
import { MathRenderer } from './MathRenderer';
import { Sparkles, Send, Loader2, AlertCircle, Copy, Check, ArrowRight, Lightbulb } from 'lucide-react';

interface AIAssistantProps {
  initialPrompt?: string;
  onSendToCalculator?: (val: string) => void;
}

const SAMPLE_PROMPTS = [
  'A train travels 120 km in 1.5 h, find speed',
  'Solve system: 2x + 3y = 12 and x - y = 1',
  'Find the integral of x * sin(x) from 0 to π',
  'A projectile is launched at 45° with 20 m/s, find max height',
  'Factor the polynomial: x^3 - 6x^2 + 11x - 6',
];

export const AIAssistant: React.FC<AIAssistantProps> = ({
  initialPrompt = '',
  onSendToCalculator,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleSolve(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSolve = async (textToSolve?: string) => {
    const text = (textToSolve ?? prompt).trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);
    setSolution(null);

    const res = await solveWithAI({ prompt: text });

    if (res.ok && res.solution) {
      setSolution(res.solution);
    } else {
      setError(res.error || 'Failed to solve with AI math tutor.');
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSolve();
    }
  };

  const handleCopy = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Try extracting the numerical/algebraic answer for the "Send to Calculator" button
  const extractedAnswer = React.useMemo(() => {
    if (!solution) return null;
    const match = solution.match(/Answer:\s*([^\n\r]+)/i);
    if (!match) return null;
    const raw = match[1].replace(/[$`]/g, '').trim();
    // Check if it has a number or clean equation
    return raw;
  }, [solution]);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-violet-950/60 border border-indigo-500/30 flex items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <span>AI Math Tutor</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-semibold">
                Gemini Powered
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask word problems, step-by-step calculus, proofs, or algebra problems.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-3">
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a math word problem or equation (e.g. 'A train travels 120 km in 1.5 h, find speed')..."
            maxLength={2000}
            aria-label="Ask AI Math Tutor a math problem"
            className="w-full p-3.5 pr-14 rounded-xl bg-slate-800 border border-slate-700/80 font-sans text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[90px]"
          />

          <button
            type="button"
            onClick={() => handleSolve()}
            disabled={!prompt.trim() || loading}
            aria-label="Send to AI Math Tutor"
            className="absolute right-3 bottom-4 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all shadow-md active:scale-95 flex items-center justify-center"
            title="Solve with AI (Ctrl+Enter)"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>Press Ctrl+Enter or Cmd+Enter to solve</span>
          <span>{prompt.length}/2000 chars</span>
        </div>

        {/* Sample Prompt Chips */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Try an example problem:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setPrompt(sample);
                  handleSolve(sample);
                }}
                className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <div className="text-sm font-semibold text-slate-300">
            Analyzing mathematical problem & formulating step-by-step solution...
          </div>
          <div className="text-xs text-slate-500">Formulas, proofs, and final answer incoming</div>
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-rose-200">Unable to generate solution</div>
            <div>{error}</div>
            {error.includes('GEMINI_API_KEY') && (
              <div className="text-[11px] text-rose-400/80 pt-1">
                Make sure GEMINI_API_KEY is configured in your backend environment variables (.env.local or Vercel Settings).
              </div>
            )}
          </div>
        </div>
      )}

      {/* Solution Display */}
      {solution && !loading && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Step-by-Step Solution
              </span>
            </div>

            <div className="flex items-center gap-2">
              {extractedAnswer && onSendToCalculator && (
                <button
                  type="button"
                  onClick={() => onSendToCalculator(extractedAnswer)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-colors font-medium"
                  title="Insert answer into Calculator display"
                >
                  <span>Use in Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy solution"
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                title="Copy solution text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <MathRenderer content={solution} />
        </div>
      )}
    </div>
  );
};
