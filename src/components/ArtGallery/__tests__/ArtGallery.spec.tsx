import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ArtGallery} from '..';
import {data} from '../../../data';
import {Art} from '../../../data/types';
import {Consumer} from '../../UserInfo/types';
import {art} from '../../../__tests__/util';
import {MemoryRouter, Route} from 'react-router-dom';
import {Paths} from '../../../App';
import * as H from 'history';


describe('the art gallery', () => {
    let testLocation: H.Location;
    let pageNumber: number | undefined;

    beforeEach(() => {
        data.getAllArt = (consume: Consumer<Art>, page) => {
            consume(art);
            pageNumber = page;
        };
        render(<MemoryRouter initialEntries={[`/${Paths.artGallery}`]}>
            <ArtGallery/>
            <Route
                path="*"
                render={({location}) => {
                    testLocation = location;
                    return null;
                }}
            />
        </MemoryRouter>);
    });

    afterEach(() => pageNumber = 0);

    it('should contain art', () =>
        expect(screen.getAllByTestId('piece').length).toEqual(art.pagination.limit));

    describe('pagination', () => {
        it('should be able to goto the next page', () => {
            act(() => userEvent.click(screen.getByTestId('next-page')));

            expect(testLocation.search).toEqual('?page=2');
            expect(pageNumber).toEqual(2);

            act(() => userEvent.click(screen.getByTestId('next-page')));

            expect(testLocation.search).toEqual('?page=3');
            expect(pageNumber).toEqual(3);
        });

        it('should not go past the last page', () => {
            [...Array(art.pagination.totalPages - 1)].forEach(() => {
                act(() => userEvent.click(screen.getByTestId('next-page')));
            });

            expect(pageNumber).toEqual(art.pagination.totalPages);

            expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
        });

        it('should not go to the previous page', () => {
            expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
        });

        it('should go to the previous page from the next', () => {
            act(() => userEvent.click(screen.getByTestId('next-page')));
            expect(pageNumber).toEqual(2);
            act(() => userEvent.click(screen.getByTestId('prev-page')));
            expect(pageNumber).toEqual(1);
        });
    });
});