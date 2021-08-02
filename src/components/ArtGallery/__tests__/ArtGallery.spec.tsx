import {render, RenderResult, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ArtGallery} from '..';
import {data} from '../../../data';
import {Art} from '../../../data/types';
import {Consumer} from '../../UserInfo/types';
import {art} from '../../../__tests__/util';
import {MemoryRouter, Route} from 'react-router-dom';
import {Paths} from '../../../App';
import * as H from 'history';

const mockUseArtGallery = {art, updateArt: jest.fn()};
jest.mock('../Context', () => {
    return ({
        useArtGallery: () => mockUseArtGallery
    });
});

describe('the art gallery', () => {
    let testLocation: H.Location;
    let rendered: RenderResult;

    beforeEach(() => {
        data.getAllArt = (consume: Consumer<Art>) => {
            consume(art);
        };
        rendered = render(<MemoryRouter initialEntries={[`${Paths.artGallery}`]}>
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

    it('should contain art', () =>
        expect(screen.getAllByTestId(/piece/).length).toEqual(art.pagination.limit));

    it('should allow a user to take a closer look at the art', () => {
        userEvent.click(screen.getByTestId(`piece-${art.pieces[0].imageId}`));
        expect(testLocation.pathname).toEqual(`${Paths.artGallery}/${art.pieces[0].id}`);
    });

    it('should remove the art when leaving', () => {
        rendered.unmount();
        expect(mockUseArtGallery.updateArt).toHaveBeenCalledWith({});
    });
});