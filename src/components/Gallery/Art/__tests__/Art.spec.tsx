import {cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {data} from '../../../../data';
import {fromAICArt, Rendered, renderWithRouter} from '../../../../__tests__/util';
import {Paths} from '../../../../App';
import {useGallery} from '../../Context';
import {error, GetAllArtAction, loaded, loading} from '../../../../data/artGallery/actions';
import {ArtGallery} from '../index';
import {Dispatch} from '../../../../data/types';
import {AllArt, Art, GetAllArt, Source} from '../../../../data/artGallery/types';

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
            data.artGallery.getAllArt = (
                query: GetAllArt,
                dispatch: Dispatch<GetAllArtAction>
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
            data.artGallery.getAllArt = (
                query: GetAllArt,
                dispatch: Dispatch<GetAllArtAction>
            ) => dispatch(loaded(fromAICArt));
            mockUseGallery.mockReturnValue({
                art: fromAICArt,
                updateArt: jest.fn(),
                reset: jest.fn()
            });
            rendered = renderWithRouter(<ArtGallery/>);
        });

        it('should not signify that it is loading', () =>
            expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument());

        it('should contain art', async () => {
            expect(screen.getAllByTestId(/piece/).length).toEqual(fromAICArt.pagination.limit);
        });

        it('should not signify that the gallery is empty', () =>
            expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument());

        it('should allow a user to take a closer look at the art', () => {
            userEvent.click(screen.getByTestId(`piece-${fromAICArt.pieces[0].id}`));
            expect(rendered().testLocation?.pathname).toEqual(`${Paths.artGallery}/${fromAICArt.pieces[0].id}`);
        });

        it('should reset the art when leaving', () => {
            rendered().result.unmount();
            expect(useGallery().reset).toHaveBeenCalled();
        });
    });

    describe('when there is no art to show', () => {
        beforeEach(() => {
            data.artGallery.getAllArt = jest.fn((
                query: GetAllArt,
                dispatch: Dispatch<GetAllArtAction>
            ) => dispatch(loaded({pieces: [] as Art[]} as AllArt)));
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
            data.artGallery.getAllArt = (
                query: GetAllArt,
                dispatch: Dispatch<GetAllArtAction>
            ) => dispatch(error());
            mockUseGallery.mockReturnValue({
                art: fromAICArt,
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
            data.artGallery.getAllArt = jest.fn((
                query: GetAllArt,
                dispatch: Dispatch<GetAllArtAction>
            ) => dispatch(loaded(fromAICArt)));

            mockUseGallery.mockReturnValue({
                art: fromAICArt,
                updateArt: jest.fn(),
                reset: jest.fn()
            });

            renderWithRouter(<ArtGallery/>, {params: {page: 23, search: 'g', tab: Source.HARVARD}});
        });

        it('should pass the criteria', () =>
            expect(data.artGallery.getAllArt).toHaveBeenCalledWith({
                page: 23,
                search: 'g',
                source: Source.HARVARD
            }, expect.anything()));
    });
});