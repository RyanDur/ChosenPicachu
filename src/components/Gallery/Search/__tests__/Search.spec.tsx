import {screen, waitFor} from '@testing-library/react';
import {Search} from '../index';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../../__tests__/util';
import {Source} from '../../resource/types/resource';
import {faker} from '@faker-js/faker';
import {Paths} from '../../../../routes/Paths';
import {AICSearchResponse} from '../../resource/aic/types';

describe('search', () => {
  const searchWord = faker.lorem.word().toUpperCase();
  const searchResponse: AICSearchResponse = {
    pagination: {
      total: 5,
      limit: 2,
      total_pages: 5,
      current_page: 1
    },
    data: [{suggest_autocomplete_all: [{}, {input: [searchWord]}]}]
  };

  beforeEach(() => {
    fetchMock.mockResponse(JSON.stringify(searchResponse));
  });

  it('should give suggestions for completion', async () => {
    renderWithRouter(<Search/>, {params: {tab: Source.AIC}});

    await userEvent.type(screen.getByLabelText('Search For'), searchWord);

    await waitFor(() => expect(screen.getByTestId('search-options')).toHaveTextContent(searchWord));
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
