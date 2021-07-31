import {screen} from '@testing-library/react';
import {renderWithRouter} from '../../../__tests__/util';
import {Paths} from '../../../App';
import {Header} from '../index';

const title = 'some cool title';

jest.mock('../../ArtGallery/ArtPiece/Context', () => ({
    useArtPiece: () => ({piece: {title}})
}));

describe('the header', () => {
    test('for the home page', () => {
        renderWithRouter(<Header/>, Paths.home);
        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    test('for the about page', () => {
        renderWithRouter(<Header/>, Paths.about);
        expect(screen.getByText('About Page')).toBeInTheDocument();
    });

    test('for the users page', () => {
        renderWithRouter(<Header/>, Paths.users);
        expect(screen.getByText('Users Page')).toBeInTheDocument();
    });

    test('for the Art Gallery page', () => {
        renderWithRouter(<Header/>, Paths.artGallery);
        expect(screen.getByText('Art Gallery Page')).toBeInTheDocument();
    });

    test('for the Art work page', () => {
        renderWithRouter(<Header/>, Paths.artGalleryPiece);
        expect(screen.getByText(title)).toBeInTheDocument();
    });
});