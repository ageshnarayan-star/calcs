/**
 * Quadratic Equation Solver
 * ax^2 + bx + c = 0
 */
export interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  rootType: 'two-real' | 'one-real' | 'complex';
  roots: {
    x1: string;
    x2: string;
  };
  vertex: {
    h: number;
    k: number;
  };
  steps: string[];
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult | { error: string } {
  if (a === 0) {
    return { error: 'Coefficient "a" cannot be 0 in a quadratic equation (ax² + bx + c = 0).' };
  }

  const d = b * b - 4 * a * c;
  const h = -b / (2 * a);
  const k = c - (b * b) / (4 * a);

  const steps: string[] = [
    `Equation: ${a}x² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = 0`,
    `Identify coefficients: a = ${a}, b = ${b}, c = ${c}`,
    `Discriminant Δ = b² − 4ac = (${b})² − 4(${a})(${c}) = ${b * b} − ${4 * a * c} = ${d}`,
  ];

  if (d > 0) {
    const sqrtD = Math.sqrt(d);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    steps.push(`Since Δ > 0, there are two distinct real roots.`);
    steps.push(`x₁ = (−(${b}) + √${d}) / (2 · ${a}) = ${parseFloat(x1.toFixed(6))}`);
    steps.push(`x₂ = (−(${b}) − √${d}) / (2 · ${a}) = ${parseFloat(x2.toFixed(6))}`);
    steps.push(`Parabola vertex: (${parseFloat(h.toFixed(4))}, ${parseFloat(k.toFixed(4))}), opens ${a > 0 ? 'upwards (minimum)' : 'downwards (maximum)'}`);

    return {
      a,
      b,
      c,
      discriminant: d,
      rootType: 'two-real',
      roots: {
        x1: parseFloat(x1.toFixed(8)).toString(),
        x2: parseFloat(x2.toFixed(8)).toString(),
      },
      vertex: { h, k },
      steps,
    };
  } else if (d === 0) {
    const x = -b / (2 * a);
    steps.push(`Since Δ = 0, there is one real repeated root.`);
    steps.push(`x = −b / (2a) = −(${b}) / (2 · ${a}) = ${parseFloat(x.toFixed(6))}`);
    steps.push(`Parabola vertex: (${parseFloat(h.toFixed(4))}, ${parseFloat(k.toFixed(4))})`);

    return {
      a,
      b,
      c,
      discriminant: 0,
      rootType: 'one-real',
      roots: {
        x1: parseFloat(x.toFixed(8)).toString(),
        x2: parseFloat(x.toFixed(8)).toString(),
      },
      vertex: { h, k },
      steps,
    };
  } else {
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(Math.abs(d)) / (2 * Math.abs(a));
    const rFormatted = parseFloat(realPart.toFixed(6));
    const iFormatted = parseFloat(imagPart.toFixed(6));

    steps.push(`Since Δ < 0, there are two complex conjugate roots.`);
    steps.push(`x₁ = ${rFormatted} + ${iFormatted}i`);
    steps.push(`x₂ = ${rFormatted} − ${iFormatted}i`);
    steps.push(`Parabola vertex: (${parseFloat(h.toFixed(4))}, ${parseFloat(k.toFixed(4))})`);

    return {
      a,
      b,
      c,
      discriminant: d,
      rootType: 'complex',
      roots: {
        x1: `${rFormatted} + ${iFormatted}i`,
        x2: `${rFormatted} − ${iFormatted}i`,
      },
      vertex: { h, k },
      steps,
    };
  }
}

/**
 * Matrix operations (2x2 and 3x3)
 */
export interface MatrixAnalysis {
  determinant: number;
  isSingular: boolean;
  inverse?: number[][];
  transpose: number[][];
  trace: number;
}

export function analyzeMatrix(matrix: number[][]): MatrixAnalysis {
  const size = matrix.length;
  let det = 0;
  let trace = 0;

  for (let i = 0; i < size; i++) {
    trace += matrix[i][i] || 0;
  }

  // Transpose
  const transpose: number[][] = [];
  for (let c = 0; c < size; c++) {
    transpose[c] = [];
    for (let r = 0; r < size; r++) {
      transpose[c][r] = matrix[r][c];
    }
  }

  let inverse: number[][] | undefined;

  if (size === 2) {
    const [[a, b], [c, d]] = matrix;
    det = a * d - b * c;
    if (Math.abs(det) > 1e-12) {
      inverse = [
        [parseFloat((d / det).toFixed(6)), parseFloat((-b / det).toFixed(6))],
        [parseFloat((-c / det).toFixed(6)), parseFloat((a / det).toFixed(6))],
      ];
    }
  } else if (size === 3) {
    const [
      [a, b, c],
      [d, e, f],
      [g, h, i],
    ] = matrix;

    const A = e * i - f * h;
    const B = -(d * i - f * g);
    const C = d * h - e * g;

    det = a * A + b * B + c * C;

    if (Math.abs(det) > 1e-12) {
      // Adjugate matrix / det
      const D = -(b * i - c * h);
      const E = a * i - c * g;
      const F = -(a * h - b * g);

      const G = b * f - c * e;
      const H = -(a * f - c * d);
      const I = a * e - b * d;

      // Adjugate is transpose of cofactor matrix:
      inverse = [
        [parseFloat((A / det).toFixed(6)), parseFloat((D / det).toFixed(6)), parseFloat((G / det).toFixed(6))],
        [parseFloat((B / det).toFixed(6)), parseFloat((E / det).toFixed(6)), parseFloat((H / det).toFixed(6))],
        [parseFloat((C / det).toFixed(6)), parseFloat((F / det).toFixed(6)), parseFloat((I / det).toFixed(6))],
      ];
    }
  }

  return {
    determinant: parseFloat(det.toFixed(8)),
    isSingular: Math.abs(det) < 1e-12,
    inverse,
    transpose,
    trace: parseFloat(trace.toFixed(8)),
  };
}

/**
 * Base Converter
 */
export interface BaseConversions {
  bin: string;
  oct: string;
  dec: string;
  hex: string;
  bitLength: number;
}

export function convertBases(inputStr: string, fromBase: 2 | 8 | 10 | 16): BaseConversions | { error: string } {
  const clean = inputStr.trim();
  if (!clean) return { error: 'Please enter a number to convert.' };

  try {
    let bigNum: bigint;
    if (fromBase === 10) {
      bigNum = BigInt(clean);
    } else if (fromBase === 2) {
      if (!/^[01]+$/.test(clean)) throw new Error('Invalid binary digits (0 and 1 only)');
      bigNum = BigInt('0b' + clean);
    } else if (fromBase === 8) {
      if (!/^[0-7]+$/.test(clean)) throw new Error('Invalid octal digits (0 to 7)');
      bigNum = BigInt('0o' + clean);
    } else {
      if (!/^[0-9a-fA-F]+$/.test(clean)) throw new Error('Invalid hexadecimal digits (0-9, A-F)');
      bigNum = BigInt('0x' + clean);
    }

    const binRaw = bigNum.toString(2);
    // Group binary into 4-bit nibbles for readability
    const binPadded = binRaw.padStart(Math.ceil(binRaw.length / 4) * 4, '0');
    const binFormatted = binPadded.match(/.{1,4}/g)?.join(' ') || binRaw;

    return {
      bin: binFormatted,
      oct: bigNum.toString(8),
      dec: bigNum.toString(10),
      hex: bigNum.toString(16).toUpperCase(),
      bitLength: binRaw.length,
    };
  } catch (e: any) {
    return { error: e.message || 'Invalid number for chosen base' };
  }
}

/**
 * Statistics
 */
export interface StatisticsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  stdDevSample: number;
  stdDevPop: number;
  varianceSample: number;
  variancePop: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  sorted: number[];
}

export function calculateStatistics(numbers: number[]): StatisticsResult | { error: string } {
  if (!numbers || numbers.length === 0) {
    return { error: 'Please enter at least one number.' };
  }

  const n = numbers.length;
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / n;

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  for (const num of sorted) {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) maxFreq = frequency[num];
  }

  const mode: number[] = [];
  if (maxFreq > 1) {
    for (const key in frequency) {
      if (frequency[key] === maxFreq) {
        mode.push(Number(key));
      }
    }
  }

  // Variance & Standard Deviation
  const sumSqDiff = numbers.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
  const variancePop = sumSqDiff / n;
  const stdDevPop = Math.sqrt(variancePop);

  const varianceSample = n > 1 ? sumSqDiff / (n - 1) : 0;
  const stdDevSample = n > 1 ? Math.sqrt(varianceSample) : 0;

  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Quartiles
  const getMedianOfSubarray = (arr: number[]) => {
    const len = arr.length;
    if (len === 0) return 0;
    const m = Math.floor(len / 2);
    return len % 2 !== 0 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
  };

  const lowerHalf = sorted.slice(0, Math.floor(n / 2));
  const upperHalf = n % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1);
  const q1 = getMedianOfSubarray(lowerHalf);
  const q3 = getMedianOfSubarray(upperHalf);
  const iqr = q3 - q1;

  return {
    count: n,
    sum: parseFloat(sum.toFixed(8)),
    mean: parseFloat(mean.toFixed(8)),
    median: parseFloat(median.toFixed(8)),
    mode,
    stdDevSample: parseFloat(stdDevSample.toFixed(8)),
    stdDevPop: parseFloat(stdDevPop.toFixed(8)),
    varianceSample: parseFloat(varianceSample.toFixed(8)),
    variancePop: parseFloat(variancePop.toFixed(8)),
    min,
    max,
    range: parseFloat(range.toFixed(8)),
    q1: parseFloat(q1.toFixed(8)),
    q3: parseFloat(q3.toFixed(8)),
    iqr: parseFloat(iqr.toFixed(8)),
    sorted,
  };
}
