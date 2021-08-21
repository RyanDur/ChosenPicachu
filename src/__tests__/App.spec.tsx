import {screen, within} from '@testing-library/react';
import {App, Paths} from '../App';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from './util';

jest.mock('../components', () => ({
    Home: () => 'Test Home Component',
    About: () => 'Test About Component',
    Users: () => 'Test Users Component',
    Gallery: () => 'Art Gallery',
    GalleryTitle: () => 'Art Gallery Title',
    GalleryNav: () => 'Art Navigation',
    SearchRoutes: () => 'Search'
}));

describe('the App', () => {
    let header: HTMLElement;
    let navigation: HTMLElement;
    let main: HTMLElement;

    beforeEach(() => {
        renderWithRouter(<App/>, {initialRoute: Paths.home});
        header = screen.getByTestId('header');
        navigation = screen.getByTestId('navigation');
        main = screen.getByTestId('main');
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
        userEvent.click(within(navigation).getByText('Gallery'));
        const footer = screen.getByTestId('footer');
        expect(within(header).getByText('Art Gallery Title')).toBeInTheDocument();
        expect(within(footer).queryByText('Art Navigation')).toBeInTheDocument();
        expect(within(main).queryByText('Art Gallery')).toBeInTheDocument();
        expect(within(header).getByText('Search')).toBeInTheDocument();
    });
});