import {AddressInfo, NewUser, User, UserInfo} from '@components/Users/UserInfo/types';
import {asyncFailure, asyncSuccess, maybe, Result} from '@ryandur/sand';
import {HTTPError} from '@transport/types';
import {nanoid} from 'nanoid';
import {faker} from '@faker-js/faker';
import {AvatarGenerator} from 'random-avatar-generator';
import {toDate} from 'date-fns';

export type UsersAPI = {
  getAll: () => Result.Async<User[], HTTPError>;
  get: (id: string) => Result.Async<User, HTTPError>;
  add: (user: NewUser) => Result.Async<User[], HTTPError>;
  update: (user: User) => Result.Async<User[], HTTPError>;
  delete: (user: User) => Result.Async<User[], HTTPError>;
}

const randomNumberFromRange = (min: number, max = 6) => Math.floor(Math.random() * max) + min;
const generator = new AvatarGenerator();

export const createRandomUsers = (num = randomNumberFromRange(3, 15)): User[] =>
  [...Array(num)].map(() => createUser(Math.random() > 0.5)
  );

export const usersApi = (randomUsers: User[]): UsersAPI => ({
  getAll: () => asyncSuccess(randomUsers),
  get: id => maybe(randomUsers.find(user => user.id === id))
    .map(user => asyncSuccess<User, HTTPError>(user))
    .orElse(asyncFailure(HTTPError.UNKNOWN)),
  add: user => {
    randomUsers = [{...user, id: nanoid()}, ...randomUsers];
    return asyncSuccess(randomUsers);
  },
  update: user => {
    const friendIds = new Set(user.friends);
    randomUsers = randomUsers.map(randomUser => {
      if (randomUser.id === user.id) return {...user, friends: [...friendIds]};
      if (friendIds.has(randomUser.id)) return {
        ...randomUser,
        friends: randomUser.friends.includes(user.id)
          ? randomUser.friends
          : [...randomUser.friends, user.id]
      };
      return {...randomUser, friends: randomUser.friends.filter(id => id !== user.id)};
    });
    return asyncSuccess(randomUsers);
  },
  delete: user => {
    randomUsers = randomUsers.map(randomUser => ({
      ...randomUser,
      friends: randomUser.friends.filter(id => id !== user.id)
    })).filter(randomUser => randomUser.id !== user.id);
    return asyncSuccess(randomUsers);
  }
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


export const createUserInfo = (): UserInfo => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  dob: toDate(faker.date.birthdate().toISOString().split('T')[0])
});

export const createAddress = (): AddressInfo => ({
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  streetAddress: faker.location.street(),
  streetAddressTwo: faker.location.secondaryAddress(),
  zip: faker.location.zipCode()
});
