/// <reference lib="webworker" />
import {createRandomUsers, Roster} from './core';
import {api, respond} from './respond';

declare const self: ServiceWorkerGlobalScope;

const shelf = 'users';
const key = 'roster';

const kept = async (roster: Roster): Promise<Roster> => {
  const cache = await caches.open(shelf);
  await cache.put(key, Response.json(roster));
  return roster;
};

const remembered = async (): Promise<Roster> => {
  const cache = await caches.open(shelf);
  const held = await cache.match(key);
  return held ? held.json() : kept(createRandomUsers());
};

const answered = async (request: Request): Promise<Response> => {
  const {response, roster} = await respond(request, await remembered());
  await kept(roster);
  return response;
};

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate') {
    event.respondWith(kept(createRandomUsers()).then(() => fetch(event.request)));
    return;
  }
  if (url.origin !== self.location.origin || !url.pathname.startsWith(api)) return;
  event.respondWith(answered(event.request));
});
