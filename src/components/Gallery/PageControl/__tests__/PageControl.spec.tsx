import userEvent from '@testing-library/user-event';
import {screen} from '@testing-library/react';
import {toQueryObj} from '../../../../util/URL';
import {fromAICArt as mockArt, Rendered, renderWithRouter} from '../../../../__tests__/util';
import {Paths} from '../../../../App';
import {PageControl} from '../index';
import { Source } from '../../../../data/sources/types';

jest.mock('../../Context', () => ({
    useGallery: () => ({art: mockArt})
}));
window.scrollTo = jest.fn();
describe('The page controls', () => {
    let rendered: () => Rendered;


    describe('going to a specific page', () => {
        beforeEach(() => rendered = renderWithRouter(<PageControl/>, {path: Paths.artGallery}));
        test('submitting the specified page', () => {
            const pageNumber = String(Math.floor(Math.random() * 1000));
            userEvent.type(screen.getByTestId('go-to'), pageNumber);
            userEvent.click(screen.getByText('Go'));

            expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
            expect(rendered().testLocation?.search).toEqual(`?page=${pageNumber}`);
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

    describe('changing the number of elements', () => {
        it('should allow the user to change the elements per page', () => {
            rendered = renderWithRouter(<PageControl/>, {path: Paths.artGallery});
            userEvent.type(screen.getByTestId('per-page'), '2');
            userEvent.click(screen.getByText('Go'));
            expect(toQueryObj(rendered().testLocation?.search || '')).toEqual({size: 2});

            userEvent.type(screen.getByTestId('per-page'), '45');
            userEvent.click(screen.getByText('Go'));
            expect(toQueryObj(rendered().testLocation?.search || '')).toEqual({size: 45});
        });

        it.each`
        input  | size
        ${1}   | ${1}
        ${2}   | ${2}
        ${3}   | ${3}
        ${4}   | ${4}
        ${5}   | ${5}
        ${6}   | ${6}
        ${7}   | ${7}
        ${8}   | ${8}
        ${9}   | ${9}
        ${10}  | ${10}
        ${12}  | ${10}
        ${15}  | ${20}
        ${23}  | ${20}
        ${27}  | ${30}
        ${31}  | ${30}
        ${38}  | ${40}
        ${42}  | ${40}
        ${47}  | ${50}
        ${54}  | ${50}
        ${55}  | ${60}
        ${61}  | ${60}
        ${67}  | ${70}
        ${72}  | ${70}
        ${79}  | ${80}
        ${83}  | ${80}
        ${88}  | ${90}
        ${92}  | ${90}
        ${97}  | ${100}
        ${100} | ${100}
        `('should change input: $input to size: $size when rikjs', ({input, size}) => {
            rendered = renderWithRouter(<PageControl/>, {
                path: Paths.artGallery,
                params: {tab: Source.RIJK, page: 1}
            });
            userEvent.type(screen.getByTestId('per-page'), `${input}`);
            expect(screen.getByTestId('per-page')).toHaveDisplayValue(size);
            userEvent.click(screen.getByText('Go'));
            expect(toQueryObj(rendered().testLocation?.search || '')).toEqual({
                page: 1,
                size,
                tab: Source.RIJK
            });
        });
    });
});