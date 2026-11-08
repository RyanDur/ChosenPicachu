import {appAddress} from '@__test_support/address';
import {TestApp} from '@__test_support/TestApp';
import {anyRequestRespondsWith} from '@__test_support/server';
import {render, waitFor} from '@testing-library/react';
import {Source} from '@pages/Gallery/source';
import {faker} from '@faker-js/faker';
import {Paths} from '@frame/navigation';
import {heldAICSuggestions, requestsAsked} from '@pages/Gallery/__test_support';
import {heldSearch, searchBar} from '@pages/Gallery/Search/__test_support';
import {aicSuggestionsOf} from '@pages/Gallery/__test_support/fixtures';
import {HTTPError} from '@transport/types';

describe('search', () => {
  const searchWord = faker.lorem.word().toUpperCase();
  beforeEach(() => {
    anyRequestRespondsWith(JSON.stringify(aicSuggestionsOf([searchWord])));
  });

  it('the label reads the word searched for, 100% and all', async () => {
    render(<TestApp at={`${Paths.artGallery}?tab=${Source.AIC}&search=100%25`}/>);

    expect(await searchBar.queryNamedAppears('Search For: 100%')).toBeInTheDocument();
  });

  it('puts the searched word in the url', async () => {
    render(<TestApp at={Paths.artGallery}/>);

    await searchBar.type('A');
    await searchBar.submit();

    await waitFor(() => expect(appAddress.search()).toHaveTextContent('search=A'));
    expect(appAddress.path()).toHaveTextContent(new RegExp(`^${Paths.artGallery}$`));
  });

  it('the keyboard walks from the query to reset, then submit', async () => {
    render(<TestApp at={Paths.artGallery}/>);
    await searchBar.type('a');

    await searchBar.focusMovesOn();
    expect(searchBar.resetButton()).toHaveFocus();

    await searchBar.focusMovesOn();
    expect(searchBar.submitButton()).toHaveFocus();
  });

  it('a search keeps the page and museum it was made on', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=1&tab=aic`}/>);

    await searchBar.type('a');
    await searchBar.submit();

    expect(appAddress.search()).toHaveTextContent('?page=1&tab=aic&search=a');
  });

  it('should be able to reset the query', async () => {
    render(<TestApp at={`${Paths.artGallery}?search=cat&tab=aic`}/>);

    await searchBar.reset();

    await waitFor(() => expect(appAddress.search()).not.toHaveTextContent('search'));
    expect(appAddress.search()).toHaveTextContent('tab=aic');
  });

  it('a reset empties the box, and the browser holds the empty box invalid', async () => {
    render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);
    await searchBar.type('A');
    expect(searchBar.query()).toBeValid();

    await searchBar.reset();

    expect(searchBar.query()).toHaveValue('');
    expect(searchBar.query()).toBeInvalid();
  });

  describe('with the clock held', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('should give suggestions for completion', async () => {
      const search = heldSearch();
      render(<TestApp at={`${Paths.artGallery}?tab=${Source.AIC}`}/>);

      await search.type(searchWord);
      await search.pauseEnds();

      await waitFor(() => expect(search.suggestions()).toHaveTextContent(searchWord));
    });

    it("a museum that refuses the new word clears the old word's suggestions", async () => {
      const search = heldSearch();
      render(<TestApp at={`${Paths.artGallery}?tab=${Source.AIC}`}/>);
      await search.type(searchWord);
      await search.pauseEnds();
      await waitFor(() => expect(search.suggestions()).toHaveTextContent(searchWord));
      anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);

      await search.type('X');
      await search.pauseEnds();

      await waitFor(() => expect(search.suggestions()).toBeEmptyDOMElement());
    });

    it('a word asks the museum for suggestions once, and not again while it stands', async () => {
      const suggestionsAsked = requestsAsked(asked => asked.href.includes('suggest_autocomplete_all') ? asked.href : null);
      const search = heldSearch();
      render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);
      await search.type(searchWord);
      await search.pauseEnds();
      await waitFor(() => expect(search.suggestions()).toHaveTextContent(searchWord));

      await search.pauseEnds();

      expect(suggestionsAsked).toHaveLength(1);
    });

    it("the page gives up on an old word's answer, so it cannot land over the new word's suggestions", async () => {
      const wordsAsked = requestsAsked(asked => asked.searchParams.get('query[term][title]'));
      const monk = heldAICSuggestions('mon', aicSuggestionsOf(['MONK']));
      const monet = heldAICSuggestions('monet', aicSuggestionsOf(['MONET']));
      const search = heldSearch();
      render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);

      await search.type('mon');
      await search.pauseEnds();
      await waitFor(() => expect(wordsAsked).toContain('mon'));
      await search.type('et');
      await search.pauseEnds();
      await waitFor(() => expect(wordsAsked).toContain('monet'));
      monet.arrives();
      await waitFor(() => expect(search.suggestions()).toHaveTextContent('MONET'));
      monk.arrives();

      expect(await monk.served).toEqual({aborted: true});
      expect(wordsAsked).toEqual(['mon', 'monet']);
      expect(search.suggestions()).toHaveTextContent('MONET');
      expect(search.suggestions()).not.toHaveTextContent('MONK');
    });
  });
});
