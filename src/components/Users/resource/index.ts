import {createRandomUsers, users} from './users.ts';

export const resource = users([...createRandomUsers?.() ?? []]);
