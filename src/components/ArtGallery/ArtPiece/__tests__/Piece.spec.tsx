import {render, RenderResult, screen} from '@testing-library/react';
import {Paths} from '../../../../App';
import {MemoryRouter, Route} from 'react-router-dom';
import {ArtPiece, useArtPiece} from '../index';
import {data, GetPieceAction} from '../../../../data';
import {nanoid} from 'nanoid';
import * as faker from 'faker';
import {Piece} from '../../../../data/types';
import {onSuccess, loading} from '../../../../data/actions';

jest.mock('../Context', () => ({
    useArtPiece: jest.fn()
}));

describe('viewing a piece', () => {
    const mockGetPieceId = jest.fn();
    const mockUsePieceGallery = useArtPiece as jest.Mock;
    const mockPiece: Piece = {
        id: 1234,
        imageId: nanoid(),
        title: faker.lorem.words(),
        altText: faker.lorem.sentence(),
        artistInfo: faker.lorem.paragraph()
    };
    let rendered: RenderResult;

    beforeEach(() => mockUsePieceGallery.mockReturnValue({
        piece: mockPiece,
        updatePiece: jest.fn(),
        reset: jest.fn()
    }));

    describe('loading the piece of art', () => {
        beforeEach(() => {
            data.getPiece = (id, state: (state: GetPieceAction) => void) => {
                mockGetPieceId(id);
                state(loading());
            };
            rendered = render(<MemoryRouter initialEntries={[`${Paths.artGallery}/1234`]}>
                <Route path={Paths.artGalleryPiece}>
                    <ArtPiece/>
                </Route>
            </MemoryRouter>);
        });

        it('should be loading', () =>
            expect(screen.getByTestId('loading-piece')).toBeInTheDocument());
    });

    describe('when the art piece is loaded', () => {
        beforeEach(() => {
            data.getPiece = (id, state: (state: GetPieceAction) => void) => {
                mockGetPieceId(id);
                state(onSuccess(mockPiece));
            };
            rendered = render(<MemoryRouter initialEntries={[`${Paths.artGallery}/1234`]}>
                <Route path={Paths.artGalleryPiece}>
                    <ArtPiece/>
                </Route>
            </MemoryRouter>);
        });

        it("should display the artist's info", () =>
            expect(screen.getByText(mockPiece.artistInfo)).toBeInTheDocument());

        it('should get the correct piece', () =>
            expect(mockGetPieceId).toHaveBeenCalledWith('1234'));

        it('should clean up the art-piece after unmounting', async () => {
            rendered.unmount();
            expect(mockUsePieceGallery().reset).toHaveBeenCalled();
        });
    });
});