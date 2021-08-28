import {Gallery} from '../index';
import {renderWithRouter} from '../../../__tests__/util';
import {screen} from '@testing-library/react';

jest.mock('../Art', () => ({
    ArtGallery: () => 'Art Gallery',
}));

jest.mock('../ArtPiece', () => ({
    ArtPiece: () => 'Art Piece'
}));

const path = '/a/path';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useRouteMatch: () => ({path: path})
}));

describe('the gallery', () => {
    test('viewing', () => {
        renderWithRouter(<Gallery/>, {path});
        expect(screen.getByText('Art Gallery')).toBeInTheDocument();
    });

    test('viewing a piece', () => {
        renderWithRouter(<Gallery/>, {path, initialRoute: `${path}/123`});
        expect(screen.getByText('Art Piece')).toBeInTheDocument();
    });
});