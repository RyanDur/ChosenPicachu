import {TestApp} from '@test-support/TestApp';
import {anyRequestRespondsWith, server} from '@test-support/server';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Source} from '@components/art-gallery/museums/types/resource';
import {faker} from '@faker-js/faker';
import {Paths} from '@pages/Paths';
import {AICSearchResponse} from '@components/art-gallery/museums/aic/types';
import {heldAICSuggestions} from '@components/art-gallery/__test_support';

const suggesting = (word: string): AICSearchResponse => ({
  pagination: {total: 1, limit: 1, total_pages: 1, current_page: 1},
  data: [{suggest_autocomplete_all: [{}, {input: [word]}]}]
});

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
    render(<TestApp at={`${Paths.artGallery}?tab=${Source.AIC}`}/>);

    await userEvent.type(screen.getByLabelText(/Search For/), searchWord);

    await waitFor(() => expect(screen.getByRole('listbox', {hidden: true})).toHaveTextContent(searchWord));
  });

  it('puts the searched word in the url', async () => {
    render(<TestApp at={Paths.artGallery}/>);

    await userEvent.type(screen.getByLabelText(/Search For/), 'A');
    await userEvent.click(screen.getByRole('button', {name: 'submit search'}));

    await waitFor(() => expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('search=A'));
    expect(screen.getByRole('status', {name: 'url path'})).toHaveTextContent(new RegExp(`^${Paths.artGallery}$`));
  });

  it('the keyboard walks from the query to reset, then submit', async () => {
    render(<TestApp at={Paths.artGallery}/>);
    await userEvent.type(screen.getByLabelText(/Search For/), 'a');

    await userEvent.tab();
    expect(screen.getByRole('button', {name: 'reset search'})).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByRole('button', {name: 'submit search'})).toHaveFocus();
  });

  it('a search keeps the page and museum it was made on', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=1&tab=aic`}/>);

    await userEvent.type(screen.getByLabelText(/Search For/), 'a');
    await userEvent.click(screen.getByRole('button', {name: 'submit search'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('?page=1&tab=aic&search=a');
  });

  it('should leave the original query alone when search is empty', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=1&search=cat&tab=aic`}/>);

    await userEvent.click(screen.getByRole('button', {name: 'submit search'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('?page=1&search=cat&tab=aic');
  });

  it('should be able to reset the query', async () => {
    render(<TestApp at={`${Paths.artGallery}?search=cat&tab=aic`}/>);

    await userEvent.click(screen.getByRole('button', {name: 'reset search'}));

    await waitFor(() => expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('search'));
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('tab=aic');
  });

  it('a reset empties the box and puts the submit to rest', async () => {
    render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);
    await userEvent.type(screen.getByLabelText(/Search For/), 'A');
    expect(screen.getByRole('button', {name: 'submit search'})).toBeEnabled();

    await userEvent.click(screen.getByRole('button', {name: 'reset search'}));

    expect(screen.getByLabelText(/Search For/)).toHaveValue('');
    expect(screen.getByRole('button', {name: 'submit search'})).toBeDisabled();
  });

  it('a word asks the museum for suggestions once, and not again while it stands', async () => {
    const suggestions: string[] = [];
    const count = ({request}: {request: Request}) => {
      if (request.url.includes('suggest_autocomplete_all')) suggestions.push(request.url);
    };
    server.events.on('request:start', count);
    try {
      render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);

      await userEvent.type(screen.getByLabelText(/Search For/), searchWord);
      await waitFor(() => expect(screen.getByRole('listbox', {hidden: true})).toHaveTextContent(searchWord));

      expect(suggestions).toHaveLength(1);
      await expect(waitFor(() => expect(suggestions.length).toBeGreaterThan(1), {timeout: 700})).rejects.toThrow(/greater than 1/);
    } finally {
      server.events.removeListener('request:start', count);
    }
  });

  it("a late answer for an old word never lands over the new word's suggestions", async () => {
    const asked: string[] = [];
    const noted = ({request}: {request: Request}) => {
      const word = new URL(request.url).searchParams.get('query[term][title]');
      if (word !== null) asked.push(word);
    };
    server.events.on('request:start', noted);
    const monkArrives = heldAICSuggestions('mon', suggesting('MONK'));
    const monetArrives = heldAICSuggestions('monet', suggesting('MONET'));
    try {
      render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);

      await userEvent.type(screen.getByLabelText(/Search For/), 'mon');
      await waitFor(() => expect(asked).toContain('mon'));
      await userEvent.type(screen.getByLabelText(/Search For/), 'et');
      await waitFor(() => expect(asked).toContain('monet'));
      monetArrives();
      await waitFor(() => expect(screen.getByRole('listbox', {hidden: true})).toHaveTextContent('MONET'));
      monkArrives();

      await waitFor(() => expect(asked).toEqual(['mon', 'monet']));
      expect(screen.getByRole('listbox', {hidden: true})).toHaveTextContent('MONET');
      expect(screen.getByRole('listbox', {hidden: true})).not.toHaveTextContent('MONK');
    } finally {
      server.events.removeListener('request:start', noted);
    }
  });
});
