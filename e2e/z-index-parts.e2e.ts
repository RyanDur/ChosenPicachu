import {expect, Page} from '@playwright/test';
import {test} from './__test_support/journey';
import {siteFrame, stackingPile} from './__test_support';

const partLink = (page: Page) =>
  page.getByRole('heading', {level: 2, name: 'Why Third is on top'}).getByRole('link', {name: 'Why Third is on top', exact: true});

test('a reader follows why Third is on top from the z-index tab to its page, with the pile at its top and the part’s runs below', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await partLink(page).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-third-is-on-top\/$/);
  await expect(page.getByText('Z-index · part 1 of 6', {exact: true})).toBeVisible();
  await expect(page.getByRole('figure', {name: /^The pile\./})).toBeVisible();
  await expect(page.getByText(/^The pile is a list of three cards, First, Second and Third/)).toBeVisible();
});

test('a card raised on the z-index tab is still raised on the page for why Third is on top', async ({page}) => {
  await page.goto('demos/z-index/');
  await stackingPile(page).raise('Second');

  await partLink(page).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-third-is-on-top\/\?raised=second$/);
  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Second', 'Third', 'First']);
});

test('a reader follows why Third is on top’s foot on to the next part, and lands on its heading on the tab with the raised card kept', async ({page}) => {
  await page.goto('demos/z-index/why-third-is-on-top/?raised=second');
  await siteFrame(page).hydrated();

  await page.getByRole('navigation', {name: 'the z-index parts'})
    .getByRole('link', {name: 'Next: 2. Why 9999 still loses'}).click();

  await expect(page).toHaveURL(/demos\/z-index\/\?raised=second#9999-still-loses-heading$/);
  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Second', 'Third', 'First']);
});
