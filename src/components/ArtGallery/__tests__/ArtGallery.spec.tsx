import {render, RenderResult, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ArtGallery} from '..';
import {data, StateChange} from '../../../data';
import {Art} from '../../../data/types';
import {art} from '../../../__tests__/util';
import {MemoryRouter, Route} from 'react-router-dom';
import {Paths} from '../../../App';
import {galleryInitialState} from '../Context';
import * as H from 'history';

const mockUseArtGallery = {art: {pieces: []}, updateArt: jest.fn(), reset: jest.fn()};
jest.mock('../Context', () => {
    return ({
        useArtGallery: () => mockUseArtGallery
    });
});

describe('The art gallery.', () => {
    let testLocation: H.Location;
    let rendered: RenderResult;

    describe('When the art has not loaded yet', () => {
        beforeEach(() => {
            data.getAllArt = (page: number, {onLoading}: StateChange<Art>) => {
                onLoading(true);
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

        it('should signify that it is loading', () => {
            expect(screen.getByTestId('gallery-loading')).toBeInTheDocument();
        });

        it('should not contain art', () =>
            expect(screen.queryAllByTestId(/piece/).length).toEqual(0));
    });

    describe('When the art has loaded', () => {
        beforeEach(() => {
            data.getAllArt = (page: number, {onSuccess}: StateChange<Art>) => {
                onSuccess(art);
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


        it('should not signify that it is loading', () =>
            expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument());

        it('should contain art', () =>
            expect(screen.getAllByTestId(/piece/).length).toEqual(art.pagination.limit));

        it('should allow a user to take a closer look at the art', () => {
            userEvent.click(screen.getByTestId(`piece-${art.pieces[0].imageId}`));
            expect(testLocation.pathname).toEqual(`${Paths.artGallery}/${art.pieces[0].id}`);
        });

        it('should reset the art when leaving', () => {
            rendered.unmount();
            expect(mockUseArtGallery.reset).toHaveBeenCalled();
        });
    });

    describe('when there is no art to show', () => {
        beforeEach(() => {
            data.getAllArt = (page: number, {onSuccess}: StateChange<Art>) => {
                onSuccess(galleryInitialState);
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

        it('should not contain art', () =>
            expect(screen.queryAllByTestId(/piece/).length).toEqual(0));

        it('should not signify that it is loading', () =>
            expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument());

        it('should signify that the gallery is empty', () =>
            expect(screen.queryByTestId('empty-gallery')).toBeInTheDocument());
    });
});