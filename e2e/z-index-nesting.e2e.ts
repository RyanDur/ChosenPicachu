import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {nestingExhibit} from './__test_support';

const address = 'demos/z-index/why-9999-still-loses/';

test('stepping to a context inside marks the one rule that makes card A a context, and says what changed', async ({page}) => {
  const exhibit = nestingExhibit(page);
  await page.goto(address);
  await expect(exhibit.verdict).toHaveText('One context: the page.');

  await exhibit.stepsTo('2 · A context inside');

  await expect.poll(exhibit.markedRules).toEqual(['.card-a {', 'isolation: isolate;', '}']);
  await expect(exhibit.verdict).toHaveText('Two contexts: the page, and card A inside it.');
});

test('the list written inside card A, at z-index 9999, opens under card B', async ({page}) => {
  const exhibit = nestingExhibit(page);
  await page.goto(address);

  await exhibit.stepsTo('3 · The list inside');

  await expect.poll(exhibit.onTopWhereTheListMeetsCardB).toBe('card B');
  await expect(exhibit.verdict).toHaveText('The list opens under card B.');
});

test('the same list written outside, with the same 9999, opens over card B, and the page says the number did not change', async ({page}) => {
  const exhibit = nestingExhibit(page);
  await page.goto(address);
  await exhibit.stepsTo('3 · The list inside');

  await exhibit.stepsTo('4 · The list outside');

  await expect.poll(exhibit.onTopWhereTheListMeetsCardB).toBe('the list');
  await expect(exhibit.css).toContainText('z-index: 9999;');
  await expect(exhibit.verdict).toHaveText('The list opens over card B.');
});

test('a copied address opens the exhibit on the step it names', async ({page}) => {
  const exhibit = nestingExhibit(page);

  await page.goto(`${address}?nesting=the-list-outside`);

  await expect(exhibit.step('4 · The list outside')).toBeChecked();
  await expect(exhibit.verdict).toHaveText('The list opens over card B.');
});

test('Back steps the exhibit back to the step before', async ({page}) => {
  const exhibit = nestingExhibit(page);
  await page.goto(address);
  await exhibit.stepsTo('2 · A context inside');
  await expect(exhibit.step('2 · A context inside')).toBeChecked();

  await page.goBack();

  await expect(exhibit.step('1 · One context')).toBeChecked();
});
