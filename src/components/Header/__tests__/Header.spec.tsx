import {screen} from '@testing-library/react';
import {renderWithRouter} from '../../../__tests__/util';
import {Paths} from '../../../App';
import {Title} from '../index';

const title = 'some cool title';

jest.mock('../../ArtGallery/ArtPiece/Context', () => ({
    useArtPiece: () => ({piece: {title}})
}));

describe('the header', () => {
    test('for the home page', () => {
        renderWithRouter(<Title/>, Paths.home);
        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    test('for the about page', () => {
        renderWithRouter(<Title/>, Paths.about);
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    test('for the users page', () => {
        renderWithRouter(<Title/>, Paths.users);
        expect(screen.getByText('Users')).toBeInTheDocument();
    });

    test('for the Art Gallery page', () => {
        renderWithRouter(<Title/>, Paths.artGallery);
        expect(screen.getByText('Art Gallery')).toBeInTheDocument();
    });

    test('for the Art work page', () => {
        renderWithRouter(<Title/>, Paths.artGalleryPiece);
        expect(screen.getByText(title)).toBeInTheDocument();
    });
});