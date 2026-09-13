import {GalleryProviders} from '@pages/Gallery';
import {TestApp} from '@test-support/TestApp';
import {anyRequestRespondsWith} from '@test-support/server';
import {render, screen, waitFor} from '@testing-library/react';
import {Search} from '@components/art-gallery/Search';
import userEvent from '@testing-library/user-event';
import {Source} from '@components/art-gallery/museums/types/resource';
import {faker} from '@faker-js/faker';
import {Paths} from '@pages/Paths';
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
    render(<TestApp at={`${Paths.artGallery}?tab=${Source.AIC}`}><GalleryProviders><Search/></GalleryProviders></TestApp>);

    await userEvent.type(screen.getByLabelText(/Search For/), searchWord);

    await waitFor(() => expect(screen.getByRole('listbox', {hidden: true})).toHaveTextContent(searchWord));
  });

  it('should update the url when the user wants to search', async () => {
    render(<TestApp at={Paths.artGallery}><GalleryProviders><Search/></GalleryProviders></TestApp>);
    await userEvent.click(screen.getByRole('button', {name: 'submit search'}));

    expect(screen.getByLabelText('url search')).not.toHaveTextContent('search');

    await userEvent.type(screen.getByLabelText(/Search For/), 'A');
    await userEvent.click(screen.getByRole('button', {name: 'submit search'}));

    await waitFor(() => expect(screen.getByLabelText('url search')).toHaveTextContent('?search=A'));
    expect(screen.getByRole('status', {name: 'url path'})).toHaveTextContent(new RegExp(`^${Paths.artGallery}$`));
  });

  it('a search keeps the page and museum it was made on', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=1&tab=aic`}><GalleryProviders><Search/></GalleryProviders></TestApp>);

    await userEvent.type(screen.getByLabelText(/Search For/), 'a');
    await userEvent.click(screen.getByRole('button', {name: 'submit search'}));

    expect(screen.getByLabelText('url search')).toHaveTextContent('?page=1&tab=aic&search=a');
  });

  it('should leave the original query alone when search is empty', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=1&search=cat&tab=some-tab`}><GalleryProviders><Search/></GalleryProviders></TestApp>);

    await userEvent.click(screen.getByRole('button', {name: 'submit search'}));

    expect(screen.getByLabelText('url search')).toHaveTextContent('?page=1&search=cat&tab=some-tab');
  });

  it('should be able to reset the query', async () => {
    render(<TestApp at={`${Paths.artGallery}?search=cat&tab=bat`}><GalleryProviders><Search/></GalleryProviders></TestApp>);

    await userEvent.click(screen.getByRole('button', {name: 'reset search'}));

    await waitFor(() => expect(screen.getByLabelText('url search')).toHaveTextContent('tab=bat'));
  });
});
