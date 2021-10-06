import {asyncEvent, asyncResult, maybe, OnAsyncEvent} from '@ryandur/sand';
import {explanation, Explanation, HTTPError} from '../types';
import {User} from '../../components/UserInfo/types';
import {createRandomUsers} from '../../__tests__/util';
import {nanoid} from 'nanoid';

const {success, failure} = asyncResult;

export interface UsersAPI {
    getAll: () => OnAsyncEvent<User[], Explanation<HTTPError>>;
    get: (id: string) => OnAsyncEvent<User, Explanation<HTTPError>>;
    add: (user: User) => OnAsyncEvent<User[], Explanation<HTTPError>>;
    update: (user: User) => OnAsyncEvent<User[], Explanation<HTTPError>>;
    delete: (user: User) => OnAsyncEvent<User[], Explanation<HTTPError>>;
}

export const users = (randomUsers: User[] = createRandomUsers()): UsersAPI => ({
    getAll: () => asyncEvent(success(randomUsers)),
    get: id => {
        const onAsyncEvent = asyncEvent(maybe.of(randomUsers.find(user => user.id === id))
            .map(user => success<User, Explanation<HTTPError>>(user))
            .orElse(failure<User, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN))));
        console.log('user', randomUsers.find(user => user.id === id));
        return onAsyncEvent;
    },
    add: user => {
        randomUsers = [{...user, id: nanoid()}, ...randomUsers];
        return asyncEvent(success(randomUsers));
    },
    update: user => {
        const friends: User[] = [user, ...user.friends.map(friend => ({
            ...friend,
            friends: [...friend.friends, user]
        }))];

        randomUsers = randomUsers.map(randomUser => ({
            ...randomUser,
            friends: randomUser.friends.filter(friend => friend.id !== user.id)
        })).map(randomUser => maybe.of(
            friends.find(friend => friend.id === randomUser.id)
        ).orElse(randomUser));

        return asyncEvent(success(randomUsers));
    },
    delete: user => {
        randomUsers = randomUsers.map(randomUser => ({
            ...randomUser,
            friends: randomUser.friends.filter(friend => friend.id !== user.id)
        })).filter(randomUser => randomUser.id !== user.id);
        return asyncEvent(success(randomUsers));
    }
});