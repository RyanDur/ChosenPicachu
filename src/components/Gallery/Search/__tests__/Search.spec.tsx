import {screen} from '@testing-library/react';
import {Search} from '../index';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../../__tests__/util';
import {data} from '../../../../data';
import {Dispatch} from '../../../UserInfo/types';
import {onSuccess, SearchArtAction} from '../../../../data/actions';
import * as faker from 'faker';
import {Paths} from '../../../../App';

describe('search', () => {
    const searchWord = faker.lorem.word().toUpperCase();

    beforeEach(() => {
        data.searchForArtOptions = jest.fn((searchString: string, dispatch: Dispatch<SearchArtAction>) => {
            dispatch(onSuccess([searchWord]));
        });
    });

    it('should give suggestions for completion', () => {
        renderWithRouter(<Search/>);
        userEvent.type(screen.getByPlaceholderText('Search For'), searchWord);
        expect(screen.getByTestId('search-options')).toHaveTextContent(searchWord);
        expect(data.searchForArtOptions).toHaveBeenNthCalledWith(searchWord.length, searchWord.toLowerCase(), expect.anything());
    });

    it('should update the url when the user wants to search', () => {
        const rendered = renderWithRouter(<Search/>);
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('');
        userEvent.type(screen.getByPlaceholderText('Search For'), 'A');
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('?search=A');
    });

    it('should remove the original query params', () => {
        const rendered = renderWithRouter(<Search/>, Paths.home, 'page=1');
        userEvent.type(screen.getByPlaceholderText('Search For'), 'a');
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('?search=a');
    });

    it('should leave the original query alone when search is empty', () => {
        const rendered = renderWithRouter(<Search/>, Paths.home, 'page=1&search=cat');
        userEvent.type(screen.getByPlaceholderText('Search For'), '');
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('?page=1&search=cat');
    });

    it('should be able to reset the query', () => {
        const rendered = renderWithRouter(<Search/>, Paths.home, 'search=cat');
        userEvent.click(screen.getByTestId('reset-query'));
        expect(rendered().testLocation?.search).toEqual('');
    });
});