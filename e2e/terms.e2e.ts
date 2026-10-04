import {expect, test} from '@playwright/test';
import {definitionTapped, iPhone} from './__test_support';

test.describe('a phone', () => {
  test.use(iPhone);

  for (const {tab, story, term, shown} of [
    {tab: 'tables', story: 'The trader can read the market in a table', term: 'ledger'},
    {tab: 'tables', story: 'The page is a store, and so is the table', term: 'store'},
    {tab: 'tables', story: 'The page is a store, and so is the table', term: 'middleware', shown: 'Middleware'},
    {tab: 'tables', story: 'The trader can sort by column', term: 'survey'},
    {tab: 'tables', story: 'The page is a store, and so is the table', term: 'reducer'},
    {tab: 'dragAndDrop', story: 'The user can arrange the list by hand', term: 'crossing'}
  ]) {
    test(`a tap on ${term} opens its definition at a readable width, clear of both edges and of the word`, async ({page}) => {
      await page.goto(`demos/?tab=${tab}`);

      const {width, floor, left, right, overTheWord} = await definitionTapped(page, story, term, shown);

      expect(width, 'the definition’s width').toBeGreaterThanOrEqual(floor - 1);
      expect(left, 'room on the left').toBeGreaterThanOrEqual(8);
      expect(right, 'room on the right').toBeGreaterThanOrEqual(8);
      expect(overTheWord, 'over the word it defines').toBe(false);
    });
  }
});
