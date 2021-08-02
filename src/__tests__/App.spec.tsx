import {screen, within} from '@testing-library/react';
import {App, Paths} from '../App';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from './util';

jest.mock('../components', () => ({
    Home: () => 'Test Home Component',
    About: () => 'Test About Component',
    Users: () => 'Test Users Component',
    ArtGallery: () => 'Art Gallery Component',
    ArtPiece: () => 'Art Piece Component'
}));

const title = 'some cool title';

jest.mock('../components/ArtGallery/ArtPiece/Context', () => ({
    useArtPiece: () => ({piece: {title}})
}));

describe('the App', () => {
    describe('the header', () => {
        let header: HTMLElement;
        let aside: HTMLElement;

        beforeEach(() => {
            renderWithRouter(<App/>);
        });

        beforeEach(() => {
            header = screen.getByTestId('header');
            aside = screen.getByTestId('aside');
        });

        test('for the home page', () => {
            userEvent.click(within(aside).getByText('Home'));
            expect(within(header).getByText('Home')).toBeInTheDocument();
        });

        test('for the about page', () => {
            userEvent.click(within(aside).getByText('About'));
            expect(within(header).getByText('About')).toBeInTheDocument();
        });

        test('for the users page', () => {
            userEvent.click(within(aside).getByText('Users'));
            expect(within(header).getByText('Users')).toBeInTheDocument();
        });

        test('for the Art Gallery page', () => {
            userEvent.click(within(aside).getByText('Art'));
            expect(within(header).getByText('Art Gallery')).toBeInTheDocument();
        });
    });

    describe('nested navigation', () => {
        test('for the Art work page', () => {
            renderWithRouter(<App/>, Paths.artGalleryPiece);
            const header = screen.getByTestId('header');
            expect(within(header).getByText(title)).toBeInTheDocument();
        });
    });
});