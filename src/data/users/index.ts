import {asyncFailure, asyncSuccess, maybe, Result} from '@ryandur/sand';
import {HTTPError} from '../types';
import {AddressInfo, User, UserInfo} from '../../components/UserInfo/types';
import {nanoid} from 'nanoid';
import {createRandomUsers} from '../../__tests__/util/dummyData.tsx';
import {AvatarGenerator} from 'random-avatar-generator';
import {faker} from '@faker-js/faker';
import {startOfDay} from 'date-fns';

export interface UsersAPI {
  getAll: () => Result.Async<User[], HTTPError>;
  get: (id: string) => Result.Async<User, HTTPError>;
  add: (user: User) => Result.Async<User[], HTTPError>;
  update: (user: User) => Result.Async<User[], HTTPError>;
  delete: (user: User) => Result.Async<User[], HTTPError>;
}

export const users = (randomUsers: User[] = createRandomUsers()): UsersAPI => ({
  getAll: () => asyncSuccess(randomUsers),
  get: id => maybe(randomUsers.find(user => user.id === id))
    .map(user => asyncSuccess<User, HTTPError>(user))
    .orElse(asyncFailure<User, HTTPError>(HTTPError.UNKNOWN)),
  add: user => {
    randomUsers = [{...user, id: nanoid()}, ...randomUsers];
    return asyncSuccess(randomUsers);
  },
  update: user => {
    const friends: User[] = [user, ...user.friends.map(friend => ({
      ...friend,
      friends: [...friend.friends, user]
    }))];

    randomUsers = randomUsers.map(randomUser => ({
      ...randomUser,
      friends: randomUser.friends.filter(friend => friend.id !== user.id)
    })).map(randomUser => maybe(
      friends.find(friend => friend.id === randomUser.id)
    ).orElse(randomUser));

    return asyncSuccess(randomUsers);
  },
  delete: user => {
    randomUsers = randomUsers.map(randomUser => ({
      ...randomUser,
      friends: randomUser.friends.filter(friend => friend.id !== user.id)
    })).filter(randomUser => randomUser.id !== user.id);
    return asyncSuccess(randomUsers);
  }
});

const generator = new AvatarGenerator();

export const createUserInfo = (): UserInfo => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  dob: startOfDay(faker.date.birthdate())
});

export const createAddress = (): AddressInfo => ({
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  streetAddress: faker.location.street(),
  streetAddressTwo: faker.location.secondaryAddress(),
  zip: faker.location.zipCode()
});

const createDetails = (num = 10) => faker.lorem.sentences(randomNumberFromRange(2, num));

export const createUser = (
  worksFromHome = false,
  address: () => AddressInfo = createAddress,
  info: () => UserInfo = createUserInfo
): User => {
  const homeAddress = address();
  return ({
    id: nanoid(),
    info: info(),
    friends: [],
    homeAddress,
    workAddress: worksFromHome ? homeAddress : address(),
    details: createDetails(),
    avatar: generator.generateRandomAvatar()
  });
};

export const randomNumberFromRange = (min: number, max = 6) => Math.floor(Math.random() * max) + min;
export const usersApi = users([
  ...Array(randomNumberFromRange(3, 15))].map(() => createUser(Math.random() > 0.5)
));
