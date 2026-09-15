import {http, HttpResponse, PathParams} from 'msw';
import {maybe} from '@ryandur/sand';
import {NewUser, User} from '@components/Users/UserInfo/user';
import {added, befriended, found, Roster, without} from './core';

export const usersHandlers = (domain: string, people: Roster) => {
  let roster = people;
  return [
    http.get(domain, () => HttpResponse.json(roster)),
    http.get(`${domain}/:id`, ({params}) =>
      maybe(found(roster, String(params.id)))
        .map(user => HttpResponse.json(user))
        .orElse(new HttpResponse(null, {status: 404}))),
    http.post<PathParams, NewUser>(domain, async ({request}) => {
      roster = added(roster, await request.json());
      return HttpResponse.json(roster, {status: 201});
    }),
    http.put<PathParams, User>(`${domain}/:id`, async ({request}) => {
      roster = befriended(roster, await request.json());
      return new HttpResponse(null, {status: 204});
    }),
    http.delete(`${domain}/:id`, ({params}) => {
      roster = without(roster, String(params.id));
      return new HttpResponse(null, {status: 204});
    })
  ];
};
