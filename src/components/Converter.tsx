import React, { useState, useMemo } from 'react';
import { UNIT_CATEGORIES, convertUnit } from '../lib/converter';
import { ArrowLeftRight, Copy, Check, Info } from 'lucide-react';

export const Converter: React.FC = () => {
  const [categoryId, setCategoryId] = useState('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState('m');
  const [toUnitId, setToUnitId] = useState('ft');
  const [copied, setCopied] = useState(false);

  // Active category
  const activeCategory = useMemo(() => {
    return UNIT_CATEGORIES.find((c) => c.id === categoryId) || UNIT_CATEGORIES[0];
  }, [categoryId]);

  // When category changes, reset default from and to units
  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length >= 2) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
  };

  // Perform conversion
  const { result, formula } = useMemo(() => {
    const num = parseFloat(inputValue);
    if (Number.isNaN(num)) return { result: 0, formula: '' };
    return convertUnit(num, categoryId, fromUnitId, toUnitId);
  }, [inputValue, categoryId, fromUnitId, toUnitId]);

  const formattedResult = useMemo(() => {
    if (Number.isNaN(result)) return '0';
    if (Math.abs(result) >= 1e9 || (Math.abs(result) < 1e-6 && Math.abs(result) > 0)) {
      return result.toExponential(6);
    }
    return parseFloat(result.toPrecision(8)).toString();
  }, [result]);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleCopy = () => {
    const toUnit = activeCategory.units.find((u) => u.id === toUnitId);
    navigator.clipboard.writeText(`${formattedResult} ${toUnit?.symbol || ''}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
        {UNIT_CATEGORIES.map((cat) => {
          const isActive = cat.id === categoryId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/60'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Main Conversion Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* From Input Box */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400">From</label>
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-xl font-mono text-white focus:outline-none"
              />
              <select
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full bg-slate-900 text-xs sm:text-sm font-medium text-slate-200 py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {activeCategory.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap units"
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700/80 transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Swap From and To"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To Result Box */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400">To</label>
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-indigo-300 truncate select-all">
                  {formattedResult}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy converted result"
                  className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy result"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <select
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full bg-slate-900 text-xs sm:text-sm font-medium text-slate-200 py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {activeCategory.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Formula details */}
        {formula && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
            <Info className="w-4 h-4 flex-shrink-0 text-indigo-400" />
            <span className="font-mono">{formula}</span>
          </div>
        )}
      </div>
    </div>
  );
};
