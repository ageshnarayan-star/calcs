import React, { useState, useEffect } from 'react';
import { Calculator } from './components/Calculator';
import { History, HistoryItem } from './components/History';
import { Graph } from './components/Graph';
import { Converter } from './components/Converter';
import { Tools } from './components/Tools';
import { AIAssistant } from './components/AIAssistant';
import { ThemeToggle } from './components/ThemeToggle';
import {
  Calculator as CalcIcon,
  LineChart,
  ArrowLeftRight,
  Sparkles,
  Wrench,
  History as HistoryIcon,
} from 'lucide-react';

type Tab = 'calculator' | 'graph' | 'converter' | 'tools' | 'ai';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('scicalc_history');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [externalCalcInput, setExternalCalcInput] = useState<string | null>(null);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [showMobileHistory, setShowMobileHistory] = useState<boolean>(false);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scicalc_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const handleAddHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };

    setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // keep last 50
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('scicalc_history');
    } catch {
      // ignore
    }
  };

  const handleSelectHistoryEntry = (item: HistoryItem) => {
    setExternalCalcInput(item.expression);
    setActiveTab('calculator');
    setShowMobileHistory(false);
  };

  const handleExplainHistoryEntry = (item: HistoryItem) => {
    setAiInitialPrompt(
      `Please explain the mathematical calculation and reasoning for:\n${item.expression} = ${item.result}\nProvide step-by-step concepts, formulas, and any practical context.`
    );
    setActiveTab('ai');
    setShowMobileHistory(false);
  };

  const handleSendToCalculator = (val: string) => {
    setExternalCalcInput(val);
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <CalcIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  SciCalc <span className="text-indigo-400">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Pro
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'calculator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CalcIcon className="w-3.5 h-3.5" />
              <span>Calculator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('graph')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'graph'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Graph</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('converter')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'converter'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Converter</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tools'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Tools</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-indigo-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Assistant</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile History toggle on calculator tab */}
            {activeTab === 'calculator' && (
              <button
                type="button"
                onClick={() => setShowMobileHistory(!showMobileHistory)}
                aria-label="Toggle calculation history"
                className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                title="History"
              >
                <HistoryIcon className="w-5 h-5 text-indigo-400" />
              </button>
            )}

            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 bg-slate-900/60 px-2 py-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === 'calculator' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <CalcIcon className="w-4 h-4" />
            <span>Calc</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('graph')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === 'graph' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Graph</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('converter')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === 'converter' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Convert</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === 'tools' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Tools</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === 'ai' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Tutor</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
        {/* TAB 1: CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            <div className="lg:col-span-8 flex justify-center">
              <Calculator
                onAddHistory={handleAddHistory}
                externalInput={externalCalcInput}
                onClearExternalInput={() => setExternalCalcInput(null)}
              />
            </div>

            {/* Desktop Side History Panel */}
            <div className="hidden lg:block lg:col-span-4 h-[590px]">
              <History
                history={history}
                onSelectEntry={handleSelectHistoryEntry}
                onExplainEntry={handleExplainHistoryEntry}
                onClearHistory={handleClearHistory}
              />
            </div>

            {/* Mobile History Drawer / Modal */}
            {showMobileHistory && (
              <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 flex flex-col justify-end">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-h-[80vh] flex flex-col p-4 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-sm text-slate-200">Calculation History</span>
                    <button
                      type="button"
                      onClick={() => setShowMobileHistory(false)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto mt-2">
                    <History
                      history={history}
                      onSelectEntry={handleSelectHistoryEntry}
                      onExplainEntry={handleExplainHistoryEntry}
                      onClearHistory={handleClearHistory}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GRAPH PLOTTER */}
        {activeTab === 'graph' && (
          <div className="w-full">
            <Graph />
          </div>
        )}

        {/* TAB 3: UNIT CONVERTER */}
        {activeTab === 'converter' && (
          <div className="w-full">
            <Converter />
          </div>
        )}

        {/* TAB 4: EXTRA MATH TOOLS */}
        {activeTab === 'tools' && (
          <div className="w-full">
            <Tools />
          </div>
        )}

        {/* TAB 5: AI MATH TUTOR */}
        {activeTab === 'ai' && (
          <div className="w-full">
            <AIAssistant
              initialPrompt={aiInitialPrompt}
              onSendToCalculator={handleSendToCalculator}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SciCalc AI • Production-ready Scientific Calculator & AI Tutor</span>
          <span>Keyboard enabled • Mathjs Engine • Gemini AI</span>
        </div>
      </footer>
    </div>
  );
}
