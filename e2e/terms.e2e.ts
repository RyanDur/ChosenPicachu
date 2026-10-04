import {expect, test} from '@playwright/test';
import {definitionTapped, iPhone} from './__test_support';

// a definition squeezed beside its word ran 124 to 266px wide, a few words to a line
const aReadableWidth = 300;

test.describe('a phone', () => {
  test.use(iPhone);

  for (const {tab, story, term} of [
    {tab: 'tables', story: 'The trader can read the market in a table', term: 'ledger'},
    {tab: 'tables', story: 'The page is a store, and so is the table', term: 'store'},
    {tab: 'tables', story: 'The page is a store, and so is the table', term: 'middleware'},
    {tab: 'tables', story: 'The trader can sort by column', term: 'survey'},
    {tab: 'tables', story: 'The page is a store, and so is the table', term: 'reducer'},
    {tab: 'dragAndDrop', story: 'The user can arrange the list by hand', term: 'crossing'}
  ]) {
    test(`a tap on ${term} opens its definition at a readable width, clear of both edges and of the word`, async ({page}) => {
      await page.goto(`demos/?tab=${tab}`);

      const {width, left, right, overTheWord} = await definitionTapped(page, story, term);

      expect(width, 'the definition’s width').toBeGreaterThanOrEqual(aReadableWidth);
      expect(left, 'room on the left').toBeGreaterThanOrEqual(8);
      expect(right, 'room on the right').toBeGreaterThanOrEqual(8);
      expect(overTheWord, 'over the word it defines').toBe(false);
    });
  }
});
