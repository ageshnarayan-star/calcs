import React, { useState } from 'react';

interface KeypadProps {
  onInput: (value: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onCalculate: () => void;
  onToggleSign: () => void;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-') => void;
  hasMemory: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onInput,
  onClear,
  onBackspace,
  onCalculate,
  onToggleSign,
  onMemoryAction,
  hasMemory,
}) => {
  const [isSecond, setIsSecond] = useState(false);
  const [isHyp, setIsHyp] = useState(false);

  // Common button classes
  const baseBtn =
    'relative flex items-center justify-center font-medium rounded-xl select-none transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm sm:text-base py-3 sm:py-3.5';

  const numBtn = `${baseBtn} bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/60 hover:border-slate-600 font-semibold`;
  const opBtn = `${baseBtn} bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold`;
  const funcBtn = `${baseBtn} bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 border border-slate-700/40 text-xs sm:text-sm`;
  const memBtn = `${baseBtn} bg-slate-900/80 hover:bg-slate-800 text-amber-300/90 border border-amber-500/20 text-xs`;
  const equalsBtn = `${baseBtn} bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-lg sm:text-xl shadow-lg shadow-indigo-500/25 border-none`;
  const clearBtn = `${baseBtn} bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold`;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Top Memory & Mode Row */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onMemoryAction('MC')}
          aria-label="Memory Clear"
          disabled={!hasMemory}
          className={`${memBtn} ${!hasMemory ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          MC
        </button>
        <button
          type="button"
          onClick={() => onMemoryAction('MR')}
          aria-label="Memory Recall"
          disabled={!hasMemory}
          className={`${memBtn} ${!hasMemory ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          MR
        </button>
        <button
          type="button"
          onClick={() => onMemoryAction('M+')}
          aria-label="Memory Add"
          className={memBtn}
        >
          M+
        </button>
        <button
          type="button"
          onClick={() => onMemoryAction('M-')}
          aria-label="Memory Subtract"
          className={memBtn}
        >
          M−
        </button>
        <button
          type="button"
          onClick={() => setIsSecond(!isSecond)}
          aria-label="Toggle 2nd function mode"
          className={`${baseBtn} ${isSecond ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400 border border-amber-400/30'} text-xs`}
        >
          2nd
        </button>
        <button
          type="button"
          onClick={() => setIsHyp(!isHyp)}
          aria-label="Toggle hyperbolic function mode"
          className={`${baseBtn} ${isHyp ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800 text-purple-300 border border-purple-400/30'} text-xs`}
        >
          hyp
        </button>
      </div>

      {/* Scientific Functions Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1 Scientific */}
        <button
          type="button"
          onClick={() => {
            if (isHyp) onInput('sinh(');
            else if (isSecond) onInput('asin(');
            else onInput('sin(');
          }}
          aria-label={isHyp ? 'Hyperbolic sine' : isSecond ? 'Arc sine' : 'Sine'}
          className={funcBtn}
        >
          {isHyp ? 'sinh' : isSecond ? 'sin⁻¹' : 'sin'}
        </button>

        <button
          type="button"
          onClick={() => {
            if (isHyp) onInput('cosh(');
            else if (isSecond) onInput('acos(');
            else onInput('cos(');
          }}
          aria-label={isHyp ? 'Hyperbolic cosine' : isSecond ? 'Arc cosine' : 'Cosine'}
          className={funcBtn}
        >
          {isHyp ? 'cosh' : isSecond ? 'cos⁻¹' : 'cos'}
        </button>

        <button
          type="button"
          onClick={() => {
            if (isHyp) onInput('tanh(');
            else if (isSecond) onInput('atan(');
            else onInput('tan(');
          }}
          aria-label={isHyp ? 'Hyperbolic tangent' : isSecond ? 'Arc tangent' : 'Tangent'}
          className={funcBtn}
        >
          {isHyp ? 'tanh' : isSecond ? 'tan⁻¹' : 'tan'}
        </button>

        <button
          type="button"
          onClick={() => (isSecond ? onInput('10^(') : onInput('log('))}
          aria-label={isSecond ? '10 to the power of x' : 'Base 10 logarithm'}
          className={funcBtn}
        >
          {isSecond ? '10ˣ' : 'log'}
        </button>

        <button
          type="button"
          onClick={() => (isSecond ? onInput('e^(') : onInput('ln('))}
          aria-label={isSecond ? 'e to the power of x' : 'Natural logarithm'}
          className={funcBtn}
        >
          {isSecond ? 'eˣ' : 'ln'}
        </button>

        {/* Row 2 Scientific */}
        <button
          type="button"
          onClick={() => (isSecond ? onInput('^(3)') : onInput('^(2)'))}
          aria-label={isSecond ? 'Cube' : 'Square'}
          className={funcBtn}
        >
          {isSecond ? 'x³' : 'x²'}
        </button>

        <button
          type="button"
          onClick={() => onInput('^(')}
          aria-label="x to the power of y"
          className={funcBtn}
        >
          xʸ
        </button>

        <button
          type="button"
          onClick={() => (isSecond ? onInput('cbrt(') : onInput('sqrt('))}
          aria-label={isSecond ? 'Cube root' : 'Square root'}
          className={funcBtn}
        >
          {isSecond ? '∛' : '√'}
        </button>

        <button
          type="button"
          onClick={() => onInput('!')}
          aria-label="Factorial"
          className={funcBtn}
        >
          n!
        </button>

        <button
          type="button"
          onClick={() => onInput('^(-1)')}
          aria-label="Reciprocal 1/x"
          className={funcBtn}
        >
          1/x
        </button>

        {/* Row 3 Scientific */}
        <button
          type="button"
          onClick={() => onInput('abs(')}
          aria-label="Absolute value"
          className={funcBtn}
        >
          |x|
        </button>

        <button
          type="button"
          onClick={() => onInput(' mod ')}
          aria-label="Modulo"
          className={funcBtn}
        >
          mod
        </button>

        <button
          type="button"
          onClick={() => onInput('π')}
          aria-label="Pi constant"
          className={funcBtn}
        >
          π
        </button>

        <button
          type="button"
          onClick={() => onInput('e')}
          aria-label="Euler constant e"
          className={funcBtn}
        >
          e
        </button>

        <button
          type="button"
          onClick={() => onInput('ans')}
          aria-label="Previous answer"
          className={`${funcBtn} text-indigo-400 font-bold`}
        >
          ANS
        </button>
      </div>

      {/* Main Standard Keypad: Numbers & Operators */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-1">
        {/* Row 1 */}
        <button
          type="button"
          onClick={onClear}
          aria-label="All clear"
          className={clearBtn}
        >
          AC
        </button>
        <button
          type="button"
          onClick={() => onInput('(')}
          aria-label="Open parenthesis"
          className={funcBtn}
        >
          (
        </button>
        <button
          type="button"
          onClick={() => onInput(')')}
          aria-label="Close parenthesis"
          className={funcBtn}
        >
          )
        </button>
        <button
          type="button"
          onClick={() => onInput(' ÷ ')}
          aria-label="Divide"
          className={opBtn}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => onInput('7')}
          aria-label="Seven"
          className={numBtn}
        >
          7
        </button>
        <button
          type="button"
          onClick={() => onInput('8')}
          aria-label="Eight"
          className={numBtn}
        >
          8
        </button>
        <button
          type="button"
          onClick={() => onInput('9')}
          aria-label="Nine"
          className={numBtn}
        >
          9
        </button>
        <button
          type="button"
          onClick={() => onInput(' × ')}
          aria-label="Multiply"
          className={opBtn}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => onInput('4')}
          aria-label="Four"
          className={numBtn}
        >
          4
        </button>
        <button
          type="button"
          onClick={() => onInput('5')}
          aria-label="Five"
          className={numBtn}
        >
          5
        </button>
        <button
          type="button"
          onClick={() => onInput('6')}
          aria-label="Six"
          className={numBtn}
        >
          6
        </button>
        <button
          type="button"
          onClick={() => onInput(' − ')}
          aria-label="Subtract"
          className={opBtn}
        >
          −
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => onInput('1')}
          aria-label="One"
          className={numBtn}
        >
          1
        </button>
        <button
          type="button"
          onClick={() => onInput('2')}
          aria-label="Two"
          className={numBtn}
        >
          2
        </button>
        <button
          type="button"
          onClick={() => onInput('3')}
          aria-label="Three"
          className={numBtn}
        >
          3
        </button>
        <button
          type="button"
          onClick={() => onInput(' + ')}
          aria-label="Add"
          className={opBtn}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={onToggleSign}
          aria-label="Toggle sign"
          className={numBtn}
        >
          ±
        </button>
        <button
          type="button"
          onClick={() => onInput('0')}
          aria-label="Zero"
          className={numBtn}
        >
          0
        </button>
        <button
          type="button"
          onClick={() => onInput('.')}
          aria-label="Decimal point"
          className={numBtn}
        >
          .
        </button>
        <button
          type="button"
          onClick={onCalculate}
          aria-label="Equals"
          className={equalsBtn}
        >
          =
        </button>
      </div>
    </div>
  );
};
