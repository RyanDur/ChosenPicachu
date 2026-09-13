import {setupServer} from 'msw/node';
import {http, HttpResponse, ws} from 'msw';
import {env} from '@env';

export const FEED = 'wss://feed.test';
export const HISTORY = 'https://history.test';

export const feedLink = ws.link(`${FEED}/*`);

export const server = setupServer(
  feedLink.addEventListener('connection', () => undefined),
  http.all(`${HISTORY}/*`, () => HttpResponse.json([])),
  http.get(`${env.aicDomain}/search`, () => HttpResponse.error()),
  http.get(env.harvardDomain, () => HttpResponse.error()),
  http.get(`${env.vamDomain}/objects/search`, () => HttpResponse.error()),
  http.get(`${env.clevelandDomain}/`, () => HttpResponse.error()),
  http.get(`${env.aicPictures}/:image/info.json`, () => HttpResponse.json({})),
  http.get(`${env.vamPictures}/:image/info.json`, () => HttpResponse.json({}))
);

export const anyRequestRespondsWith = (body: string, status = 200) =>
  server.use(http.all('*', () => new HttpResponse(body, {status})));

export const anyRequestFailsToConnect = () =>
  server.use(http.all('*', () => HttpResponse.error()));
