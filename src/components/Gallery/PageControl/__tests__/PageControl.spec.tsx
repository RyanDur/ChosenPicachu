import userEvent from '@testing-library/user-event';
import {screen} from '@testing-library/react';
import {toQueryObj} from '../../../../util/URL';
import {fromAICArt as mockArt, Rendered, renderWithRouter} from '../../../../__tests__/util';
import {GalleryNav} from '../../Nav';
import {Paths} from '../../../../App';

jest.mock('../../Context', () => ({
    useGallery: () => ({art: mockArt})
}));
window.scrollTo = jest.fn();
describe('The page controls', () => {
    let rendered: () => Rendered;

    beforeEach(() => rendered = renderWithRouter(<GalleryNav/>, {path: Paths.artGallery}));

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
        expect(toQueryObj(rendered().testLocation?.search || '')).toEqual({page: 1, size: 2});

        userEvent.type(screen.getByTestId('per-page'), '45');
        userEvent.click(screen.getByText('Go'));
        expect(toQueryObj(rendered().testLocation?.search || '')).toEqual({page: 1, size: 45});
    });
});