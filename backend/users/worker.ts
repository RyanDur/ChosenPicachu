/// <reference lib="webworker" />
import {maybe} from '@ryandur/sand';
import {NewUser, User} from '@components/Users/UserInfo/user';
import {added, befriended, createRandomUsers, found, Roster, without} from './core';

declare const self: ServiceWorkerGlobalScope;

const api = '/api/users';
const shelf = 'users';
const key = 'roster';

const kept = async (roster: Roster): Promise<Roster> => {
  const cache = await caches.open(shelf);
  await cache.put(key, Response.json(roster));
  return roster;
};

const redrawn = (): Promise<Roster> => kept(createRandomUsers());

const remembered = async (): Promise<Roster> => {
  const cache = await caches.open(shelf);
  const held = await cache.match(key);
  return held === undefined ? redrawn() : held.json();
};

const answer = async (request: Request, id: string): Promise<Response> => {
  const roster = await remembered();
  switch (request.method) {
    case 'GET':
      return id === ''
        ? Response.json(roster)
        : maybe(found(roster, id)).map(user => Response.json(user)).orElse(new Response(null, {status: 404}));
    case 'POST': {
      const user: NewUser = await request.json();
      return Response.json(await kept(added(roster, user)), {status: 201});
    }
    case 'PUT': {
      const user: User = await request.json();
      await kept(befriended(roster, user));
      return new Response(null, {status: 204});
    }
    case 'DELETE':
      await kept(without(roster, id));
      return new Response(null, {status: 204});
    default:
      return new Response(null, {status: 405});
  }
};

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate') {
    event.respondWith(redrawn().then(() => fetch(event.request)));
    return;
  }
  if (url.origin !== self.location.origin || !url.pathname.startsWith(api)) return;
  event.respondWith(answer(event.request, url.pathname.slice(api.length).replace(/^\//, '')));
});
