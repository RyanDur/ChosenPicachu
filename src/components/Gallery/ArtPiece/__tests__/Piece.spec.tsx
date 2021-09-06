import {screen} from '@testing-library/react';
import {Paths} from '../../../../App';
import {ArtPiece, useArtPiece} from '../index';
import {data} from '../../../../data';
import * as faker from 'faker';
import {Dispatch} from '../../../../data/types';
import {error, GetPieceAction, loaded, loading} from '../../../../data/actions';
import {Rendered, renderWithRouter} from '../../../../__tests__/util';
import {GalleryPath} from '../../index';
import {Piece} from '../../../../data/sources/types';

jest.mock('../Context', () => ({
    useArtPiece: jest.fn()
}));

describe('viewing a piece', () => {
    const mockGetPieceId = jest.fn();
    const mockUsePieceGallery = useArtPiece as jest.Mock;
    const mockPiece: Piece = {
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
            data.getPiece = (id, dispatch: Dispatch<GetPieceAction>) => dispatch(loading());
            renderWithRouter(<ArtPiece/>, {
                initialRoute: `${Paths.artGallery}/1234`,
                path: `${Paths.artGallery}${GalleryPath.piece}`
            });
        });

        it('should be loading', () =>
            expect(screen.getByTestId('loading-piece')).toBeInTheDocument());
    });

    describe('when the art piece is loaded', () => {
        beforeEach(() => {
            data.getPiece = (id, dispatch: Dispatch<GetPieceAction>) => {
                mockGetPieceId(id);
                dispatch(loaded(mockPiece));
            };
            rendered = renderWithRouter(<ArtPiece/>, {
                initialRoute: `${Paths.artGallery}/1234`,
                path: `${Paths.artGallery}${GalleryPath.piece}`
            });
        });

        it("should display the artist's info", () =>
            expect(screen.getByText(mockPiece.artistInfo)).toBeInTheDocument());

        it('should get the correct piece', () =>
            expect(mockGetPieceId).toHaveBeenCalledWith({id: '1234'}));

        it('should not have the error image', () =>
            expect(screen.queryByTestId('image-error')).not.toBeInTheDocument());

        it('should clean up the art-piece after unmounting', async () => {
            rendered().result.unmount();
            expect(mockUsePieceGallery().reset).toHaveBeenCalled();
        });
    });

    describe('when getting the piece has errored', () => {
        beforeEach(() => {
            data.getPiece = (id, dispatch: Dispatch<GetPieceAction>) => dispatch(error());
            renderWithRouter(<ArtPiece/>, {
                initialRoute: `${Paths.artGallery}/1234`,
                path: `${Paths.artGallery}${GalleryPath.piece}`
            });
        });

        it('should have teh error image', () =>
            expect(screen.queryByTestId('image-error')).toBeInTheDocument());

        it('should not contain ab image', () =>
            expect(screen.queryByTestId('image-figure')).not.toBeInTheDocument());

        it('should not be loading', () =>
            expect(screen.queryByTestId('loading-piece')).not.toBeInTheDocument());
    });
});