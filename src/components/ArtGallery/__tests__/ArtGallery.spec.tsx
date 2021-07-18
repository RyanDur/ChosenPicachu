import {render, screen} from '@testing-library/react';
import {ArtGallery} from '..';
import {data} from '../../../data';
import {Art} from '../../../data/types';
import {Consumer} from '../../UserInfo/types';
import {art} from '../../../__tests__/util';

describe('the art gallery', () => {
    beforeEach(() => {
        data.getAllArt = (consume: Consumer<Art>) => consume(art);
        render(<ArtGallery/>);
    });

    it('should contain art', () => {
        expect(screen.getAllByTestId('piece').length).toEqual(art.pagination.limit);
    });
});