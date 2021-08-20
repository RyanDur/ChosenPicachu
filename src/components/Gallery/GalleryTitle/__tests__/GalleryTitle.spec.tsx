import {renderWithRouter} from '../../../../__tests__/util';
import {GalleryTitle} from '../index';
import {Paths} from '../../../../App';
import {screen} from '@testing-library/react';

const title = 'some cool title';

jest.mock('../../ArtPiece/Context', () => ({
    useArtPiece: () => ({piece: {title}})
}));

describe('gallery title', () => {
    test('viewing', () => {
        renderWithRouter(<GalleryTitle/>, Paths.artGallery);
        expect(screen.getByText('Art Gallery')).toBeInTheDocument();
    });

    test('viewing a piece', () => {
        renderWithRouter(<GalleryTitle/>, `${Paths.artGallery}/123`);
        expect(screen.getByText(title)).toBeInTheDocument();
    });
});