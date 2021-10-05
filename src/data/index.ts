import {artGallery} from './artGallery';
import {users as usersAPI} from './users';
import {createRandomUsers} from '../__tests__/util';

const users = usersAPI(createRandomUsers());

export const data = {
    artGallery,
    users
};
