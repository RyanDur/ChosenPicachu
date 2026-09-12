import {setupServer} from 'msw/node';
import {http, HttpResponse, ws} from 'msw';

export const FEED = 'wss://feed.test';
export const HISTORY = 'https://history.test';

export const feedLink = ws.link(`${FEED}/*`);

export const server = setupServer(
  feedLink.addEventListener('connection', () => undefined),
  http.all(`${HISTORY}/*`, () => HttpResponse.json([]))
);

export const anyRequestRespondsWith = (body: string, status = 200) =>
  server.use(http.all('*', () => new HttpResponse(body, {status})));

export const anyRequestFailsToConnect = () =>
  server.use(http.all('*', () => HttpResponse.error()));
