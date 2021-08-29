import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {fromAICArt as mockArt, Rendered, renderWithRouter} from '../../../../__tests__/util';
import {GalleryNav} from '../../';
import {Paths} from '../../../../App';

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

                expect(rendered().testLocation?.search).toEqual('?page=2');
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

                userEvent.click(screen.getByTestId('next-page'));

                expect(rendered().testLocation?.search).toEqual('?page=3');
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
            });

            it('should not go to the previous page', () =>
                expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument());

            it('should not be able to jump to the first page', () =>
                expect(screen.queryByTestId('first-page')).not.toBeInTheDocument());

            it('should be able to go to the last page', () => {
                userEvent.click(screen.getByTestId('last-page'));
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
                expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages}`);
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

                expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages - 1}`);
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

                userEvent.click(screen.getByTestId('prev-page'));

                expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages - 2}`);
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
            });

            it('should not go past the last page', () =>
                expect(screen.queryByTestId('next-page')).not.toBeInTheDocument());

            it('should not be able to jump to the last page', () =>
                expect(screen.queryByTestId('last-page')).not.toBeInTheDocument());

            it('should be able to go to the first page', () => {
                userEvent.click(screen.getByTestId('first-page'));
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
                expect(rendered().testLocation?.search).toEqual('?page=1');
                expect(screen.queryByTestId('last-page')).toBeInTheDocument();
                expect(screen.queryByTestId('next-page')).toBeInTheDocument();
                expect(screen.queryByTestId('first-page')).not.toBeInTheDocument();
                expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
            });
        });
    });

    describe('with existing params', () => {
        beforeEach(() => rendered = renderWithRouter(<GalleryNav/>, {params: {search: 'q'}}));

        it('should only update the page query', () => {
            userEvent.click(screen.getByTestId('next-page'));
            expect(rendered().testLocation?.search).toEqual('?page=2&search=q');

            userEvent.click(screen.getByTestId('next-page'));
            expect(rendered().testLocation?.search).toEqual('?page=3&search=q');

            userEvent.click(screen.getByTestId('last-page'));
            expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages}&search=q`);

            userEvent.click(screen.getByTestId('prev-page'));
            expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages - 1}&search=q`);

            userEvent.click(screen.getByTestId('prev-page'));
            expect(rendered().testLocation?.search).toEqual(`?page=${mockArt.pagination.totalPages - 2}&search=q`);

            userEvent.click(screen.getByTestId('first-page'));
            expect(rendered().testLocation?.search).toEqual('?page=1&search=q');
        });
    });

    describe('page information', () => {
        it.each `
        page | size | first | last
        ${1} | ${12}| ${1}  | ${12} 
        ${2} | ${12}| ${13} | ${24} 
        ${3} | ${12}| ${25} | ${36} 
        ${83} | ${12}| ${985} | ${996} 
        ${84} | ${12}| ${997} | ${1000} 
        `('should inform what records are displayed', ({page, size, first, last}) => {
            renderWithRouter(<GalleryNav/>, {params: {page, size}});
            expect(screen.getByTestId('info')).toHaveTextContent(`${first} - ${last}of${mockArt.pagination.total}`);
        });
    });
});