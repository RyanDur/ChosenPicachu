import {cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {data} from '../../../../data';
import {art, Rendered, renderWithRouter} from '../../../../__tests__/util';
import {Paths} from '../../../../App';
import {useGallery} from '../../Context';
import {error, GetArtAction, loaded, loading} from '../../../../data/actions';
import {Art, Dispatch, Piece} from '../../../../data/types';
import {ArtGallery} from '../index';

jest.mock('../../Context', () => {
    return ({
        useGallery: jest.fn()
    });
});

describe('The gallery.', () => {
    let rendered: () => Rendered;
    const mockUseGallery = useGallery as jest.Mock;
    window.scrollTo = jest.fn();
    afterEach(cleanup);

    describe('When the art has not loaded yet', () => {
        beforeEach(() => {
            data.getAllArt = (
                query: Record<string, unknown>,
                dispatch: Dispatch<GetArtAction>
            ) => dispatch(loading());
            mockUseGallery.mockReturnValue({
                art: {pieces: []},
                updateArt: jest.fn(),
                reset: jest.fn()
            });

            renderWithRouter(<ArtGallery/>);
        });

        it('should signify that it is loading', () =>
            expect(screen.getByTestId('gallery-loading')).toBeInTheDocument());

        it('should not contain art', () =>
            expect(screen.queryAllByTestId(/piece/).length).toEqual(0));
    });

    describe('When the art has loaded', () => {
        beforeEach(() => {
            data.getAllArt = (
                query: Record<string, unknown>,
                dispatch: Dispatch<GetArtAction>
            ) => dispatch(loaded(art));
            mockUseGallery.mockReturnValue({
                art,
                updateArt: jest.fn(),
                reset: jest.fn()
            });
            rendered = renderWithRouter(<ArtGallery/>);
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
            expect(rendered().testLocation?.pathname).toEqual(`${Paths.artGallery}/${art.pieces[0].id}`);
        });

        it('should reset the art when leaving', () => {
            rendered().result.unmount();
            expect(useGallery().reset).toHaveBeenCalled();
        });
    });

    describe('when there is no art to show', () => {
        beforeEach(() => {
            data.getAllArt = jest.fn((
                query: Record<string, unknown>,
                dispatch: Dispatch<GetArtAction>
            ) => dispatch(loaded({pieces: [] as Piece[]} as Art)));
            mockUseGallery.mockReturnValue({
                updateArt: jest.fn(),
                reset: jest.fn()
            });
            renderWithRouter(<ArtGallery/>);
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
            data.getAllArt = (
                query: Record<string, unknown>,
                dispatch: Dispatch<GetArtAction>
            ) => dispatch(error());
            mockUseGallery.mockReturnValue({
                art,
                updateArt: jest.fn(),
                reset: jest.fn()
            });
            renderWithRouter(<ArtGallery/>);
        });

        it('should indicate that something went wrong', () =>
            expect(screen.queryByTestId('empty-gallery')).toBeInTheDocument());
    });

    describe('when filtering results by search', () => {
        beforeEach(() => {
            data.getAllArt = jest.fn((
                query: Record<string, unknown>,
                dispatch: Dispatch<GetArtAction>
            ) => dispatch(loaded(art)));

            mockUseGallery.mockReturnValue({
                art,
                updateArt: jest.fn(),
                reset: jest.fn()
            });

            renderWithRouter(<ArtGallery/>, {params: {page: 23, search: 'g'}});
        });

        it('should pass the criteria', () =>
            expect(data.getAllArt).toHaveBeenCalledWith({
                page: '23',
                search: 'g'
            }, expect.anything()));
    });
});