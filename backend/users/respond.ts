import {maybe} from '@ryandur/sand';
import {NewUser, User} from '@components/Users/UserInfo/user';
import {added, befriended, found, Roster, without} from './core';

export const api = '/api/users';

export type Answered = {
  readonly response: Response;
  readonly roster: Roster;
};

const idIn = (request: Request): string => new URL(request.url).pathname.slice(api.length).replace(/^\//, '');

const noContent = (): Response => new Response(null, {status: 204});

export const respond = async (request: Request, roster: Roster): Promise<Answered> => {
  const id = idIn(request);
  switch (request.method) {
    case 'GET':
      return {
        roster,
        response: id === ''
          ? Response.json(roster)
          : maybe(found(roster, id)).map(user => Response.json(user)).orElse(new Response(null, {status: 404}))
      };
    case 'POST': {
      const user: NewUser = await request.json();
      const next = added(roster, user);
      return {roster: next, response: Response.json(next, {status: 201})};
    }
    case 'PUT': {
      const user: User = await request.json();
      return {roster: befriended(roster, user), response: noContent()};
    }
    case 'DELETE':
      return {roster: without(roster, id), response: noContent()};
    default:
      return {roster, response: new Response(null, {status: 405})};
  }
};
