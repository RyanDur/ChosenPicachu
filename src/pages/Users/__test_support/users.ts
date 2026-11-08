import {http, HttpResponse, JsonBodyType} from 'msw';
import {environment} from '@transport';
import {User} from '../profile';
import {server} from '@__test_support/server';

const {usersDomain} = environment;

const noContent = () => new HttpResponse(null, {status: 204});
const troubled = () => HttpResponse.json({}, {status: 500});

const rosterAnswers = (people: readonly User[]) => http.get(usersDomain, () => HttpResponse.json(people));

export const setupUsersResponse = (people: readonly User[]) =>
  server.use(rosterAnswers(people));

export const setupUsersAnswering = (body: JsonBodyType) =>
  server.use(http.get(usersDomain, () => HttpResponse.json(body)));

export const usersUnreachable = () =>
  server.use(
    http.all(usersDomain, () => HttpResponse.error()),
    http.all(`${usersDomain}/*`, () => HttpResponse.error())
  );

export const userAddRefused = () => server.use(http.post(usersDomain, troubled));

export const userRemovalRefused = (id: string) => server.use(http.delete(`${usersDomain}/${id}`, troubled));

export const userUpdatePending = (id: string) =>
  server.use(http.put(`${usersDomain}/${id}`, () => new Promise<never>(() => undefined)));

export const userUpdateRefused = (id: string) => server.use(http.put(`${usersDomain}/${id}`, troubled));

export const setupUserAddedResponse = (rosterAfter: readonly User[]): () => unknown => {
  let sent: unknown;
  server.use(http.post(usersDomain, async ({request}) => {
    sent = await request.json();
    return HttpResponse.json(rosterAfter, {status: 201});
  }));
  return () => sent;
};

export const userAddsHeard = (): () => readonly unknown[] => {
  const sent: unknown[] = [];
  server.use(http.post(usersDomain, async ({request}) => {
    sent.push(await request.json());
    return HttpResponse.json([], {status: 201});
  }));
  return () => sent;
};

export const setupUserUpdatedResponse = (id: string, rosterAfter: readonly User[]): () => unknown => {
  let sent: unknown;
  server.use(http.put(`${usersDomain}/${id}`, async ({request}) => {
    sent = await request.json();
    server.use(rosterAnswers(rosterAfter));
    return noContent();
  }));
  return () => sent;
};

export const setupUserRemovedResponse = (id: string, rosterAfter: readonly User[]) =>
  server.use(http.delete(`${usersDomain}/${id}`, () => {
    server.use(rosterAnswers(rosterAfter));
    return noContent();
  }));
