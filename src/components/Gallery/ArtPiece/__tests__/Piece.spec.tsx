import {act, screen, waitFor} from '@testing-library/react';
import {Paths} from '../../../../App';
import {ArtPiece, useArtPiece} from '../index';
import {data} from '../../../../data';
import * as faker from 'faker';
import {Rendered, renderWithRouter} from '../../../../__tests__/util';
import {GalleryPath} from '../../index';
import {Art} from '../../../../data/artGallery/types/response';
import {explanation, HTTPError} from '../../../../data/types';
import {asyncResult} from '@ryandur/sand';

jest.mock('../Context', () => ({
    useArtPiece: jest.fn()
}));

describe('viewing a piece', () => {
    const mockUsePieceGallery = useArtPiece as jest.Mock;
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
        updatePiece: jest.fn(),
        reset: jest.fn()
    }));

    describe('loading the piece of art', () => {
        it('should be loading', () => {
            data.artGallery.getArt = () => ({
                ...asyncResult.success(mockPiece),
                onPending: dispatch => {
                    dispatch(true);
                    return asyncResult.success(mockPiece);
                }
            });

            act(() => void renderWithRouter(<ArtPiece/>, {
                initialRoute: `${Paths.artGallery}/1234`,
                path: `${Paths.artGallery}${GalleryPath.piece}`
            }));

            expect(screen.getByTestId('loading-piece')).toBeInTheDocument();
        });
    });

    describe('when the art piece is loaded', () => {
        beforeEach(async () => {
            data.artGallery.getArt =
                jest.fn(() => asyncResult.success(mockPiece));

            await act(async () => await act(async () => {
                rendered = renderWithRouter(<ArtPiece/>, {
                    initialRoute: `${Paths.artGallery}/1234`,
                    path: `${Paths.artGallery}${GalleryPath.piece}`
                });
            }));
        });

        it("should display the artist's info", () =>
            expect(screen.getByText(mockPiece.artistInfo)).toBeInTheDocument());

        it('should get the correct piece', () =>
            expect(data.artGallery.getArt).toHaveBeenCalledWith({id: '1234'}));

        it('should not have the error image', () =>
            expect(screen.queryByTestId('image-error')).not.toBeInTheDocument());

        it('should clean up the art-piece after unmounting', (done) => {
            act(() => rendered().result.unmount());
            expect(mockUsePieceGallery().reset).toHaveBeenCalled();
            done();
        });
    });

    test('when getting the piece has errored', async () => {
        data.artGallery.getArt = () => asyncResult.failure(explanation(HTTPError.UNKNOWN as HTTPError));
        renderWithRouter(<ArtPiece/>, {
            initialRoute: `${Paths.artGallery}/1234`,
            path: `${Paths.artGallery}${GalleryPath.piece}`
        });

        await waitFor(() => expect(screen.queryByTestId('image-error')).toBeInTheDocument());
        expect(screen.queryByTestId('image-figure')).not.toBeInTheDocument();
        expect(screen.queryByTestId('loading-piece')).not.toBeInTheDocument();
    });
});