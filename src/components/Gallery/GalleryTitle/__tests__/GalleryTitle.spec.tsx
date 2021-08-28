import {renderWithRouter} from '../../../../__tests__/util';
import {GalleryTitle} from '../';
import {screen} from '@testing-library/react';

const title = 'some cool title';
jest.mock('../../ArtPiece/Context', () => ({
    useArtPiece: () => ({piece: {title}})
}));

const path = '/a/path';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useRouteMatch: () => ({path: path})
}));

describe('gallery title', () => {
    test('viewing', () => {
        renderWithRouter(<GalleryTitle/>, {path});
        expect(screen.getByText('Gallery')).toBeInTheDocument();
    });

    test('viewing a piece', () => {
        renderWithRouter(<GalleryTitle/>, {path, initialRoute: `${path}/123`});
        expect(screen.getByText(title)).toBeInTheDocument();
    });
});