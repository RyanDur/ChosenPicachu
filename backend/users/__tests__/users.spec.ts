import {User} from '@components/Users/UserInfo/user';
import {maybe, not} from '@ryandur/sand';
import {createUser} from '../core';
import {api, respond} from '../respond';

const at = (path = ''): string => `http://localhost${api}${path}`;

const asked = (method: string, path = '', body?: unknown): Request =>
  new Request(at(path), {method, ...maybe(body).map(sent => ({body: JSON.stringify(sent)})).orElse({})});

const friendsOf = (roster: readonly User[], id: string): readonly string[] =>
  roster.find(user => user.id === id)?.friends ?? [];

describe('the users backend', () => {
  const a = createUser();
  const b = createUser(true);
  const c = createUser();
  const roster = [a, b, c];

  const {id: _id, ...someone}: User = createUser();

  describe('asked for the roster', () => {
    test('answers everyone it holds', async () => {
      const {response} = await respond(asked('GET'), roster);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(JSON.parse(JSON.stringify(roster)));
    });

    test('answers one person by their id', async () => {
      const {response} = await respond(asked('GET', `/${b.id}`), roster);

      expect(await response.json()).toEqual(JSON.parse(JSON.stringify(b)));
    });

    test('an id nobody has is not found', async () => {
      const {response} = await respond(asked('GET', '/nobody'), roster);

      expect(response.status).toBe(404);
    });
  });

  describe('given someone new', () => {
    test('answers created, with the roster it now keeps', async () => {
      const {response, roster: next} = await respond(asked('POST', '', someone), roster);

      expect(response.status).toBe(201);
      expect(await response.json()).toEqual(JSON.parse(JSON.stringify(next)));
    });

    test('keeps who they are, under an id nobody else holds', async () => {
      const {roster: next} = await respond(asked('POST', '', someone), roster);

      const joined = next.find(({id}) => not(roster.some(known => known.id === id)));
      expect(next).toHaveLength(roster.length + 1);
      expect(JSON.parse(JSON.stringify(joined))).toEqual({...JSON.parse(JSON.stringify(someone)), id: expect.any(String)});
    });
  });

  describe('given a person to save', () => {
    test('answers with no content', async () => {
      const {response} = await respond(asked('PUT', `/${a.id}`, {...a, friends: [b.id]}), roster);

      expect(response.status).toBe(204);
    });

    test('keeps a friendship on both sides', async () => {
      const {roster: next} = await respond(asked('PUT', `/${a.id}`, {...a, friends: [b.id]}), roster);

      expect(friendsOf(next, a.id)).toEqual([b.id]);
      expect(friendsOf(next, b.id)).toEqual([a.id]);
    });

    test('drops a friendship on both sides', async () => {
      const {roster: befriended} = await respond(asked('PUT', `/${a.id}`, {...a, friends: [b.id]}), roster);

      const {roster: next} = await respond(asked('PUT', `/${a.id}`, {...a, friends: []}), befriended);

      expect(friendsOf(next, a.id)).toEqual([]);
      expect(friendsOf(next, b.id)).toEqual([]);
    });

    test('never doubles a friendship when another one forms', async () => {
      const {roster: first} = await respond(asked('PUT', `/${a.id}`, {...a, friends: [b.id]}), roster);

      const {roster: next} = await respond(asked('PUT', `/${b.id}`, {...b, friends: [a.id, c.id]}), first);

      expect(friendsOf(next, a.id)).toEqual([b.id]);
      expect(friendsOf(next, b.id)).toEqual([a.id, c.id]);
      expect(friendsOf(next, c.id)).toEqual([b.id]);
    });

    test('leaves the friendships it did not touch alone', async () => {
      const {roster: first} = await respond(asked('PUT', `/${a.id}`, {...a, friends: [b.id]}), roster);
      const {roster: second} = await respond(asked('PUT', `/${b.id}`, {...b, friends: [a.id, c.id]}), first);

      const {roster: next} = await respond(asked('PUT', `/${a.id}`, {...a, friends: []}), second);

      expect(friendsOf(next, a.id)).toEqual([]);
      expect(friendsOf(next, b.id)).toEqual([c.id]);
      expect(friendsOf(next, c.id)).toEqual([b.id]);
    });
  });

  describe('told to remove a person', () => {
    test('answers with no content and holds everyone else', async () => {
      const {response, roster: next} = await respond(asked('DELETE', `/${b.id}`), roster);

      expect(response.status).toBe(204);
      expect(next.map(user => user.id)).toEqual([a.id, c.id]);
    });

    test('takes them off everyone else\'s friends', async () => {
      const {roster: befriended} = await respond(asked('PUT', `/${a.id}`, {...a, friends: [c.id]}), roster);

      const {roster: next} = await respond(asked('DELETE', `/${a.id}`), befriended);

      expect(friendsOf(next, c.id)).toEqual([]);
    });
  });
});
