import {cleanup, render, RenderResult, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ArtGallery} from '..';
import {data} from '../../../data';
import {art} from '../../../__tests__/util';
import {MemoryRouter, Route} from 'react-router-dom';
import {Paths} from '../../../App';
import {useGallery} from '../Context';
import * as H from 'history';
import {GetArtAction, loading, onError, onSuccess} from '../../../data/actions';
import {Dispatch} from '../../UserInfo/types';
import {Art, Piece} from '../../../data/types';

jest.mock('../Context', () => {
    return ({
        useGallery: jest.fn()
    });
});

describe('The gallery.', () => {
    let testLocation: H.Location;
    let rendered: RenderResult;
    const mockUseArtGallery = useGallery as jest.Mock;
    window.scrollTo = jest.fn();
    afterEach(cleanup);

    describe('When the art has not loaded yet', () => {
        beforeEach(() => {
            data.getAllArt = (page: number, dispatch: Dispatch<GetArtAction>) => dispatch(loading());
            mockUseArtGallery.mockReturnValue({
                art: {pieces: []},
                updateArt: jest.fn(),
                reset: jest.fn()
            });

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

        it('should signify that it is loading', () =>
            expect(screen.getByTestId('gallery-loading')).toBeInTheDocument());

        it('should not contain art', () =>
            expect(screen.queryAllByTestId(/piece/).length).toEqual(0));
    });

    describe('When the art has loaded', () => {
        beforeEach(() => {
            data.getAllArt = (page: number, dispatch: Dispatch<GetArtAction>) => dispatch(onSuccess(art));
            mockUseArtGallery.mockReturnValue({
                art,
                updateArt: jest.fn(),
                reset: jest.fn()
            });
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

        it('should contain art', async () => {
            expect(screen.getAllByTestId(/piece/).length).toEqual(art.pagination.limit);
        });

        it('should not signify that the gallery is empty', () =>
            expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument());

        it('should allow a user to take a closer look at the art', () => {
            userEvent.click(screen.getByTestId(`piece-${art.pieces[0].imageId}`));
            expect(testLocation.pathname).toEqual(`${Paths.artGallery}/${art.pieces[0].id}`);
        });

        it('should reset the art when leaving', () => {
            rendered.unmount();
            expect(useGallery().reset).toHaveBeenCalled();
        });
    });

    describe('when there is no art to show', () => {
        beforeEach(() => {
            data.getAllArt = (page: number, dispatch: Dispatch<GetArtAction>) => dispatch(onSuccess({pieces: [] as Piece[]} as Art));
            mockUseArtGallery.mockReturnValue({
                updateArt: jest.fn(),
                reset: jest.fn()
            });
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

    describe('when the art has errored', () => {
        beforeEach(() => {
            data.getAllArt = (page: number, dispatch: Dispatch<GetArtAction>) => dispatch(onError());
            mockUseArtGallery.mockReturnValue({
                art,
                updateArt: jest.fn(),
                reset: jest.fn()
            });
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

        it('should indicate that something went wrong', () =>
            expect(screen.queryByTestId('empty-gallery')).toBeInTheDocument());
    });
});