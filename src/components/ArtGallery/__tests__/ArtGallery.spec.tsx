import {render, screen} from '@testing-library/react';
import {ArtGallery} from '..';
import {data} from '../../../data';
import {Art} from '../../../data/types';
import * as faker from 'faker';
import {nanoid} from 'nanoid';
import {randomNumberFromRange} from '../../../__tests__/util';
import {Consumer} from '../../UserInfo/types';

describe('the art gallery', () => {
    const pagination = {
        total: 100,
        limit: randomNumberFromRange(10, 100),
        offset: 0,
        total_pages: 10,
        current_page: 1,
        next_url: faker.internet.url()
    };
    const art: Art = {
        pagination,
        pieces: [...Array(pagination.limit)].map(() => ({
            id: randomNumberFromRange(100, 1000),
            title: faker.lorem.sentence(),
            image_id: nanoid()
        })),
        baseUrl: faker.internet.url()
    };

    beforeEach(() => {
        data.getArt = (consume: Consumer<Art>) => consume(art);
        render(<ArtGallery/>);
    });

    it('should contain art', () => {
        expect(screen.getAllByTestId('art').length).toEqual(art.pagination.limit);
    });
});