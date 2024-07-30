import {users, UsersAPI} from '../index';
import {createRandomUsers, createUser, users as allUsers} from '../../../__tests__/util';
import {User} from '../../../components/UserInfo/types';
import {Result, Success} from '@ryandur/sand';
import {Explanation, HTTPError} from '../../types';
import {Mock} from 'vitest';
import {faker} from '@faker-js/faker';

vi.mock('../../../__tests__/util', async () => ({
  ...(await vi.importActual('../../../__tests__/util')),
  createRandomUsers: vi.fn()
}));

describe('users data', () => {
  let usersApi: UsersAPI;
  beforeEach(() => {
    (createRandomUsers as Mock)
      .mockReturnValueOnce(allUsers)
      .mockReturnValue([]);
    usersApi = users(allUsers);
  });

  test('getting the users', async () => {
    const data = await usersApi.getAll().identity;
    expect(data.identity).toEqual(allUsers);
    expect(data).not.toBeUndefined();
  });

  test('adding a user', async () => {
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

    const users = await usersApi.add(user).identity as Success<User[]>;
    expect(users.identity.length).toEqual(allUsers.length + 1);
    expect(users.identity[0].id).not.toBeUndefined();


    const anotherUser = createUser();
    const moreUsers = await usersApi.add(anotherUser).identity as Success<User[]>;
    expect(moreUsers.identity.length).toEqual(allUsers.length + 2);
  });

  test('getting a user', async () => {
    const firstUser = allUsers[0];
    const lastUser = allUsers[allUsers.length - 1];

    const user = await usersApi.get(firstUser.id || '').identity;
    expect(user.identity).toEqual(firstUser);

    const nextUser = await usersApi.get(lastUser.id || '').identity;
    expect(nextUser.identity).toEqual(lastUser);
  });

  describe('updating a user and friends', () => {
    let users: Result<User[], Explanation<HTTPError>>;
    const [firstUser, secondUser, thirdUser] = allUsers;

    beforeEach(async () => {
      users = await usersApi.update({...firstUser, friends: [secondUser]}).identity;
    });

    it('should add the user to friends list al well as the friend to the user', async () => {
      const [first, second] = users.identity as User[];
      const firstUsersFriends = first.friends.map(f => f.id);
      expect(firstUsersFriends).toContain(second.id);

      const thirdUsersFriends = second.friends.map(f => f.id);
      expect(thirdUsersFriends).toContain(first.id);
    });

    it('should remove the user from the friends list when the user has removed them', async () => {
      const [first, second] = (await usersApi.update({...firstUser, friends: [secondUser]})
        .mBind(() => usersApi.update({...firstUser, friends: []})).identity).identity as User[];

      const firstUsersFriends = first.friends.map(f => f.id);
      expect(firstUsersFriends).not.toContain(second.id);

      const thirdUsersFriends = second.friends.map(f => f.id);
      expect(thirdUsersFriends).not.toContain(first.id);
    });

    it('should not add a friend twice', async () => {
      const [first, second, third] = (await usersApi.update({
        ...firstUser,
        friends: [secondUser, thirdUser]
      }).identity).identity as User[];
      const firstUsersFriends = first.friends.map(f => f.id);
      expect(firstUsersFriends.length).toEqual(2);

      const secondUsersFriends = second.friends.map(f => f.id);
      expect(secondUsersFriends.length).toEqual(1);

      const thirdUsersFriends = third.friends.map(f => f.id);
      expect(thirdUsersFriends.length).toEqual(1);

      const [firstAgain, secondAgain, thirdAgain] = (await usersApi.update({
        ...third,
        friends: [first, second]
      }).identity).identity as User[];
      const firstAgainUsersFriends = firstAgain.friends.map(f => f.id);
      expect(firstAgainUsersFriends.length).toEqual(3);
      expect(firstAgainUsersFriends).toContain(secondAgain.id);
      expect(firstAgainUsersFriends).toContain(thirdAgain.id);

      const secondAgainUsersFriends = secondAgain.friends.map(f => f.id);
      expect(secondAgainUsersFriends.length).toEqual(2);
      expect(secondAgainUsersFriends).toContain(firstAgain.id);
      expect(secondAgainUsersFriends).toContain(thirdAgain.id);

      const thirdAgainUsersFriends = thirdAgain.friends.map(f => f.id);
      expect(thirdAgainUsersFriends.length).toEqual(2);
      expect(thirdAgainUsersFriends).toContain(firstAgain.id);
      expect(thirdAgainUsersFriends).toContain(secondAgain.id);

      const [moreFirstAgain, moreSecondAgain, moreThirdAgain] = (await usersApi.update({
        ...thirdAgain,
        friends: [firstAgain, secondAgain]
      }).identity).identity as User[];

      const moreFirstUsersFriends = moreFirstAgain.friends.map(f => f.id);
      expect(moreFirstUsersFriends.length).toEqual(4);
      expect(moreFirstUsersFriends).toContain(moreSecondAgain.id);
      expect(moreFirstUsersFriends).toContain(moreThirdAgain.id);

      const moreSecondUsersFriends = moreSecondAgain.friends.map(f => f.id);
      expect(moreSecondUsersFriends.length).toEqual(3);
      expect(moreSecondUsersFriends).toContain(moreFirstAgain.id);
      expect(moreSecondUsersFriends).toContain(moreThirdAgain.id);

      const morethirdUsersFriends = moreThirdAgain.friends.map(f => f.id);
      expect(morethirdUsersFriends.length).toEqual(2);
      expect(morethirdUsersFriends).toContain(moreFirstAgain.id);
      expect(morethirdUsersFriends).toContain(moreSecondAgain.id);
    });
  });

  describe('deleting a user', () => {
    it('should remove the user', async () => {
      const secondUser = allUsers[1];

      const users = await usersApi.delete(secondUser).identity;
      expect(users).not.toContain(secondUser);
    });

    it('should remove the user from the other users friends list', async () => {
      const firstUser = allUsers[0];
      usersApi.update({...firstUser, friends: [allUsers[allUsers.length - 1]]});
      const users = (await usersApi.delete(firstUser).identity).identity as User[];
      const lastUsersFriends = users[users.length - 1].friends.map(f => f.id);

      expect(lastUsersFriends).not.toContain(firstUser.id);
    });
  });
});
