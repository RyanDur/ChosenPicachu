import {screen} from '@testing-library/react';
import {App} from '../App';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from './util';

jest.mock('../components', () => ({
    Home: () => 'Test Home Component',
    About: () => 'Test About Component',
    Users: () => 'Test Users Component',
    ArtGallery: () => 'Art Gallery Component'
}));

describe('the App', () => {
    describe('navigation', () => {
        beforeEach(() => {
            renderWithRouter(<App/>);
        });

        test('to the home page', () => {
            userEvent.click(screen.getByText('Home'));
            expect(screen.getByText('Test Home Component')).toBeInTheDocument();
        });

        test('to the about page', () => {
            userEvent.click(screen.getByText('About'));
            expect(screen.getByText('Test About Component')).toBeInTheDocument();
        });

        test('to users', () => {
            userEvent.click(screen.getByText('Users'));
            expect(screen.getByText('Test Users Component')).toBeInTheDocument();
        });

        test('to art gallery', () => {
            userEvent.click(screen.getByText('Art'));
            expect(screen.getByText('Art Gallery Component')).toBeInTheDocument();
        });
    });
});