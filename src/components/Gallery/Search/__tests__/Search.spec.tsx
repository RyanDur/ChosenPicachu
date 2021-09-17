import {screen, waitFor} from '@testing-library/react';
import {Search} from '../index';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../../__tests__/util';
import {data} from '../../../../data';
import * as faker from 'faker';
import {Paths} from '../../../../App';
import {Source} from '../../../../data/artGallery/types';
import {loaded} from '@ryandur/sand';

describe('search', () => {
    const searchWord = faker.lorem.word().toUpperCase();

    beforeEach(() => {
        data.artGallery.searchForArt = jest.fn(() => ({
            on: (dispatch) => dispatch(loaded([searchWord]))
        }));
    });

    it('should give suggestions for completion', async () => {
        renderWithRouter(<Search/>, {params: {tab: Source.AIC}});
        userEvent.paste(screen.getByLabelText('Search For'), searchWord);
        await waitFor(() => expect(screen.getByTestId('search-options')).toHaveTextContent(searchWord));
        expect(data.artGallery.searchForArt)
            .toHaveBeenCalledWith({search: searchWord.toLowerCase(), source: Source.AIC});
    });

    it('should update the url when the user wants to search', () => {
        const rendered = renderWithRouter(<Search/>);
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('');
        userEvent.type(screen.getByLabelText('Search For'), 'A');
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('?search=A');
        expect(rendered().testLocation?.pathname).toEqual(Paths.artGallery);
    });

    it('should remove the page query param', () => {
        const rendered = renderWithRouter(<Search/>, {params: {page: 1, tab: 'aic'}});
        userEvent.type(screen.getByLabelText('Search For'), 'a');
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('?page=1&tab=aic&search=a');
    });

    it('should leave the original query alone when search is empty', () => {
        const rendered = renderWithRouter(<Search/>, {params: {page: 1, search: 'cat', tab: 'some-tab'}});
        userEvent.type(screen.getByLabelText(/Search For/), '');
        userEvent.click(screen.getByTestId('submit-query'));
        expect(rendered().testLocation?.search).toEqual('?page=1&search=cat&tab=some-tab');
    });

    it('should be able to reset the query', () => {
        const rendered = renderWithRouter(<Search/>, {params: {search: 'cat', tab: 'bat'}});
        userEvent.click(screen.getByTestId('reset-query'));
        expect(rendered().testLocation?.search).toEqual('?tab=bat');
    });
});