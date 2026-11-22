import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {nestingExhibit} from './__test_support';

const address = 'demos/z-index/why-9999-still-loses/';

test('stepping to two contexts shows the one rule that makes card A a context, and says what changed', async ({page}) => {
  const exhibit = nestingExhibit(page);
  await page.goto(address);
  await expect(exhibit.verdict).toHaveText('One context: the page.');

  await exhibit.stepsTo('Two contexts');

  await expect(exhibit.css).toContainText('isolation: isolate;');
  await expect(exhibit.verdict).toHaveText('Two contexts: the page, and card A inside it.');
});

test('the list written inside card A, at z-index 9999, opens under the card beside it', async ({page}) => {
  const exhibit = nestingExhibit(page);
  await page.goto(address);

  await exhibit.stepsTo('List inside');

  await expect.poll(exhibit.onTopWhereTheListMeetsCardB).toBe('card B');
  await expect(exhibit.verdict).toHaveText('The list opens under card B.');
});

test('the same list written outside, with the same 9999, opens over the card, and the page says the number did not change', async ({page}) => {
  const exhibit = nestingExhibit(page);
  await page.goto(address);
  await exhibit.stepsTo('List inside');

  await exhibit.stepsTo('List outside');

  await expect.poll(exhibit.onTopWhereTheListMeetsCardB).toBe('the list');
  await expect(exhibit.css).toContainText('z-index: 9999;');
  await expect(exhibit.saying('The number did not change.')).toBeVisible();
});
