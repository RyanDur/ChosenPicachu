import {screen, waitFor} from '@testing-library/react';
import {Search} from '../index';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../../__tests__/util';
import {data} from '../../../../data';
import {loaded, SearchArtAction} from '../../../../data/actions';
import * as faker from 'faker';
import {Dispatch} from '../../../../data/types';

describe('search', () => {
    const searchWord = faker.lorem.word().toUpperCase();

    beforeEach(() => {
        data.searchForArtOptions = jest.fn((searchString: string, dispatch: Dispatch<SearchArtAction>) =>
            dispatch(loaded([searchWord])));
    });

    it('should give suggestions for completion', async () => {
        renderWithRouter(<Search/>);
        userEvent.type(screen.getByPlaceholderText('Search For'), searchWord);
        await waitFor(() => expect(screen.getByTestId('search-options')).toHaveTextContent(searchWord));
        await waitFor(() => expect(data.searchForArtOptions)
            .toHaveBeenNthCalledWith(searchWord.length, searchWord.toLowerCase(), expect.anything()));
    });

    it('should update the url when the user wants to search', () => {
        const rendered = renderWithRouter(<Search/>);
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('');
        userEvent.type(screen.getByPlaceholderText('Search For'), 'A');
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('?search=A');
    });

    it('should remove the page query param', () => {
        const rendered = renderWithRouter(<Search/>, {params: {page: 1, tab: 'aic'}});
        userEvent.type(screen.getByPlaceholderText('Search For'), 'a');
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('?tab=aic&search=a');
    });

    it('should leave the original query alone when search is empty', () => {
        const rendered = renderWithRouter(<Search/>, {params: {page: 1, search: 'cat'}});
        userEvent.type(screen.getByPlaceholderText('Search For'), '');
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('?page=1&search=cat');
    });

    it('should be able to reset the query', () => {
        const rendered = renderWithRouter(<Search/>, {params: {search: 'cat', tab: 'bat'}});
        userEvent.click(screen.getByTestId('reset-query'));
        expect(rendered().testLocation?.search).toEqual('?tab=bat');
    });
});