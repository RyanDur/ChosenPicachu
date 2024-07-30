import {screen, waitFor} from '@testing-library/react';
import {Search} from '../index';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../../__tests__/util';
import {data} from '../../../../data';
import {asyncSuccess} from '@ryandur/sand';
import {Source} from '../../../../data/artGallery/types/resource';
import {faker} from '@faker-js/faker';
import {Paths} from '../../../../routes/Paths.ts';
import {Explanation, HTTPError} from '../../../../data/types.ts';
import {SearchOptions} from '../../../../data/artGallery/types/response.ts';

const success = asyncSuccess;

describe('search', () => {
  const searchWord = faker.lorem.word().toUpperCase();

  beforeEach(() => {
    data.artGallery.searchForArt = vi.fn(() =>
      success<SearchOptions, Explanation<HTTPError>>([searchWord]));
  });

  it('should give suggestions for completion', async () => {
    renderWithRouter(<Search/>, {params: {tab: Source.AIC}});

    await userEvent.type(screen.getByLabelText('Search For'), searchWord);

    await waitFor(() => expect(screen.getByTestId('search-options')).toHaveTextContent(searchWord));
    await waitFor(() => expect(data.artGallery.searchForArt)
      .toHaveBeenCalledWith({search: searchWord.toLowerCase(), source: Source.AIC}));
  });

  it('should update the url when the user wants to search', async () => {
    const rendered = renderWithRouter(<Search/>);
    await userEvent.click(screen.getByTestId('submit-query'));

    expect(rendered().testLocation?.search).toEqual('?');

    await userEvent.type(screen.getByLabelText('Search For'), 'A');
    await userEvent.click(screen.getByTestId('submit-query'));

    await waitFor(() => expect(rendered().testLocation?.search).toEqual('?search=A'));
    expect(rendered().testLocation?.pathname).toEqual(Paths.artGallery);
  });

  it('should remove the page query param', async () => {
    const rendered = renderWithRouter(<Search/>, {params: {page: 1, tab: 'aic'}});

    await userEvent.type(screen.getByLabelText('Search For'), 'a');
    await userEvent.click(screen.getByTestId('submit-query'));

    expect(rendered().testLocation?.search).toEqual('?page=1&tab=aic&search=a');
  });

  it('should leave the original query alone when search is empty', async () => {
    const rendered = renderWithRouter(<Search/>, {params: {page: 1, search: 'cat', tab: 'some-tab'}});

    await userEvent.click(screen.getByTestId('submit-query'));

    expect(rendered().testLocation?.search).toEqual('?page=1&search=cat&tab=some-tab');
  });

  it('should be able to reset the query', async () => {
    const rendered = renderWithRouter(<Search/>, {params: {search: 'cat', tab: 'bat'}});

    await userEvent.click(screen.getByTestId('reset-query'));

    expect(rendered().testLocation?.search).toEqual('?tab=bat');
  });
});
