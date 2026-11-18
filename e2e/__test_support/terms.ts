import type {Locator, Page} from '@playwright/test';
import {siteFrame} from './site';

export const terms = (page: Page) => ({
  defined: async (story: string, term: string): Promise<{word: Locator; definition: Locator}> => {
    await siteFrame(page).hydrated();
    const fold = page.getByRole('group', {name: story, exact: true}).first();
    const word = fold.getByRole('button', {name: term, exact: true}).first();
    await word.scrollIntoViewIfNeeded();
    return {word, definition: fold.getByLabel(term, {exact: true}).first()};
  },
  timesShut: async (definition: Locator): Promise<() => Promise<number>> => {
    const shut = await definition.evaluateHandle(shown => {
      const times = {closed: 0};
      shown.addEventListener('beforetoggle', event => {
        if (event instanceof ToggleEvent && event.newState === 'closed') times.closed++;
      });
      return times;
    });
    return () => shut.evaluate(times => times.closed);
  },
  whatHappened: async (word: Locator, definition: Locator): Promise<() => Promise<string>> => {
    const seen = await word.evaluateHandle(term => {
      const happened: string[] = [];
      for (const type of ['pointerdown', 'pointerup', 'focus', 'click']) {
        term.addEventListener(type, () => happened.push(`term ${type}`));
      }
      document.addEventListener('keydown', ({key}) => happened.push(`${key} keydown`), true);
      return happened;
    });
    await definition.evaluate((shown, happened) => shown.addEventListener('beforetoggle', event => {
      if (event instanceof ToggleEvent) happened.push(`definition ${event.newState}`);
    }), seen);
    return () => seen.evaluate(happened => happened.join(' → '));
  }
});
