import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import aiHandler from './api/ai.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '1mb' }));

  // AI Math Assistant endpoint
  app.post('/api/ai', async (req, res) => {
    try {
      await aiHandler(req as any, res as any);
    } catch {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error occurred while processing request.' });
      }
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SciCalc AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
