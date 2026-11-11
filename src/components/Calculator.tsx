import React, { useState, useEffect, useCallback } from 'react';
import { Display } from './Display';
import { Keypad } from './Keypad';
import {
  evaluateExpression,
  livePreviewExpression,
  AngleMode,
} from '../lib/math';
import { HistoryItem } from './History';

interface CalculatorProps {
  onAddHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  externalInput?: string | null;
  onClearExternalInput?: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  onAddHistory,
  externalInput,
  onClearExternalInput,
}) => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [ans, setAns] = useState<number>(0);
  const [memory, setMemory] = useState<number>(0);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // When external input is passed (e.g. from history click or AI Assistant), inject it
  useEffect(() => {
    if (externalInput !== undefined && externalInput !== null) {
      setExpression(externalInput);
      setResult(null);
      setError(null);
      setHasCalculated(false);
      if (onClearExternalInput) onClearExternalInput();
    }
  }, [externalInput, onClearExternalInput]);

  // Live preview
  const livePreview = React.useMemo(() => {
    if (hasCalculated || !expression.trim()) return null;
    return livePreviewExpression(expression, angleMode, ans);
  }, [expression, angleMode, ans, hasCalculated]);

  // Handle standard input append
  const handleInput = useCallback(
    (val: string) => {
      setError(null);

      // If user starts typing immediately after an answer was calculated:
      // If operator (+, -, *, /) -> continue with previous answer (ans)
      // If digit -> start fresh expression
      if (hasCalculated) {
        setHasCalculated(false);
        if ([' + ', ' − ', ' × ', ' ÷ ', ' mod ', '^('].includes(val)) {
          setExpression(`ans${val}`);
          setResult(null);
          return;
        } else {
          setExpression(val);
          setResult(null);
          return;
        }
      }

      setExpression((prev) => prev + val);
    },
    [hasCalculated]
  );

  const handleClear = useCallback(() => {
    setExpression('');
    setResult(null);
    setError(null);
    setHasCalculated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    setError(null);
    if (hasCalculated) {
      setResult(null);
      setHasCalculated(false);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '';
      // Check for multi-character tokens like "sin(", "cos(", "asin(", "mod ", " + "
      const tokens = [
        'sinh(',
        'cosh(',
        'tanh(',
        'asin(',
        'acos(',
        'atan(',
        'sqrt(',
        'cbrt(',
        'log(',
        'ln(',
        'sin(',
        'cos(',
        'tan(',
        'abs(',
        '10^(',
        'e^(',
        '^(3)',
        '^(2)',
        '^(-1)',
        '^(',
        ' mod ',
        ' + ',
        ' − ',
        ' × ',
        ' ÷ ',
        'ans',
      ];

      for (const t of tokens) {
        if (prev.endsWith(t)) {
          return prev.slice(0, -t.length);
        }
      }

      return prev.slice(0, -1);
    });
  }, [hasCalculated]);

  const handleCalculate = useCallback(() => {
    if (!expression.trim()) return;

    const evalResult = evaluateExpression(expression, angleMode, ans);

    if (evalResult.success && evalResult.formatted !== undefined) {
      setResult(evalResult.formatted);
      setError(null);
      setHasCalculated(true);

      if (evalResult.result !== undefined && Number.isFinite(evalResult.result)) {
        setAns(evalResult.result);
      }

      onAddHistory({
        expression,
        result: evalResult.formatted,
        angleMode,
      });
    } else {
      setError(evalResult.error || 'Syntax error');
    }
  }, [expression, angleMode, ans, onAddHistory]);

  const handleToggleSign = useCallback(() => {
    if (!expression) {
      setExpression('-');
      return;
    }
    // If expression ends with a number or parenthesis, toggle sign
    setExpression((prev) => {
      if (prev.startsWith('-(') && prev.endsWith(')')) {
        return prev.slice(2, -1);
      }
      return `-(${prev})`;
    });
  }, [expression]);

  const handleMemoryAction = useCallback(
    (action: 'MC' | 'MR' | 'M+' | 'M-') => {
      if (action === 'MC') {
        setMemory(0);
      } else if (action === 'MR') {
        if (memory !== 0) {
          handleInput(memory.toString());
        }
      } else if (action === 'M+' || action === 'M-') {
        // Evaluate current expression or use current result
        const currentVal = result ? parseFloat(result) : null;
        if (currentVal !== null && !Number.isNaN(currentVal)) {
          setMemory((m) => (action === 'M+' ? m + currentVal : m - currentVal));
        } else {
          const evalRes = evaluateExpression(expression, angleMode, ans);
          if (evalRes.success && typeof evalRes.result === 'number') {
            setMemory((m) => (action === 'M+' ? m + (evalRes.result as number) : m - (evalRes.result as number)));
          }
        }
      }
    },
    [memory, result, expression, angleMode, ans, handleInput]
  );

  const toggleAngleMode = useCallback(() => {
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing keyboard if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleInput(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleInput('.');
      } else if (e.key === '+' || e.key === '-') {
        e.preventDefault();
        handleInput(e.key === '+' ? ' + ' : ' − ');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        handleInput(' × ');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInput(' ÷ ');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleInput(e.key);
      } else if (e.key === '^') {
        e.preventDefault();
        handleInput('^(');
      } else if (e.key === '%') {
        e.preventDefault();
        handleInput(' mod ');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleInput('π');
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleInput('e');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleCalculate, handleBackspace, handleClear]);

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-xl mx-auto">
      {/* Calculator Display */}
      <Display
        expression={expression}
        result={result}
        livePreview={livePreview}
        error={error}
        angleMode={angleMode}
        onToggleAngleMode={toggleAngleMode}
        hasMemory={memory !== 0}
        onBackspace={handleBackspace}
        onClear={handleClear}
      />

      {/* Scientific Keypad */}
      <Keypad
        onInput={handleInput}
        onClear={handleClear}
        onBackspace={handleBackspace}
        onCalculate={handleCalculate}
        onToggleSign={handleToggleSign}
        onMemoryAction={handleMemoryAction}
        hasMemory={memory !== 0}
      />
    </div>
  );
};
