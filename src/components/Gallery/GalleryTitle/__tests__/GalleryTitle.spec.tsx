import {renderWithRouter} from '../../../../__tests__/util';
import {GalleryTitle} from '../';
import {screen} from '@testing-library/react';
import {Paths} from '../../../../routes/Paths.ts';

const title = 'some cool title';
vi.mock('../../ArtPiece/Context', () => ({
    useArtPiece: () => ({piece: {title}})
}));

const path = Paths.artGallery;
vi.mock('react-router-dom', async () => ({
    ...(await vi.importActual('react-router-dom')),
    useRouteMatch: () => ({path: path})
}));

describe('gallery title', () => {
    test('viewing', () => {
        renderWithRouter(<GalleryTitle/>, {path});
        expect(screen.getByText('Gallery')).toBeInTheDocument();
    });

    test('viewing a piece', () => {
        renderWithRouter(<GalleryTitle/>, {path:`${path}/123`});
        expect(screen.getByText(title)).toBeInTheDocument();
    });
});
