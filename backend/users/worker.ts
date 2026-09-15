/// <reference lib="webworker" />
import {not} from '@ryandur/sand';
import {createRandomUsers, Roster} from './core';
import {api, respond} from './respond';

declare const self: ServiceWorkerGlobalScope;

const shelf = 'users';

const keyOf = (client: string): string => `roster/${client}`;

const clientOf = (key: Request): string => new URL(key.url).pathname.split('/').pop() ?? '';

const kept = async (client: string, roster: Roster): Promise<Roster> => {
  const cache = await caches.open(shelf);
  await cache.put(keyOf(client), Response.json(roster));
  return roster;
};

const remembered = async (client: string): Promise<Roster> => {
  const cache = await caches.open(shelf);
  const held = await cache.match(keyOf(client));
  return held ? held.json() : kept(client, createRandomUsers());
};

const forgotten = async (): Promise<void> => {
  const cache = await caches.open(shelf);
  const standing = new Set((await self.clients.matchAll()).map(({id}) => id));
  const keys = await cache.keys();
  await Promise.all(keys.filter(key => not(standing.has(clientOf(key)))).map(key => cache.delete(key)));
};

const answered = async (request: Request, client: string): Promise<Response> => {
  const {response, roster} = await respond(request, await remembered(client));
  await kept(client, roster);
  return response;
};

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
  if (event.data === 'loaded uncontrolled') event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || not(url.pathname.startsWith(api))) return;
  event.respondWith(answered(event.request, event.clientId));
  event.waitUntil(forgotten());
});
