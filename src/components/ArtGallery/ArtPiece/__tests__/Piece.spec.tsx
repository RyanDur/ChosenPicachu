import {render, RenderResult, screen} from '@testing-library/react';
import {Paths} from '../../../../App';
import {MemoryRouter, Route} from 'react-router-dom';
import {ArtPiece} from '../index';
import {data} from '../../../../data';
import {nanoid} from 'nanoid';
import * as faker from 'faker';
import {Piece} from '../../../../data/types';

const mockUpdatePiece = jest.fn();
const mockPiece: Piece = {
    id: 1234,
    imageId: nanoid(),
    title: faker.lorem.words(),
    altText: faker.lorem.sentence(),
    artistInfo: faker.lorem.paragraph()
};

jest.mock('../Context', () => ({
    useArtPiece: () => ({piece: mockPiece, updatePiece: mockUpdatePiece})
}));

describe('viewing a piece', () => {
    const mockGetPieceId = jest.fn();
    let rendered: RenderResult;

    beforeEach(() => {
        data.getPiece = (id, onSuccess) => {
            mockGetPieceId(id);
            onSuccess(mockPiece);
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

    it('should clean up the art-piece after unmounting', () => {
        rendered.unmount();
        expect(mockUpdatePiece).toHaveBeenCalledWith({});
    });
});