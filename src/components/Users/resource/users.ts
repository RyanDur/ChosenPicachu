import {createRandomUsers, usersApi} from './usersApi';

export const users = usersApi([...createRandomUsers?.() ?? []]);
