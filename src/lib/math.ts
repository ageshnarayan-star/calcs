import * as math from 'mathjs';

export type AngleMode = 'DEG' | 'RAD';

// Create a custom mathjs instance
const mathInstance = math.create(math.all);

/**
 * Normalizes user-facing display expressions into mathjs parseable expressions
 */
export function sanitizeExpression(expr: string, angleMode: AngleMode): string {
  let clean = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√\(/g, 'sqrt(')
    .replace(/∛\(/g, 'cbrt(')
    .replace(/mod/g, '%');

  // Handle implicit multiplication like 2pi -> 2*pi or 3(4) -> 3*(4)
  clean = clean.replace(/(\d)(\()/g, '$1*$2');
  clean = clean.replace(/(\))(\d)/g, '$1*$2');
  clean = clean.replace(/(\))(\()/g, '$1*$2');
  clean = clean.replace(/(\d)(pi|e)/g, '$1*$2');

  return clean;
}

/**
 * Creates custom scope with angle-mode aware trigonometric functions
 */
function createScope(angleMode: AngleMode, ans: number) {
  const isDeg = angleMode === 'DEG';
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  return {
    ans,
    pi: Math.PI,
    e: Math.E,
    sin: (x: number) => Math.sin(isDeg ? toRad(x) : x),
    cos: (x: number) => {
      // Fix cos(90 deg) floating point drift
      if (isDeg && Math.abs(x % 180) === 90) return 0;
      return Math.cos(isDeg ? toRad(x) : x);
    },
    tan: (x: number) => {
      if (isDeg && Math.abs(x % 180) === 90) throw new Error('Math error: tan is undefined at 90°');
      return Math.tan(isDeg ? toRad(x) : x);
    },
    asin: (x: number) => {
      if (x < -1 || x > 1) throw new Error('Math error: domain of asin is [-1, 1]');
      const rad = Math.asin(x);
      return isDeg ? toDeg(rad) : rad;
    },
    acos: (x: number) => {
      if (x < -1 || x > 1) throw new Error('Math error: domain of acos is [-1, 1]');
      const rad = Math.acos(x);
      return isDeg ? toDeg(rad) : rad;
    },
    atan: (x: number) => {
      const rad = Math.atan(x);
      return isDeg ? toDeg(rad) : rad;
    },
    sinh: (x: number) => Math.sinh(x),
    cosh: (x: number) => Math.cosh(x),
    tanh: (x: number) => Math.tanh(x),
    sqrt: (x: number) => {
      if (x < 0) throw new Error('Math error: square root of negative number');
      return Math.sqrt(x);
    },
    cbrt: (x: number) => Math.cbrt(x),
    log: (x: number) => {
      if (x <= 0) throw new Error('Math error: log requires positive number');
      return Math.log10(x);
    },
    ln: (x: number) => {
      if (x <= 0) throw new Error('Math error: ln requires positive number');
      return Math.log(x);
    },
    abs: (x: number) => Math.abs(x),
  };
}

/**
 * Format calculation result cleanly without unnecessary trailing decimals or floating precision issues
 */
export function formatResult(value: any): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'boolean') return value ? 'True' : 'False';

  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'Math error';
    if (!Number.isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';

    // Check if integer
    if (Number.isInteger(value)) {
      if (Math.abs(value) >= 1e15) {
        return value.toExponential(6);
      }
      return value.toString();
    }

    // Round small floating-point errors (e.g. 0.1 + 0.2)
    const rounded = parseFloat(value.toPrecision(12));

    // For very large or very small numbers, use scientific notation
    if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) < 1e-9 && Math.abs(rounded) > 0)) {
      return rounded.toExponential(6);
    }

    // Format with up to 10 decimal places, stripping unnecessary trailing zeros
    const str = rounded.toString();
    return str;
  }

  if (typeof value === 'string') return value;

  try {
    return mathInstance.format(value, { precision: 12 });
  } catch {
    return String(value);
  }
}

/**
 * Safely evaluates expression
 */
export function evaluateExpression(
  expression: string,
  angleMode: AngleMode = 'DEG',
  ans = 0
): { success: boolean; result?: number; formatted?: string; error?: string } {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { success: false, error: 'Empty expression' };
  }

  try {
    const sanitized = sanitizeExpression(trimmed, angleMode);
    const scope = createScope(angleMode, ans);
    const compiled = mathInstance.compile(sanitized);
    const evaluated = compiled.evaluate(scope);

    if (typeof evaluated === 'function') {
      return { success: false, error: 'Incomplete expression' };
    }

    if (typeof evaluated === 'number') {
      if (Number.isNaN(evaluated)) {
        return { success: false, error: 'Math error' };
      }
      if (!Number.isFinite(evaluated)) {
        return { success: false, error: evaluated > 0 ? 'Overflow: Infinity' : 'Underflow: -Infinity' };
      }
      return {
        success: true,
        result: evaluated,
        formatted: formatResult(evaluated),
      };
    }

    // Other types
    const formatted = formatResult(evaluated);
    return {
      success: true,
      formatted,
    };
  } catch (err: any) {
    let msg = 'Syntax error';
    if (err && typeof err.message === 'string') {
      if (err.message.includes('Math error')) {
        msg = err.message;
      } else if (err.message.includes('Unexpected end of expression') || err.message.includes('Parenthesis')) {
        msg = 'Syntax error: unmatched parenthesis';
      } else if (err.message.includes('Undefined symbol')) {
        msg = 'Syntax error: invalid symbol';
      }
    }
    return { success: false, error: msg };
  }
}

/**
 * Live preview evaluator that doesn't trigger alerts for half-typed expressions
 */
export function livePreviewExpression(
  expression: string,
  angleMode: AngleMode = 'DEG',
  ans = 0
): string | null {
  const trimmed = expression.trim();
  if (!trimmed || trimmed.endsWith('+') || trimmed.endsWith('−') || trimmed.endsWith('×') || trimmed.endsWith('÷') || trimmed.endsWith('(') || trimmed.endsWith('^')) {
    return null;
  }

  try {
    // If expression ends with an opening parenthesis, try auto-closing it for preview
    let testExpr = trimmed;
    const openCount = (testExpr.match(/\(/g) || []).length;
    const closeCount = (testExpr.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      testExpr += ')'.repeat(openCount - closeCount);
    }

    const res = evaluateExpression(testExpr, angleMode, ans);
    if (res.success && res.formatted && res.formatted !== trimmed) {
      return res.formatted;
    }
    return null;
  } catch {
    return null;
  }
}
