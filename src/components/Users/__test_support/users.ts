import {http, HttpResponse} from 'msw';
import {env} from '@env';
import {User} from '@components/Users/UserInfo/user';
import {server} from '@__test_support/server';

const {usersDomain} = env;

const noContent = () => new HttpResponse(null, {status: 204});

const rosterAnswers = (people: readonly User[]) => http.get(usersDomain, () => HttpResponse.json(people));

export const setupUsersResponse = (people: readonly User[]) =>
  server.use(rosterAnswers(people));

export const setupUserAddedResponse = (rosterAfter: readonly User[]): () => unknown => {
  let sent: unknown;
  server.use(http.post(usersDomain, async ({request}) => {
    sent = await request.json();
    return HttpResponse.json(rosterAfter, {status: 201});
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
