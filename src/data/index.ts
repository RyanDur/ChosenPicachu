import {artGallery} from './artGallery';
import {asyncEvent, asyncResult, maybe, OnAsyncEvent} from '@ryandur/sand';
import {explanation, Explanation, HTTPError} from './types';
import {User} from '../components/UserInfo/types';
import {createRandomUsers} from '../__tests__/util';

let randomUsers = createRandomUsers();

const removeUser = (item: User, list: User[] = []): User[] => {
    const index = list.indexOf(item);
    randomUsers = [...list.slice(0, index), ...list.slice(index + 1)];
    return randomUsers;
};

const addUser = (item: User, list: User[] = []) => {
    randomUsers = [item, ...list];
    return randomUsers;
};

export const data = {
    artGallery,
    users: {
        update: (user: User): OnAsyncEvent<User[], Explanation<HTTPError>> =>
            asyncEvent(asyncResult.success([user, ...randomUsers.filter(aUser => aUser !== user)])),
        getAll: (): OnAsyncEvent<User[], Explanation<HTTPError>> =>
            asyncEvent(asyncResult.success(randomUsers)),
        add: (user: User): OnAsyncEvent<User[], Explanation<HTTPError>> =>
            asyncEvent(asyncResult.success(addUser(user, randomUsers))),
        delete: (user: User): OnAsyncEvent<User[], Explanation<HTTPError>> =>
            asyncEvent(asyncResult.success(removeUser(user, randomUsers))),
        get: (email: string): OnAsyncEvent<User, Explanation<HTTPError>> => {
            return asyncEvent(maybe.of(randomUsers.find(({info}) => info.email === email))
                .map(user => asyncResult.success<User, Explanation<HTTPError>>(user))
                .orElse(asyncResult.failure<User, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN))));
        }
    }
};
