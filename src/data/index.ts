import {artGallery} from './artGallery';
import {asyncEvent, asyncResult, OnAsyncEvent} from '@ryandur/sand';
import {Explanation, HTTPError} from './types';
import {User} from '../components/UserInfo/types';
import {createRandomUsers} from '../__tests__/util';

export const data = {
    artGallery,
    users: {
        getAll: (): OnAsyncEvent<User[], Explanation<HTTPError>> =>
            asyncEvent(asyncResult.success(createRandomUsers()))
    }
};
