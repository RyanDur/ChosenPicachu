import type {Locator, Page} from '@playwright/test';

export const definedTerm = async (page: Page, story: string, term: string): Promise<{word: Locator; definition: Locator}> => {
  const fold = page.getByRole('group', {name: story, exact: true}).first();
  await fold.getByRole('heading', {name: story, exact: true}).click();
  const word = fold.getByRole('button', {name: term, exact: true}).first();
  await word.scrollIntoViewIfNeeded();
  return {word, definition: fold.getByLabel(term, {exact: true}).first()};
};

export const timesShut = async (definition: Locator): Promise<() => Promise<number>> => {
  const shut = await definition.evaluateHandle(shown => {
    const times = {closed: 0};
    shown.addEventListener('beforetoggle', event => {
      if (event instanceof ToggleEvent && event.newState === 'closed') times.closed++;
    });
    return times;
  });
  return () => shut.evaluate(times => times.closed);
};
