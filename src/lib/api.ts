export interface SolveMathRequest {
  prompt: string;
  expression?: string;
  context?: string;
}

export interface SolveMathResponse {
  ok: boolean;
  solution?: string;
  model?: string;
  error?: string;
}

/**
 * Client-side caller for the backend /api/ai serverless endpoint
 * Note: Never makes direct external API calls; always proxies through our secure backend.
 */
export async function solveWithAI(data: SolveMathRequest): Promise<SolveMathResponse> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = json?.error || `Request failed with status ${res.status}`;
      return {
        ok: false,
        error: errorMsg,
      };
    }

    return {
      ok: true,
      solution: json.solution,
      model: json.model,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: 'Network connection issue or server unavailable. Please try again.',
    };
  }
}
