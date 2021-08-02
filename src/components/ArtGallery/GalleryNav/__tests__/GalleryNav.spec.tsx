import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {art} from '../../../../__tests__/util';
import * as H from 'history';
import {MemoryRouter, Route} from 'react-router-dom';
import {Paths} from '../../../../App';
import {GalleryNav} from '../../';

const mockArt = art;
jest.mock('../../Context', () => ({
    useArtGallery: () => ({art: mockArt})
}));
window.scrollTo = jest.fn();
describe('Gallery Navigation', () => {
    let testLocation: H.Location;

    beforeEach(() => {
        render(<MemoryRouter initialEntries={[`${Paths.artGallery}`]}>
            <GalleryNav/>
            <Route
                path="*"
                render={({location}) => {
                    testLocation = location;
                    return null;
                }}
            />
        </MemoryRouter>);
    });

    describe('from the first page', () => {
        it('should be able to goto the next page', () => {
            act(() => userEvent.click(screen.getByTestId('next-page')));

            expect(testLocation.search).toEqual('?page=2');
            expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

            act(() => userEvent.click(screen.getByTestId('next-page')));

            expect(testLocation.search).toEqual('?page=3');
            expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
        });

        it('should not go to the previous page', () => {
            expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
        });

        it('should not be able to jump to the first page', () => {
            expect(screen.queryByTestId('first-page')).not.toBeInTheDocument();
        });

        it('should be able to go to the last page', () => {
            act(() => userEvent.click(screen.getByTestId('last-page')));
            expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
            expect(testLocation.search).toEqual(`?page=${art.pagination.totalPages}`);
            expect(screen.queryByTestId('last-page')).not.toBeInTheDocument();
            expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
            expect(screen.queryByTestId('first-page')).toBeInTheDocument();
            expect(screen.queryByTestId('prev-page')).toBeInTheDocument();
        });
    });

    describe('from the last page', () => {
        beforeEach(() => {
            act(() => userEvent.click(screen.getByTestId('last-page')));
        });

        it('should be able to go to the previous page', () => {
            act(() => userEvent.click(screen.getByTestId('prev-page')));

            expect(testLocation.search).toEqual(`?page=${art.pagination.totalPages - 1}`);
            expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

            act(() => userEvent.click(screen.getByTestId('prev-page')));

            expect(testLocation.search).toEqual(`?page=${art.pagination.totalPages - 2}`);
            expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
        });

        it('should not go past the last page', () => {
            expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
        });

        it('should not be able to jump to the last page', () => {
            expect(screen.queryByTestId('last-page')).not.toBeInTheDocument();
        });

        it('should be able to go to the first page', () => {
            act(() => userEvent.click(screen.getByTestId('first-page')));
            expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
            expect(testLocation.search).toEqual('?page=1');
            expect(screen.queryByTestId('last-page')).toBeInTheDocument();
            expect(screen.queryByTestId('next-page')).toBeInTheDocument();
            expect(screen.queryByTestId('first-page')).not.toBeInTheDocument();
            expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
        });
    });
});