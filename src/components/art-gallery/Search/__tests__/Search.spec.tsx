import {anyRequestRespondsWith} from '../../../../__tests__/util/server';
import {screen, waitFor} from '@testing-library/react';
import {Search} from '@components/art-gallery/Search/index';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../../__tests__/util';
import {Source} from '@components/art-gallery/museums/types/resource';
import {faker} from '@faker-js/faker';
import {Paths} from '@libraries/routing/Paths';
import {AICSearchResponse} from '@components/art-gallery/museums/aic/types';

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
    anyRequestRespondsWith(JSON.stringify(searchResponse));
  });

  it('should give suggestions for completion', async () => {
    renderWithRouter(<Search/>, {params: {tab: Source.AIC}});

    await userEvent.type(screen.getByLabelText(/Search For/), searchWord);

    await waitFor(() => expect(screen.getByTestId('search-options')).toHaveTextContent(searchWord));
  });

  it('should update the url when the user wants to search', async () => {
    renderWithRouter(<Search/>);
    await userEvent.click(screen.getByTestId('submit-query'));

    expect(screen.getByTestId('subject-url-search')).not.toHaveTextContent('search');

    await userEvent.type(screen.getByLabelText(/Search For/), 'A');
    await userEvent.click(screen.getByTestId('submit-query'));

    await waitFor(() => expect(screen.getByTestId('subject-url-search')).toHaveTextContent('?search=A'));
    expect(screen.getByTestId('subject-url-path').innerHTML).toEqual(Paths.artGallery);
  });

  it('should remove the page query param', async () => {
    renderWithRouter(<Search/>, {params: {page: 1, tab: 'aic'}});

    await userEvent.type(screen.getByLabelText(/Search For/), 'a');
    await userEvent.click(screen.getByTestId('submit-query'));

    expect(screen.getByTestId('subject-url-search')).toHaveTextContent('?page=1&tab=aic&search=a');
  });

  it('should leave the original query alone when search is empty', async () => {
    renderWithRouter(<Search/>, {params: {page: 1, search: 'cat', tab: 'some-tab'}});

    await userEvent.click(screen.getByTestId('submit-query'));

    expect(screen.getByTestId('subject-url-search')).toHaveTextContent('?page=1&search=cat&tab=some-tab');
  });

  it('should be able to reset the query', async () => {
    renderWithRouter(<Search/>, {params: {search: 'cat', tab: 'bat'}});

    await userEvent.click(screen.getByTestId('reset-query'));

    await waitFor(() => expect(screen.getByTestId('subject-url-search')).toHaveTextContent('tab=bat'));
  });
});
