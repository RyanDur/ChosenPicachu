import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ArtGallery} from '..';
import {data} from '../../../data';
import {Art} from '../../../data/types';
import {Consumer} from '../../UserInfo/types';
import {art} from '../../../__tests__/util';
import {MemoryRouter, Route} from 'react-router-dom';
import {Paths} from '../../../App';
import * as H from 'history';

const mockArt = art;
window.scrollTo = () => void 0;
jest.mock('../Context', () => ({
    useArtGallery: () => ({art: mockArt, updateArt: jest.fn()})
}));

describe('the art gallery', () => {
    let testLocation: H.Location;

    beforeEach(() => {
        data.getAllArt = (consume: Consumer<Art>) => {
            consume(art);
        };
        render(<MemoryRouter initialEntries={[`${Paths.artGallery}`]}>
            <ArtGallery/>
            <Route
                path="*"
                render={({location}) => {
                    testLocation = location;
                    return null;
                }}
            />
        </MemoryRouter>);
    });

    afterEach(() => {
        cleanup();
    });

    it('should contain art', () =>
        expect(screen.getAllByTestId(/piece/).length).toEqual(art.pagination.limit));

    it('should allow a user to take a closer look at the art', () => {
        userEvent.click(screen.getByTestId(`piece-${art.pieces[0].imageId}`));
        expect(testLocation.pathname).toEqual(`${Paths.artGallery}/${art.pieces[0].id}`);
    });
});