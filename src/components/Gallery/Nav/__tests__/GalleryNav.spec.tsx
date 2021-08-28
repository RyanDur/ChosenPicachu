import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {fromAICArt as mockArt, Rendered, renderWithRouter} from '../../../../__tests__/util';
import {GalleryNav} from '../../';
import {Paths} from '../../../../App';
import {toQueryObj} from '../../../../util/URL';

jest.mock('../../Context', () => ({
    useGallery: () => ({art: mockArt})
}));
window.scrollTo = jest.fn();
describe('Gallery Navigation', () => {
    let rendered: () => Rendered;

    describe('without params', () => {
        beforeEach(() => rendered = renderWithRouter(<GalleryNav/>, {path: Paths.artGallery}));

        describe('from the first page', () => {
            it('should be able to goto the next page', () => {
                userEvent.click(screen.getByTestId('next-page'));

                expect(rendered().testLocation?.search).toEqual('?page=2&size=12');
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

                userEvent.click(screen.getByTestId('next-page'));

                expect(rendered().testLocation?.search).toEqual('?page=3&size=12');
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
            });

            it('should not go to the previous page', () =>
                expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument());

            it('should not be able to jump to the first page', () =>
                expect(screen.queryByTestId('first-page')).not.toBeInTheDocument());

            it('should be able to go to the last page', () => {
                userEvent.click(screen.getByTestId('last-page'));
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
                expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages}&size=12`);
                expect(screen.queryByTestId('last-page')).not.toBeInTheDocument();
                expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
                expect(screen.queryByTestId('first-page')).toBeInTheDocument();
                expect(screen.queryByTestId('prev-page')).toBeInTheDocument();
            });
        });

        describe('from the last page', () => {
            beforeEach(() =>
                userEvent.click(screen.getByTestId('last-page')));

            it('should be able to go to the previous page', () => {
                userEvent.click(screen.getByTestId('prev-page'));

                expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages - 1}&size=12`);
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

                userEvent.click(screen.getByTestId('prev-page'));

                expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages - 2}&size=12`);
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
            });

            it('should not go past the last page', () =>
                expect(screen.queryByTestId('next-page')).not.toBeInTheDocument());

            it('should not be able to jump to the last page', () =>
                expect(screen.queryByTestId('last-page')).not.toBeInTheDocument());

            it('should be able to go to the first page', () => {
                userEvent.click(screen.getByTestId('first-page'));
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
                expect(rendered().testLocation?.search).toEqual('?page=1&size=12');
                expect(screen.queryByTestId('last-page')).toBeInTheDocument();
                expect(screen.queryByTestId('next-page')).toBeInTheDocument();
                expect(screen.queryByTestId('first-page')).not.toBeInTheDocument();
                expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
            });
        });

        describe('going to a specific page', () => {
            test('submitting the specified page', () => {
                const pageNumber = String(Math.floor(Math.random() * 1000));
                userEvent.type(screen.getByTestId('go-to'), pageNumber);
                userEvent.click(screen.getByText('Go'));

                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
                expect(rendered().testLocation?.search).toEqual(`?page=${pageNumber}&size=12`);
                expect(screen.getByTestId('go-to')).not.toHaveValue(+pageNumber);
            });

            it('should not go to the top of page when clicking on page number input', () => {
                userEvent.click(screen.getByTestId('go-to'));
                expect(window.scrollTo).not.toHaveBeenCalled();
            });

            it('should not allow a user to go to a page lower than the first', () =>
                expect(screen.getByTestId('go-to')).toHaveAttribute('min', '1'));

            it('should not allow a user to go to a page higher than the last', () =>
                expect(screen.getByTestId('go-to'))
                    .toHaveAttribute('max', `${mockArt.pagination.totalPages}`));
        });

        test('changing the number of elements', () => {
            userEvent.type(screen.getByTestId('per-page'), '2');
            userEvent.click(screen.getByText('Go'));
            expect(toQueryObj(rendered().testLocation?.search || '')).toEqual({page: '1', size: '2'});

            userEvent.type(screen.getByTestId('per-page'), '45');
            userEvent.click(screen.getByText('Go'));
            expect(toQueryObj(rendered().testLocation?.search || '')).toEqual({page: '1', size: '45'});
        });
    });

    describe('with existing params', () => {
        beforeEach(() => rendered = renderWithRouter(<GalleryNav/>, {params: {search: 'q'}}));

        it('should only update the page query', () => {
            userEvent.click(screen.getByTestId('next-page'));
            expect(rendered().testLocation?.search).toEqual('?page=2&size=12&search=q');

            userEvent.click(screen.getByTestId('next-page'));
            expect(rendered().testLocation?.search).toEqual('?page=3&size=12&search=q');

            userEvent.click(screen.getByTestId('last-page'));
            expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages}&size=12&search=q`);

            userEvent.click(screen.getByTestId('prev-page'));
            expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages - 1}&size=12&search=q`);

            userEvent.click(screen.getByTestId('prev-page'));
            expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages -2}&size=12&search=q`);

            userEvent.click(screen.getByTestId('first-page'));
            expect(rendered().testLocation?.search).toEqual('?page=1&size=12&search=q');

            const pageNumber = String(Math.floor(Math.random() * 1000));
            userEvent.type(screen.getByTestId('go-to'), pageNumber);
            userEvent.click(screen.getByText('Go'));
            expect(rendered().testLocation?.search).toEqual(`?page=${pageNumber}&size=12&search=q`);
        });
    });
});