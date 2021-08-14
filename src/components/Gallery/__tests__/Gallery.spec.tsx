import {cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ArtGallery} from '..';
import {data} from '../../../data';
import {art, Rendered, renderWithRouter} from '../../../__tests__/util';
import {Paths} from '../../../App';
import {useGallery} from '../Context';
import {GetArtAction, loading, onError, onSuccess} from '../../../data/actions';
import {Dispatch} from '../../UserInfo/types';
import {Art, Piece} from '../../../data/types';

jest.mock('../Context', () => {
    return ({
        useGallery: jest.fn()
    });
});

describe('The gallery.', () => {
    let rendered: () => Rendered;
    const mockUseArtGallery = useGallery as jest.Mock;
    window.scrollTo = jest.fn();
    afterEach(cleanup);

    describe('When the art has not loaded yet', () => {
        beforeEach(() => {
            data.getAllArt = (
                query: Record<string, unknown>,
                dispatch: Dispatch<GetArtAction>
            ) => dispatch(loading());
            mockUseArtGallery.mockReturnValue({
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
            ) => dispatch(onSuccess(art));
            mockUseArtGallery.mockReturnValue({
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
            ) => dispatch(onSuccess({pieces: [] as Piece[]} as Art)));
            mockUseArtGallery.mockReturnValue({
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
            ) => dispatch(onError());
            mockUseArtGallery.mockReturnValue({
                art,
                updateArt: jest.fn(),
                reset: jest.fn()
            });
            renderWithRouter(<ArtGallery/>);
        });

        it('should indicate that something went wrong', () =>
            expect(screen.queryByTestId('empty-gallery')).toBeInTheDocument());
    });

    test('when filtering results by search', () => {
        data.getAllArt = jest.fn((
            query: Record<string, unknown>,
            dispatch: Dispatch<GetArtAction>
        ) => dispatch(onError()));
        mockUseArtGallery.mockReturnValue({
            art,
            updateArt: jest.fn(),
            reset: jest.fn()
        });

        renderWithRouter(<ArtGallery/>, Paths.artGallery, 'page=23&search=g');

        expect(data.getAllArt).toHaveBeenCalledWith({page: '23', search: 'g'}, expect.anything());
    });
});