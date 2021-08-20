import {Gallery} from '../index';
import {renderWithRouter} from '../../../__tests__/util';
import {Paths} from '../../../App';
import {screen} from '@testing-library/react';

jest.mock('../Art', () => ({
    ArtGallery: () => 'Art Gallery',
}));

jest.mock('../ArtPiece', () => ({
    ArtPiece: () => 'Art Piece'
}));

describe('the gallery', () => {

    test('viewing', () => {
        renderWithRouter(<Gallery/>, Paths.artGallery);
        expect(screen.getByText('Art Gallery')).toBeInTheDocument();
    });

    test('viewing a piece', () => {
        renderWithRouter(<Gallery/>, `${Paths.artGallery}/123`);
        expect(screen.getByText('Art Piece')).toBeInTheDocument();
    });
});