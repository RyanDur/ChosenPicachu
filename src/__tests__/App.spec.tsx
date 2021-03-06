import {screen, within} from '@testing-library/react';
import {App, Paths} from '../App';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from './util';
import * as faker from 'faker';

jest.mock('../components', () => ({
    Home: () => 'Test Home Component',
    About: () => 'Test About Component',
    Users: () => 'Test Users Component',
    Gallery: () => 'Art Gallery',
    GalleryTitle: () => 'Art Gallery Title',
    GalleryNav: () => 'Art Navigation',
    SearchRoutes: () => 'Search',
    PageControl: () => 'Gallery Filter'
}));

describe('the App', () => {
    let header: HTMLElement;
    let navigation: HTMLElement;
    let main: HTMLElement;

    describe('navigating to known paths', () => {
        beforeEach(() => {
            renderWithRouter(<App/>, {path: Paths.home});
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
            const galleryFilter = screen.getByTestId('filter');
            expect(within(header).getByText('Art Gallery Title')).toBeInTheDocument();
            expect(within(footer).queryByText('Art Navigation')).toBeInTheDocument();
            expect(within(main).queryByText('Art Gallery')).toBeInTheDocument();
            expect(within(galleryFilter).queryByText('Gallery Filter')).toBeInTheDocument();
            expect(within(header).getByText('Search')).toBeInTheDocument();
        });
    });

    test('default path', () => {
        const rendered = renderWithRouter(<App/>, {path: `/${faker.lorem.word()}`});
        expect(rendered().testLocation?.pathname).toEqual(Paths.home);
    });
});