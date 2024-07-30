import * as http from 'http';
import {RequestListener} from 'http';

export interface MockWebServer {
  start: () => void;
  stop: () => void;
  path: (path?: string) => string,
  stubResponse: <T extends Record<string, unknown> | []>(newCode: number, newResponse?: T) => void;
  lastRequest: () => Promise<RecordedRequest>;
}

export type RecordedRequest = {
  method: string | undefined,
  url: string | undefined,
  body: string,
}

export const mockServer = (): MockWebServer => {
  let server: http.Server;
  let code: number;
  let body: string;
  let resolve: ((request: RecordedRequest) => void);
  const promise = new Promise<RecordedRequest>(r => {
    resolve = r;
  });

  const requestListener: RequestListener = (req, res) => {
    const lastRequest: RecordedRequest = {
      method: req.method,
      url: req.url,
      body: ''
    };

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(code);

    req.on('data', chunk => lastRequest.body += chunk);

    req.on('end', () => {
      res.end(body);
      resolve(lastRequest);
    });
  };

  return {
    start: () => {
      server = http.createServer(requestListener);
      server.listen(0);
    },
    stop: () => server.close(),
    path: (path) => {
      const address = server.address();
      return [`http://localhost:${address}`, path].filter(Boolean).join('/');
    },
    stubResponse: (newCode, newResponse) => {
      code = newCode;
      body = JSON.stringify(newResponse);
    },
    lastRequest: () => promise
  };
};

