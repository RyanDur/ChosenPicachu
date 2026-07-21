import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';

export const server = setupServer();

export const anyRequestRespondsWith = (body: string, status = 200) =>
  server.use(http.all('*', () => new HttpResponse(body, {status})));

export const anyRequestFailsToConnect = () =>
  server.use(http.all('*', () => HttpResponse.error()));
