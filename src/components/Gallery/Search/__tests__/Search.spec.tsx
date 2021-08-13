import {act, screen} from '@testing-library/react';
import {Search} from '../index';
import userEvent from '@testing-library/user-event';
import {Rendered, renderWithRouter} from '../../../../__tests__/util';
import {data} from '../../../../data';
import {Dispatch} from '../../../UserInfo/types';
import {onSuccess, SearchArtAction} from '../../../../data/actions';
import * as faker from 'faker';

describe('search', () => {
    const searchWord = faker.lorem.word();
    let rendered: () => Rendered;

    beforeEach(() => {
        data.searchForArtOptions = (searchString: string, dispatch: Dispatch<SearchArtAction>) =>
            dispatch(onSuccess([searchWord]));
        rendered = renderWithRouter(<Search/>);
    });

    it('should give suggestions for completion', () => {
        userEvent.type(screen.getByLabelText('Search'), 'a');
        expect(screen.getByTestId('search-options')).toHaveTextContent(searchWord);
    });

    it('should update the url when the user wants to search', () => {
        userEvent.type(screen.getByLabelText('Search For'), 'a');
        act(() => userEvent.click(screen.getByText('Search')));
        expect(rendered().testLocation?.search).toEqual('?search=a');
    });
});