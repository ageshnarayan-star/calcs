import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Helper to safely render KaTeX
    const renderKaTeX = (tex: string, displayMode: boolean) => {
      try {
        return katex.renderToString(tex, {
          displayMode,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch {
        return `<span>${tex}</span>`;
      }
    };

    // First process block math $$ ... $$
    let formatted = content;

    // Replace $$ math $$
    formatted = formatted.replace(/\$\$([\s\S]*?)\$\$/g, (_match, tex) => {
      return `<div class="my-3 overflow-x-auto py-2 text-center text-indigo-400 font-medium">${renderKaTeX(tex.trim(), true)}</div>`;
    });

    // Replace \( ... \)
    formatted = formatted.replace(/\\\(([\s\S]*?)\\\)/g, (_match, tex) => {
      return `<span class="inline-block px-1 text-indigo-400 font-medium">${renderKaTeX(tex.trim(), false)}</span>`;
    });

    // Replace $ ... $ (inline math)
    formatted = formatted.replace(/\$([^$\n]+?)\$/g, (_match, tex) => {
      return `<span class="inline-block px-1 text-indigo-400 font-medium">${renderKaTeX(tex.trim(), false)}</span>`;
    });

    // Handle Markdown headings, bold, code blocks, lists
    const lines = formatted.split('\n');
    const htmlLines: string[] = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        htmlLines.push(inCodeBlock ? '<pre class="bg-slate-900/80 p-3 rounded-lg text-xs font-mono my-2 overflow-x-auto border border-slate-700/50">' : '</pre>');
        continue;
      }

      if (inCodeBlock) {
        htmlLines.push(line);
        continue;
      }

      // Check for Answer highlight
      if (line.trim().startsWith('Answer:')) {
        const answerText = line.trim().substring(7).trim();
        htmlLines.push(`
          <div class="my-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-400 dark:text-emerald-300 font-semibold text-base shadow-sm">
            <span class="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300">Answer</span>
            <div class="flex-1">${answerText}</div>
          </div>
        `);
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        htmlLines.push(`<h4 class="text-base font-bold text-slate-100 mt-4 mb-2">${line.slice(4)}</h4>`);
        continue;
      }
      if (line.startsWith('## ')) {
        htmlLines.push(`<h3 class="text-lg font-bold text-slate-100 mt-5 mb-2">${line.slice(3)}</h3>`);
        continue;
      }
      if (line.startsWith('# ')) {
        htmlLines.push(`<h2 class="text-xl font-extrabold text-slate-100 mt-6 mb-3">${line.slice(2)}</h2>`);
        continue;
      }

      // Unordered lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().substring(2);
        htmlLines.push(`<li class="ml-4 list-disc text-slate-300 my-1 leading-relaxed">${bulletText}</li>`);
        continue;
      }

      // Ordered lists (e.g. 1. Step)
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        htmlLines.push(`<div class="flex items-start gap-2.5 my-1.5"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold text-xs flex items-center justify-center">${numMatch[1]}</span><span class="text-slate-300 leading-relaxed">${numMatch[2]}</span></div>`);
        continue;
      }

      // Bold text **text**
      line = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>');

      // Inline code `code`
      line = line.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 text-xs font-mono rounded bg-slate-800 text-amber-300">$1</code>');

      if (line.trim() === '') {
        htmlLines.push('<div class="h-2"></div>');
      } else {
        htmlLines.push(`<p class="my-1.5 text-slate-300 leading-relaxed">${line}</p>`);
      }
    }

    containerRef.current.innerHTML = htmlLines.join('\n');
  }, [content]);

  return <div ref={containerRef} className={`math-renderer prose prose-invert max-w-none ${className}`} />;
};
