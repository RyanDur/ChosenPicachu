import {screen, within} from '@testing-library/react';
import {App, Paths} from '../App';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from './util';

jest.mock('../components', () => ({
    Home: () => 'Test Home Component',
    About: () => 'Test About Component',
    Users: () => 'Test Users Component',
    ArtGallery: () => 'Art Gallery Component',
    ArtPiece: () => 'Art Piece Component',
    GalleryNav: () => 'Gallery Navigation',
    Search: () => 'Search'
}));

const title = 'some cool title';

jest.mock('../components/Gallery/ArtPiece/Context', () => ({
    useArtPiece: () => ({piece: {title}})
}));

describe('the App', () => {
    describe('the header', () => {
        let header: HTMLElement;
        let navigation: HTMLElement;
        let footer: HTMLElement;

        beforeEach(() => renderWithRouter(<App/>, Paths.home));

        beforeEach(() => {
            header = screen.getByTestId('header');
            navigation = screen.getByTestId('navigation');
            footer = screen.getByTestId('footer');
        });

        test('for the home page', () => {
            userEvent.click(within(navigation).getByText('Home'));
            expect(within(header).getByText('Home')).toBeInTheDocument();
        });

        test('for the about page', () => {
            userEvent.click(within(navigation).getByText('About'));
            expect(within(header).getByText('About')).toBeInTheDocument();
        });

        test('for the users page', () => {
            userEvent.click(within(navigation).getByText('Users'));
            expect(within(header).getByText('Users')).toBeInTheDocument();
        });

        test('for the Art Gallery page', () => {
            userEvent.click(within(navigation).getByText('Art'));
            expect(within(header).getByText('Art Gallery')).toBeInTheDocument();
            expect(within(footer).queryByText('Gallery Navigation')).toBeInTheDocument();
            expect(within(header).getByText('Search')).toBeInTheDocument();
        });
    });

    describe('nested navigation', () => {
        test('for the Art work page', () => {
            renderWithRouter(<App/>, Paths.artGalleryPiece);
            const header = screen.getByTestId('header');
            expect(within(header).getByText(title)).toBeInTheDocument();
            expect(within(header).getByText('Search')).toBeInTheDocument();
        });
    });
});