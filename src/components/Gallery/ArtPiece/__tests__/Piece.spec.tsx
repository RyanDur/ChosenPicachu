import {act, screen, waitFor} from '@testing-library/react';
import {ArtPiece, useArtPiece} from '../index';
import {data} from '../../../../data';
import {Rendered, renderWithRouter} from '../../../../__tests__/util';
import {Art} from '../../../../data/artGallery/types/response';
import {Explanation, explanation, HTTPError} from '../../../../data/types';
import {asyncFailure, asyncSuccess} from '@ryandur/sand';
import {faker} from '@faker-js/faker';
import {Paths} from '../../../../routes/Paths.ts';
import {Mock} from 'vitest';

vi.mock('../Context', () => ({
    useArtPiece: vi.fn()
}));
const success = asyncSuccess;
const failure = asyncFailure;

describe('viewing a piece', () => {
    const mockUsePieceGallery = useArtPiece as Mock;
    const mockPiece: Art = {
        id: faker.lorem.word(),
        image: faker.internet.url(),
        title: faker.lorem.words(),
        altText: faker.lorem.sentence(),
        artistInfo: faker.lorem.paragraph()
    };
    let rendered: () => Rendered;

    beforeEach(() => mockUsePieceGallery.mockReturnValue({
        piece: mockPiece,
        updatePiece: vi.fn(),
        reset: vi.fn()
    }));

    describe('loading the piece of art', () => {
        it('should be loading', () => {
            data.artGallery.getArt = () => ({
                ...success(mockPiece),
                onPending: dispatch => {
                    dispatch(true);
                    return success(mockPiece);
                }
            });

            act(() => void renderWithRouter(<ArtPiece/>, {
                initialRoute: `${Paths.artGallery}/1234`,
                path: `${Paths.artGalleryPiece}`
            }));

            expect(screen.getByTestId('loading-piece')).toBeInTheDocument();
        });
    });

    describe('when the art piece is loaded', () => {
        beforeEach(async () => {
            data.artGallery.getArt =
                vi.fn(() => success<Art, Explanation<HTTPError>>(mockPiece));

            await act(async () => await act(async () => {
                rendered = renderWithRouter(<ArtPiece/>, {
                    initialRoute: `${Paths.artGallery}/1234`,
                    path: `${Paths.artGalleryPiece}`
                });
            }));
        });

        it("should display the artist's info", () =>
            expect(screen.getByText(mockPiece.artistInfo)).toBeInTheDocument());

        it('should get the correct piece', () =>
            expect(data.artGallery.getArt).toHaveBeenCalledWith({id: '1234'}));

        it('should not have the error image', () =>
            expect(screen.queryByTestId('image-error')).not.toBeInTheDocument());

        it('should clean up the art-piece after unmounting', async () => {
            act(() => rendered().result.unmount());
            await waitFor(() => expect(mockUsePieceGallery().reset).toHaveBeenCalled());
        });
    });

    test('when getting the piece has errored', async () => {
        data.artGallery.getArt = () => failure(explanation(HTTPError.UNKNOWN as HTTPError));
        renderWithRouter(<ArtPiece/>, {
            initialRoute: `${Paths.artGallery}/1234`,
            path: `${Paths.artGalleryPiece}`
        });

        await waitFor(() => expect(screen.queryByTestId('image-error')).toBeInTheDocument());
        expect(screen.queryByTestId('image-figure')).not.toBeInTheDocument();
        expect(screen.queryByTestId('loading-piece')).not.toBeInTheDocument();
    });
});
