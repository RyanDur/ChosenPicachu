import {asyncFailure, asyncSuccess, maybe, Result} from '@ryandur/sand';
import {HTTPError} from '../types';
import {User} from '../../components/UserInfo/types';
import {nanoid} from 'nanoid';
import {createRandomUsers} from '../../__tests__/util/dummyData.tsx';

const success = asyncSuccess;
const failure = asyncFailure;

export interface UsersAPI {
  getAll: () => Result.Async<User[], HTTPError>;
  get: (id: string) => Result.Async<User, HTTPError>;
  add: (user: User) => Result.Async<User[], HTTPError>;
  update: (user: User) => Result.Async<User[], HTTPError>;
  delete: (user: User) => Result.Async<User[], HTTPError>;
}

export const users = (randomUsers: User[] = createRandomUsers()): UsersAPI => ({
  getAll: () => success(randomUsers),
  get: id => maybe(randomUsers.find(user => user.id === id))
    .map(user => success<User, HTTPError>(user))
    .orElse(failure<User, HTTPError>(HTTPError.UNKNOWN)),
  add: user => {
    randomUsers = [{...user, id: nanoid()}, ...randomUsers];
    return success(randomUsers);
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

    return success(randomUsers);
  },
  delete: user => {
    randomUsers = randomUsers.map(randomUser => ({
      ...randomUser,
      friends: randomUser.friends.filter(friend => friend.id !== user.id)
    })).filter(randomUser => randomUser.id !== user.id);
    return success(randomUsers);
  }
});
