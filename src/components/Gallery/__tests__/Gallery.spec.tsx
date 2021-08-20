import {Gallery} from '../index';
import {renderWithRouter} from '../../../__tests__/util';
import {screen} from '@testing-library/react';

jest.mock('../Art', () => ({
    ArtGallery: () => 'Art Gallery',
}));

jest.mock('../ArtPiece', () => ({
    ArtPiece: () => 'Art Piece'
}));

const initialRoute = '/a/path';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useRouteMatch: () => ({path: initialRoute})
}));

describe('the gallery', () => {
    test('viewing', () => {
        renderWithRouter(<Gallery/>, {initialRoute});
        expect(screen.getByText('Art Gallery')).toBeInTheDocument();
    });

    test('viewing a piece', () => {
        renderWithRouter(<Gallery/>, {initialRoute: `${initialRoute}/123`});
        expect(screen.getByText('Art Piece')).toBeInTheDocument();
    });
});