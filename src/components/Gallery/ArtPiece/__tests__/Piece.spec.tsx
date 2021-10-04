import {screen, waitFor} from '@testing-library/react';
import {Paths} from '../../../../App';
import {ArtPiece, useArtPiece} from '../index';
import {data} from '../../../../data';
import * as faker from 'faker';
import {fakeAsyncEvent, Rendered, renderWithRouter} from '../../../../__tests__/util';
import {GalleryPath} from '../../index';
import {Art} from '../../../../data/artGallery/types/response';
import {explanation, HTTPError} from '../../../../data/types';
import {asyncEvent, asyncResult} from '@ryandur/sand';

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
        beforeEach(() => {
            data.artGallery.getArt = () => ({
                ...fakeAsyncEvent(),
                onLoading: dispatch => {
                    dispatch();
                    return fakeAsyncEvent();
                }
            });

            renderWithRouter(<ArtPiece/>, {
                initialRoute: `${Paths.artGallery}/1234`,
                path: `${Paths.artGallery}${GalleryPath.piece}`
            });
        });

        it('should be loading', async () => {
            expect(useArtPiece().reset).toHaveBeenCalledTimes(1);
        });
    });

    describe('when the art piece is loaded', () => {
        beforeEach(() => {
            data.artGallery.getArt =
                jest.fn(() => asyncEvent(asyncResult.success(mockPiece)));

            rendered = renderWithRouter(<ArtPiece/>, {
                initialRoute: `${Paths.artGallery}/1234`,
                path: `${Paths.artGallery}${GalleryPath.piece}`
            });
        });

        it("should display the artist's info", () =>
            expect(screen.getByText(mockPiece.artistInfo)).toBeInTheDocument());

        it('should get the correct piece', () =>
            expect(data.artGallery.getArt).toHaveBeenCalledWith({id: '1234'}));

        it('should not have the error image', () =>
            expect(screen.queryByTestId('image-error')).not.toBeInTheDocument());

        it('should clean up the art-piece after unmounting', (done) => {
            rendered().result.unmount();
            expect(mockUsePieceGallery().reset).toHaveBeenCalled();
            done();
        });
    });

    test('when getting the piece has errored', async () => {
        data.artGallery.getArt = () => asyncEvent(asyncResult.failure(explanation(HTTPError.UNKNOWN)));
        renderWithRouter(<ArtPiece/>, {
            initialRoute: `${Paths.artGallery}/1234`,
            path: `${Paths.artGallery}${GalleryPath.piece}`
        });

        await waitFor(() => expect(screen.queryByTestId('image-error')).toBeInTheDocument());
        expect(screen.queryByTestId('image-figure')).not.toBeInTheDocument();
        expect(screen.queryByTestId('loading-piece')).not.toBeInTheDocument();
    });
});