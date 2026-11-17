import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {siteFrame, stackingPile, zIndexTab} from './__test_support';

const whyThirdIsOnTop = 'Why Third is on top';

test('a reader follows why Third is on top from the z-index tab to its page and finds its pile', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(whyThirdIsOnTop).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-third-is-on-top\/$/);
  await expect(zIndexTab(page).partTitle(whyThirdIsOnTop)).toBeVisible();
  await expect(page.getByText('Z-index · part 1 of 6', {exact: true})).toBeVisible();
  await expect(page.getByRole('figure', {name: /^The pile\./})).toBeVisible();
});

test('a card raised on the z-index tab is still raised on the page for why Third is on top', async ({page}) => {
  await page.goto('demos/z-index/');
  await stackingPile(page).raise('Second');
  await expect(page).toHaveURL(/\?raised=second$/);

  await zIndexTab(page).partLink(whyThirdIsOnTop).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-third-is-on-top\/\?raised=second$/);
  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Second', 'Third', 'First']);
});

test('a reader follows why Third is on top’s foot on to the next part, and lands on its heading on the tab with the raised card kept', async ({page}) => {
  await page.goto('demos/z-index/why-third-is-on-top/?raised=second');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 2. Why 9999 still loses');

  await expect(page).toHaveURL(/demos\/z-index\/\?raised=second#9999-still-loses-heading$/);
  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Second', 'Third', 'First']);
});
