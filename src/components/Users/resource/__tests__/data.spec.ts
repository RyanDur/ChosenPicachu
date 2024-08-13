import {users as allUsers} from '../../../../__tests__/util/dummyData';
import {User} from '../../../UserInfo/types';
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

    const usersSuccess = await api.add(user).value as Success<User[]>;
    expect(usersSuccess.orNull().length).toEqual(allUsers.length + 1);
    expect(usersSuccess.orNull()[0].id).not.toBeUndefined();


    const anotherUser = createUser();
    const moreUsers = await api.add(anotherUser).value as Success<User[]>;
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
    const api: UsersAPI = usersApi(allUsers);
    const [firstUser, secondUser, thirdUser] = allUsers;

    it('should add the user to friends list al well as the friend to the user', async () => {
      const [first, second] = (await api.update({...firstUser, friends: [secondUser]}).value).orNull() as User[];
      const firstUsersFriends = first.friends.find(f => f.id);
      expect(firstUsersFriends?.id).toEqual(second.id);

      const thirdUsersFriends = second.friends.find(f => f.id);
      expect(thirdUsersFriends?.id).toEqual(first.id);
    });

    it('should remove the user from the friends list when the user has removed them', async () => {
      const [first, second] = (await api.update({...firstUser, friends: [secondUser]})
        .mBind(() => api.update({...firstUser, friends: []})).value).orNull() as User[];

      const firstUsersFriends = first.friends.find(f => f.id);
      expect(firstUsersFriends?.id).not.toEqual(second.id);

      const thirdUsersFriends = second.friends.find(f => f.id);
      expect(thirdUsersFriends?.id).not.toEqual(first.id);
    });

    it('should not add a friend twice', async () => {
      const [first, second, third] = (await api.update({
        ...firstUser,
        friends: [secondUser, thirdUser]
      }).value).orNull() as User[];
      const firstUsersFriends = first.friends.map(f => f.id);
      expect(firstUsersFriends.length).toEqual(2);

      const secondUsersFriends = second.friends.map(f => f.id);
      expect(secondUsersFriends.length).toEqual(1);

      const thirdUsersFriends = third.friends.map(f => f.id);
      expect(thirdUsersFriends.length).toEqual(1);

      const [firstAgain, secondAgain, thirdAgain] = (await api.update({
        ...third,
        friends: [first, second]
      }).value).orNull() as User[];
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

      const [moreFirstAgain, moreSecondAgain, moreThirdAgain] = (await api.update({
        ...thirdAgain,
        friends: [firstAgain, secondAgain]
      }).value).orNull() as User[];

      const moreFirstUsersFriends = moreFirstAgain.friends.map(f => f.id);
      expect(moreFirstUsersFriends.length).toEqual(4);
      expect(moreFirstUsersFriends).toContain(moreSecondAgain.id);
      expect(moreFirstUsersFriends).toContain(moreThirdAgain.id);

      const moreSecondUsersFriends = moreSecondAgain.friends.map(f => f.id);
      expect(moreSecondUsersFriends.length).toEqual(3);
      expect(moreSecondUsersFriends).toContain(moreFirstAgain.id);
      expect(moreSecondUsersFriends).toContain(moreThirdAgain.id);

      const moreThirdUsersFriends = moreThirdAgain.friends.map(f => f.id);
      expect(moreThirdUsersFriends.length).toEqual(2);
      expect(moreThirdUsersFriends).toContain(moreFirstAgain.id);
      expect(moreThirdUsersFriends).toContain(moreSecondAgain.id);
    });
  });

  describe('deleting a user', () => {
    const api: UsersAPI = usersApi(allUsers);
    it('should remove the user', async () => {
      const secondUser = allUsers[1];

      const users = await api.delete(secondUser).value;
      expect(users).not.toContain(secondUser);
    });

    it('should remove the user from the other users friends list', async () => {
      const firstUser = allUsers[0];
      api.update({...firstUser, friends: [allUsers[allUsers.length - 1]]});
      const users = (await api.delete(firstUser).value).orNull() as User[];
      const lastUsersFriends = users[users.length - 1].friends.find(f => f.id);

      expect(lastUsersFriends?.id).not.toEqual(firstUser.id);
    });
  });
});
