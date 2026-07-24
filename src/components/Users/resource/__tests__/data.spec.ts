import {users as allUsers} from '@test-support/fixtures';
import {User} from '@components/Users/UserInfo/types';
import {Success} from '@ryandur/sand';
import {faker} from '@faker-js/faker';
import {createUser, usersApi, UsersAPI} from '../usersApi';

describe('users data', () => {
  test('getting the users', async () => {
    const api: UsersAPI = usersApi(allUsers);
    const data = await api.getAll().value;

    expect(data.orNull()).toEqual(allUsers);
  });

  test('adding a user', async () => {
    const api: UsersAPI = usersApi(allUsers);
    const user: User = {
      info: {
        firstName: faker.lorem.word(),
        lastName: faker.lorem.word(),
        email: faker.internet.email()
      },
      avatar: faker.image.avatar(),
      friends: [],
      homeAddress: {
        streetAddress: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode()
      }
    };

    const usersSuccess = await api.add(user).value as Success<User[], never>;
    expect(usersSuccess.orNull().length).toEqual(allUsers.length + 1);
    expect(usersSuccess.orNull()[0].id).not.toBeUndefined();


    const anotherUser = createUser();
    const moreUsers = await api.add(anotherUser).value as Success<User[], never>;
    expect(moreUsers.orNull().length).toEqual(allUsers.length + 2);
  });

  test('getting a user', async () => {
    const api: UsersAPI = usersApi(allUsers);
    const firstUser = allUsers[0];
    const lastUser = allUsers[allUsers.length - 1];

    const user = await api.get(firstUser.id || '').value;
    expect(user.orNull()).toEqual(firstUser);

    const nextUser = await api.get(lastUser.id || '').value;
    expect(nextUser.orNull()).toEqual(lastUser);
  });

  describe('updating a user and friends', () => {
    const freshTrio = (): [UsersAPI, User, User, User] => {
      const [a, b, c] = [createUser(), createUser(), createUser()];
      return [usersApi([a, b, c]), a, b, c];
    };
    const friendsOf = (users: User[], id?: string): string[] =>
      users.find(user => user.id === id)?.friends ?? [];

    it('adds the friendship on both sides', async () => {
      const [api, a, b] = freshTrio();

      const users = (await api.update({...a, friends: [b.id!]}).value).orNull()!;

      expect(friendsOf(users, a.id)).toEqual([b.id]);
      expect(friendsOf(users, b.id)).toEqual([a.id]);
    });

    it('removes the friendship on both sides', async () => {
      const [api, a, b] = freshTrio();

      const users = (await api.update({...a, friends: [b.id!]})
        .mBind(() => api.update({...a, friends: []})).value).orNull()!;

      expect(friendsOf(users, a.id)).toEqual([]);
      expect(friendsOf(users, b.id)).toEqual([]);
    });

    it('never duplicates an existing friendship when another one forms', async () => {
      const [api, a, b, c] = freshTrio();

      const users = (await api.update({...a, friends: [b.id!]})
        .mBind(latest => api.update({
          ...latest.find(user => user.id === b.id)!,
          friends: [...friendsOf(latest, b.id), c.id!]
        })).value).orNull()!;

      expect(friendsOf(users, a.id)).toEqual([b.id]);
      expect(friendsOf(users, b.id)).toEqual([a.id, c.id]);
      expect(friendsOf(users, c.id)).toEqual([b.id]);
    });

    it('leaves friendships the update did not touch intact', async () => {
      const [api, a, b, c] = freshTrio();

      const users = (await api.update({...a, friends: [b.id!]})
        .mBind(latest => api.update({
          ...latest.find(user => user.id === b.id)!,
          friends: [...friendsOf(latest, b.id), c.id!]
        }))
        .mBind(latest => api.update({
          ...latest.find(user => user.id === a.id)!,
          friends: []
        })).value).orNull()!;

      expect(friendsOf(users, a.id)).toEqual([]);
      expect(friendsOf(users, b.id)).toEqual([c.id]);
      expect(friendsOf(users, c.id)).toEqual([b.id]);
    });

    it('refuses a user with no identity', async () => {
      const [api, , b] = freshTrio();

      const result = await api.update({...createUser(), id: undefined, friends: [b.id!]}).value;

      expect(result.isSuccess).toBe(false);
    });
  });

  describe('deleting a user', () => {
    it('removes the user', async () => {
      const [a, b, c] = [createUser(), createUser(), createUser()];
      const api = usersApi([a, b, c]);

      const users = (await api.delete(b).value).orNull()!;

      expect(users.map(user => user.id)).toEqual([a.id, c.id]);
    });

    it('removes the user from the other users friends lists', async () => {
      const [a, b, c] = [createUser(), createUser(), createUser()];
      const api = usersApi([a, b, c]);

      const users = (await api.update({...a, friends: [c.id!]})
        .mBind(() => api.delete(a)).value).orNull()!;

      expect(users.find(user => user.id === c.id)?.friends).toEqual([]);
      expect(users.map(user => user.id)).toEqual([b.id, c.id]);
    });
  });
});
