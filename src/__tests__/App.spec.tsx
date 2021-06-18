import {screen} from '@testing-library/react';
import {App, Paths} from '../App';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from './util';

describe('the App', () => {
    describe('header', () => {
        test('should have a name for the home page', () => {
            renderWithRouter(<App/>, Paths.home);
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });

        test('for the about page', () => {
            renderWithRouter(<App/>, Paths.about);
            expect(screen.getByText('About Page')).toBeInTheDocument();
        });
    });

    describe('navigation', () => {
        beforeEach(() => {
            renderWithRouter(<App/>);
        });

        test('to the home page', () => {
            userEvent.click(screen.getByText('Home'));
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });

        test('to the about page', () => {
            userEvent.click(screen.getByText('About'));
            expect(screen.getByText('About Page')).toBeInTheDocument();
        });
    });
});