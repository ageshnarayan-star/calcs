import React, { useState } from 'react';
import {
  solveQuadratic,
  analyzeMatrix,
  convertBases,
  calculateStatistics,
  QuadraticResult,
  MatrixAnalysis,
  BaseConversions,
  StatisticsResult,
} from '../lib/toolsMath';
import { Binary, Grid, Sigma, HelpCircle, Copy, Check } from 'lucide-react';

type ToolSubTab = 'quadratic' | 'matrix' | 'base' | 'statistics';

export const Tools: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<ToolSubTab>('quadratic');

  // --- Quadratic State ---
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-5);
  const [quadC, setQuadC] = useState<number>(6);

  const quadResult = React.useMemo(() => {
    return solveQuadratic(quadA, quadB, quadC);
  }, [quadA, quadB, quadC]);

  // --- Matrix State ---
  const [matrixDim, setMatrixDim] = useState<2 | 3>(2);
  const [matrix2, setMatrix2] = useState<number[][]>([
    [4, 7],
    [2, 6],
  ]);
  const [matrix3, setMatrix3] = useState<number[][]>([
    [1, 2, 3],
    [0, 1, 4],
    [5, 6, 0],
  ]);

  const activeMatrix = matrixDim === 2 ? matrix2 : matrix3;
  const matrixAnalysis: MatrixAnalysis = React.useMemo(() => {
    return analyzeMatrix(activeMatrix);
  }, [activeMatrix]);

  const handleMatrixCellChange = (r: number, c: number, val: number) => {
    if (matrixDim === 2) {
      const copy = matrix2.map((row) => [...row]);
      copy[r][c] = val;
      setMatrix2(copy);
    } else {
      const copy = matrix3.map((row) => [...row]);
      copy[r][c] = val;
      setMatrix3(copy);
    }
  };

  // --- Base Converter State ---
  const [baseInput, setBaseInput] = useState('255');
  const [selectedBase, setSelectedBase] = useState<2 | 8 | 10 | 16>(10);
  const [copiedBase, setCopiedBase] = useState<string | null>(null);

  const baseResults: BaseConversions | { error: string } = React.useMemo(() => {
    return convertBases(baseInput, selectedBase);
  }, [baseInput, selectedBase]);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBase(key);
    setTimeout(() => setCopiedBase(null), 1500);
  };

  // --- Statistics State ---
  const [statsInput, setStatsInput] = useState('12, 18, 24, 30, 30, 42, 54, 60');
  const statsResult: StatisticsResult | { error: string } = React.useMemo(() => {
    const parsed = statsInput
      .split(/[\s,;\n]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !Number.isNaN(n));
    return calculateStatistics(parsed);
  }, [statsInput]);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
      {/* Sub-tool tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubTab('quadratic')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'quadratic'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <span>ax² + bx + c</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('matrix')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'matrix'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('base')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'base'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Binary className="w-4 h-4" />
          <span>Base Base</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('statistics')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'statistics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sigma className="w-4 h-4" />
          <span>Statistics</span>
        </button>
      </div>

      {/* QUADRATIC TAB */}
      {activeSubTab === 'quadratic' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-5">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Quadratic Equation Solver</h3>
            <p className="text-xs text-slate-400">
              Find roots, discriminant, vertex, and derivation steps for <span className="font-mono text-indigo-300">ax² + bx + c = 0</span>.
            </p>
          </div>

          {/* Coefficients Input */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">a (coefficient of x²)</label>
              <input
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">b (coefficient of x)</label>
              <input
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">c (constant term)</label>
              <input
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {'error' in quadResult ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>{quadResult.error}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400 mb-0.5">Discriminant (Δ)</div>
                  <div className="text-lg font-mono font-bold text-white">
                    {quadResult.discriminant}
                  </div>
                  <div className="text-[10px] text-indigo-400 mt-1 capitalize font-medium">
                    {quadResult.rootType.replace('-', ' ')}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400 mb-0.5">Roots (x₁, x₂)</div>
                  <div className="text-sm font-mono font-bold text-indigo-300">
                    x₁ = {quadResult.roots.x1}
                  </div>
                  <div className="text-sm font-mono font-bold text-indigo-300 mt-0.5">
                    x₂ = {quadResult.roots.x2}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400 mb-0.5">Parabola Vertex (h, k)</div>
                  <div className="text-base font-mono font-bold text-white">
                    ({parseFloat(quadResult.vertex.h.toFixed(3))}, {parseFloat(quadResult.vertex.k.toFixed(3))})
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Opens {quadA > 0 ? 'Upwards' : 'Downwards'}
                  </div>
                </div>
              </div>

              {/* Steps derivation */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Step-by-Step Derivation</div>
                {quadResult.steps.map((st, i) => (
                  <div key={i} className="text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MATRIX TAB */}
      {activeSubTab === 'matrix' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100 mb-1">Matrix Determinant & Inverse</h3>
              <p className="text-xs text-slate-400">
                Calculate determinant, inverse, transpose, and trace for 2×2 or 3×3 square matrices.
              </p>
            </div>
            {/* Dimension switcher */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setMatrixDim(2)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  matrixDim === 2 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2×2
              </button>
              <button
                type="button"
                onClick={() => setMatrixDim(3)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  matrixDim === 3 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3×3
              </button>
            </div>
          </div>

          {/* Matrix Input Grid */}
          <div className="flex flex-col items-center justify-center py-2">
            <div
              className={`grid gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 ${
                matrixDim === 2 ? 'grid-cols-2 max-w-xs' : 'grid-cols-3 max-w-md'
              }`}
            >
              {activeMatrix.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`${r}-${c}`}
                    type="number"
                    value={val}
                    onChange={(e) => handleMatrixCellChange(r, c, parseFloat(e.target.value) || 0)}
                    aria-label={`Matrix cell [${r+1}, ${c+1}]`}
                    className="w-16 sm:w-20 h-12 text-center rounded-xl bg-slate-800 border border-slate-700 font-mono text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ))
              )}
            </div>
          </div>

          {/* Analysis Outputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-[11px] text-slate-400 mb-0.5">Determinant (det A)</div>
              <div className="text-xl font-mono font-bold text-indigo-300">
                {matrixAnalysis.determinant}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {matrixAnalysis.isSingular ? 'Singular (no inverse exists)' : 'Non-singular (invertible)'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-[11px] text-slate-400 mb-0.5">Trace (tr A)</div>
              <div className="text-xl font-mono font-bold text-white">
                {matrixAnalysis.trace}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Sum of diagonal elements</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-[11px] text-slate-400 mb-0.5">Status</div>
              <div className={`text-base font-bold ${matrixAnalysis.isSingular ? 'text-amber-400' : 'text-emerald-400'}`}>
                {matrixAnalysis.isSingular ? 'Singular Matrix' : 'Invertible Matrix'}
              </div>
            </div>
          </div>

          {/* Inverse Matrix & Transpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300">Inverse Matrix (A⁻¹)</span>
              {matrixAnalysis.inverse ? (
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs overflow-x-auto">
                  {matrixAnalysis.inverse.map((row, r) => (
                    <div key={r} className="flex justify-around py-0.5">
                      {row.map((val, c) => (
                        <span key={c} className="text-indigo-300 font-semibold px-2">
                          {val}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-amber-400/90 py-2">
                  Determinant is 0, so the inverse does not exist.
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300">Transpose Matrix (Aᵀ)</span>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs overflow-x-auto">
                {matrixAnalysis.transpose.map((row, r) => (
                  <div key={r} className="flex justify-around py-0.5">
                    {row.map((val, c) => (
                      <span key={c} className="text-slate-300 px-2">
                        {val}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BASE CONVERTER TAB */}
      {activeSubTab === 'base' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-5">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Base Number Converter</h3>
            <p className="text-xs text-slate-400">
              Convert between Binary, Octal, Decimal, and Hexadecimal representations instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={baseInput}
                onChange={(e) => setBaseInput(e.target.value)}
                placeholder="Enter number..."
                aria-label="Input number in selected base"
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 font-mono text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
              {([
                { label: 'BIN', val: 2 },
                { label: 'OCT', val: 8 },
                { label: 'DEC', val: 10 },
                { label: 'HEX', val: 16 },
              ] as const).map((b) => (
                <button
                  key={b.val}
                  type="button"
                  onClick={() => setSelectedBase(b.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedBase === b.val
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {'error' in baseResults ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>{baseResults.error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {([
                { key: 'dec', label: 'Decimal (Base 10)', val: baseResults.dec },
                { key: 'hex', label: 'Hexadecimal (Base 16)', val: baseResults.hex },
                { key: 'bin', label: 'Binary (Base 2)', val: baseResults.bin },
                { key: 'oct', label: 'Octal (Base 8)', val: baseResults.oct },
              ] as const).map((item) => (
                <div
                  key={item.key}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => copyText(item.key, item.val)}
                      aria-label={`Copy ${item.label}`}
                      className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Copy"
                    >
                      {copiedBase === item.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-indigo-300 break-all select-all">
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STATISTICS TAB */}
      {activeSubTab === 'statistics' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-5">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Descriptive Statistics</h3>
            <p className="text-xs text-slate-400">
              Compute mean, median, mode, standard deviation (sample & population), variance, and quartiles.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400">
              Enter numbers (comma, space, or newline separated)
            </label>
            <textarea
              rows={3}
              value={statsInput}
              onChange={(e) => setStatsInput(e.target.value)}
              placeholder="e.g. 10, 15, 20, 25, 30"
              aria-label="Dataset numbers separated by commas or spaces"
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {'error' in statsResult ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>{statsResult.error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Count (N)</span>
                <div className="text-base font-mono font-bold text-white">{statsResult.count}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Sum (Σx)</span>
                <div className="text-base font-mono font-bold text-white">{statsResult.sum}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Mean (Average)</span>
                <div className="text-base font-mono font-bold text-indigo-300">{statsResult.mean}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Median</span>
                <div className="text-base font-mono font-bold text-indigo-300">{statsResult.median}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Mode</span>
                <div className="text-sm font-mono font-bold text-white truncate">
                  {statsResult.mode.length > 0 ? statsResult.mode.join(', ') : 'None'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Sample Std Dev (s)</span>
                <div className="text-base font-mono font-bold text-white">{statsResult.stdDevSample}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Pop. Std Dev (σ)</span>
                <div className="text-base font-mono font-bold text-white">{statsResult.stdDevPop}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Range (Max - Min)</span>
                <div className="text-base font-mono font-bold text-white">
                  {statsResult.range} <span className="text-[10px] text-slate-500 font-normal">({statsResult.min} to {statsResult.max})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 col-span-2 sm:col-span-3 md:col-span-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Quartiles: Q1 = {statsResult.q1}, Q2 (Median) = {statsResult.median}, Q3 = {statsResult.q3}</span>
                  <span className="text-indigo-400 font-semibold">IQR = {statsResult.iqr}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
