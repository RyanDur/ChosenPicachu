import {Consumer, UserInfo} from '../components/UserInfo/types';
import {Art} from './types';

export const data = {
    getArt: (updateArtWork: Consumer<Art>): void => void ({
        pagination: {
            total: 0,
            limit: 0,
            offset: 0,
            total_pages: 0,
            current_page: 0,
            next_url: 'string'
        },
        artwork: [],
        baseUrl: ''
    }),
    post: (user: UserInfo) => void user
};