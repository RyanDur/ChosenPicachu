import {act, cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {data} from '../../../../data';
import {fromAICArt, Rendered, renderWithRouter} from '../../../../__tests__/util';
import {Paths} from '../../../../App';
import {useGallery} from '../../Context';
import {ArtGallery} from '../index';
import {asyncResult} from '@ryandur/sand';
import {AllArt, Art} from '../../../../data/artGallery/types/response';
import {Source} from '../../../../data/artGallery/types/resource';
import {explanation, HTTPError} from '../../../../data/types';

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

    describe('When the art has loaded', () => {
        beforeEach(async () => {
            data.artGallery.getAllArt = () => asyncResult.success(fromAICArt);

            mockUseGallery.mockReturnValue({
                art: fromAICArt,
                updateArt: jest.fn(),
                reset: jest.fn()
            });
            await act(async () => await act(async () => {
                rendered = renderWithRouter(<ArtGallery/>);
            }));
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

    test('when there is no art to show', async () => {
        const pieces = [] as Art[];
        data.artGallery.getAllArt = () => asyncResult.success({pieces} as AllArt);
        mockUseGallery.mockReturnValue({
            art: {pieces},
            updateArt: jest.fn(),
            reset: jest.fn()
        });
        await act(async () => await act(async () => {
            renderWithRouter(<ArtGallery/>);
        }));
        expect(screen.queryAllByTestId(/piece/).length).toEqual(0);
        expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-gallery')).toBeInTheDocument();
    });

    test('when the art has errored', async () => {
        data.artGallery.getAllArt = (query) => {
            expect(query).toEqual({
                page: 23,
                search: 'g',
                size: 8,
                source: Source.HARVARD
            });

            return asyncResult.failure(explanation(HTTPError.UNKNOWN as HTTPError));
        };

        mockUseGallery.mockReturnValue({
            art: fromAICArt,
            updateArt: jest.fn(),
            reset: jest.fn()
        });
        renderWithRouter(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.HARVARD}});

        expect(await screen.findByTestId('empty-gallery')).toBeInTheDocument();
    });
});