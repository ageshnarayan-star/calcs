import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as math from 'mathjs';
import { ZoomIn, ZoomOut, RefreshCw, HelpCircle, Activity } from 'lucide-react';

const PRESETS = [
  { name: 'sin(x) * x', expr: 'sin(x) * x', xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
  { name: 'Damped Sine wave', expr: 'exp(-0.2 * x) * sin(3 * x)', xMin: 0, xMax: 15, yMin: -1.5, yMax: 1.5 },
  { name: 'Gaussian Bell curve', expr: 'exp(-x^2 / 2)', xMin: -4, xMax: 4, yMin: -0.2, yMax: 1.2 },
  { name: 'Cubic Polynomial', expr: 'x^3 - 3*x', xMin: -3, xMax: 3, yMin: -5, yMax: 5 },
  { name: 'Rational (1/x)', expr: '1 / x', xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
  { name: 'Abs(sin(x))', expr: 'abs(sin(x))', xMin: -6.28, xMax: 6.28, yMin: -0.5, yMax: 1.5 },
];

export const Graph: React.FC = () => {
  const [expr, setExpr] = useState('sin(x) * x');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Safe compiler for expression f(x)
  const compileFunction = useCallback((expression: string) => {
    try {
      const sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi');
      const compiled = math.compile(sanitized);
      // Test evaluation at x = 1
      compiled.evaluate({ x: 1, pi: Math.PI, e: Math.E });
      return compiled;
    } catch {
      return null;
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Coordinate transforms
    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const toMathX = (px: number) => xMin + (px / width) * (xMax - xMin);
    const toMathY = (py: number) => yMax - (py / height) * (yMax - yMin);

    // Compute sensible grid steps
    const getStep = (range: number) => {
      const rough = range / 8;
      const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
      const normalized = rough / magnitude;
      if (normalized < 1.5) return magnitude;
      if (normalized < 3.5) return 2 * magnitude;
      if (normalized < 7.5) return 5 * magnitude;
      return 10 * magnitude;
    };

    const xStep = getStep(xMax - xMin);
    const yStep = getStep(yMax - yMin);

    // Draw grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const firstX = Math.ceil(xMin / xStep) * xStep;
    for (let x = firstX; x <= xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      // Label
      if (Math.abs(x) > 1e-9) {
        ctx.fillText(parseFloat(x.toPrecision(4)).toString(), sx, toScreenY(0) + 4 > height - 16 ? height - 16 : toScreenY(0) + 4 < 4 ? 4 : toScreenY(0) + 4);
      }
    }

    const firstY = Math.ceil(yMin / yStep) * yStep;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = firstY; y <= yMax; y += yStep) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      if (Math.abs(y) > 1e-9) {
        ctx.fillText(parseFloat(y.toPrecision(4)).toString(), toScreenX(0) - 6 < 28 ? 28 : toScreenX(0) - 6 > width - 4 ? width - 4 : toScreenX(0) - 6, sy);
      }
    }

    // Draw main axes (X and Y = 0)
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#475569'; // slate-600

    // X Axis
    const axisY = toScreenY(0);
    if (axisY >= 0 && axisY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, axisY);
      ctx.lineTo(width, axisY);
      ctx.stroke();
    }

    // Y Axis
    const axisX = toScreenX(0);
    if (axisX >= 0 && axisX <= width) {
      ctx.beginPath();
      ctx.moveTo(axisX, 0);
      ctx.lineTo(axisX, height);
      ctx.stroke();
    }

    // Draw Curve
    const compiled = compileFunction(expr);
    if (!compiled) {
      setError('Invalid math expression syntax');
      return;
    }
    setError(null);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#818cf8'; // indigo-400
    ctx.beginPath();

    let isDrawing = false;
    const samples = width * 1.5; // High resolution sampling

    for (let i = 0; i <= samples; i++) {
      const px = (i / samples) * width;
      const mx = toMathX(px);

      try {
        const my = compiled.evaluate({ x: mx, pi: Math.PI, e: Math.E });

        if (typeof my === 'number' && !Number.isNaN(my) && Number.isFinite(my)) {
          const py = toScreenY(my);

          // Avoid connecting asymptotes (e.g. 1/x jumping from -inf to +inf)
          if (!isDrawing || Math.abs(py - toScreenY(0)) > height * 3) {
            ctx.moveTo(px, py);
            isDrawing = true;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          isDrawing = false;
        }
      } catch {
        isDrawing = false;
      }
    }
    ctx.stroke();

    // Draw crosshair on hover
    if (mousePos) {
      const mx = mousePos.x;
      const my = mousePos.y;
      const mathX = toMathX(mx);

      let curveY: number | null = null;
      try {
        const val = compiled.evaluate({ x: mathX, pi: Math.PI, e: Math.E });
        if (typeof val === 'number' && Number.isFinite(val)) {
          curveY = val;
        }
      } catch {
        // ignore
      }

      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#6366f1'; // indigo-500

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mx, 0);
      ctx.lineTo(mx, height);
      ctx.stroke();

      if (curveY !== null) {
        const curveScreenY = toScreenY(curveY);
        // Horizontal line through curve point
        ctx.beginPath();
        ctx.moveTo(0, curveScreenY);
        ctx.lineTo(width, curveScreenY);
        ctx.stroke();

        // Highlight point on curve
        ctx.setLineDash([]);
        ctx.fillStyle = '#38bdf8'; // sky-400
        ctx.beginPath();
        ctx.arc(mx, curveScreenY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }
  }, [xMin, xMax, yMin, yMax, expr, mousePos, compileFunction]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Pan and Zoom handlers
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.85 : 1.15;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const mathMouseX = xMin + (mouseX / canvas.width) * (xMax - xMin);
    const mathMouseY = yMax - (mouseY / canvas.height) * (yMax - yMin);

    const newXSpan = (xMax - xMin) * zoomFactor;
    const newYSpan = (yMax - yMin) * zoomFactor;

    const xRatio = mouseX / canvas.width;
    const yRatio = 1 - mouseY / canvas.height;

    setXMin(mathMouseX - newXSpan * xRatio);
    setXMax(mathMouseX + newXSpan * (1 - xRatio));
    setYMin(mathMouseY - newYSpan * yRatio);
    setYMax(mathMouseY + newYSpan * (1 - yRatio));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePos({ x: mouseX, y: mouseY });

    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    const xSpan = xMax - xMin;
    const ySpan = yMax - yMin;

    const deltaMathX = (dx / canvas.width) * xSpan;
    const deltaMathY = (dy / canvas.height) * ySpan;

    setXMin((prev) => prev - deltaMathX);
    setXMax((prev) => prev - deltaMathX);
    setYMin((prev) => prev + deltaMathY);
    setYMax((prev) => prev + deltaMathY);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setMousePos(null);
  };

  const zoom = (factor: number) => {
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    const newXSpan = (xMax - xMin) * factor;
    const newYSpan = (yMax - yMin) * factor;

    setXMin(xCenter - newXSpan / 2);
    setXMax(xCenter + newXSpan / 2);
    setYMin(yCenter - newYSpan / 2);
    setYMax(yCenter + newYSpan / 2);
  };

  const resetView = () => {
    setXMin(-10);
    setXMax(10);
    setYMin(-10);
    setYMax(10);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setExpr(preset.expr);
    setXMin(preset.xMin);
    setXMax(preset.xMax);
    setYMin(preset.yMin);
    setYMax(preset.yMax);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-indigo-400 font-bold">
              f(x) =
            </span>
            <input
              type="text"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="e.g. sin(x) * x"
              aria-label="Mathematical function f(x)"
              className="w-full pl-16 pr-4 py-2.5 rounded-xl bg-slate-800 text-slate-100 font-mono text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 whitespace-nowrap transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-xs text-rose-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* View Range inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-1.5 rounded-lg border border-slate-700/40">
            <span className="text-slate-400">xMin:</span>
            <input
              type="number"
              value={parseFloat(xMin.toFixed(2))}
              onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
              className="w-full bg-transparent text-slate-200 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-1.5 rounded-lg border border-slate-700/40">
            <span className="text-slate-400">xMax:</span>
            <input
              type="number"
              value={parseFloat(xMax.toFixed(2))}
              onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
              className="w-full bg-transparent text-slate-200 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-1.5 rounded-lg border border-slate-700/40">
            <span className="text-slate-400">yMin:</span>
            <input
              type="number"
              value={parseFloat(yMin.toFixed(2))}
              onChange={(e) => setYMin(parseFloat(e.target.value) || -10)}
              className="w-full bg-transparent text-slate-200 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-1.5 rounded-lg border border-slate-700/40">
            <span className="text-slate-400">yMax:</span>
            <input
              type="number"
              value={parseFloat(yMax.toFixed(2))}
              onChange={(e) => setYMax(parseFloat(e.target.value) || 10)}
              className="w-full bg-transparent text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 w-full min-h-[350px] sm:min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair touch-none select-none block"
        />

        {/* Floating Zoom & Controls Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-lg">
          <button
            type="button"
            onClick={() => zoom(0.8)}
            aria-label="Zoom in"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => zoom(1.25)}
            aria-label="Zoom out"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset view to default"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Reset view"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Live Coordinate Badge */}
        {mousePos && canvasRef.current && (
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-mono text-indigo-300 shadow-lg flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              x: {(xMin + (mousePos.x / canvasRef.current.width) * (xMax - xMin)).toFixed(3)}, y:{' '}
              {(yMax - (mousePos.y / canvasRef.current.height) * (yMax - yMin)).toFixed(3)}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
          Scroll to zoom • Drag to pan
        </div>
      </div>
    </div>
  );
};
