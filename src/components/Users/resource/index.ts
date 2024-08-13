import {createRandomUsers, users} from './users';

export const resource = users([...createRandomUsers?.() ?? []]);
