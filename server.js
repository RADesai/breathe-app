import { createRequestHandler } from '@remix-run/express';
import express, { Router } from 'express';
import serverless from 'serverless-http';

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? null
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const app = express();
app.use(
  viteDevServer ? viteDevServer.middlewares : express.static('build/client')
);

const router = Router();
app.use('*', router);

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
  : await import('./build/server/index.js');

// and your app is "just a request handler"
app.all('*', createRequestHandler({ build }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('App listening on http://localhost:3000');
});

export const handler = serverless(app);
