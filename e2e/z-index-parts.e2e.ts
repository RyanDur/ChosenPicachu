import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {contextChooser, siteFrame, stackingPile, trappedMenu, zIndexTab} from './__test_support';

const whyThirdIsOnTop = 'Why Third is on top';
const whyNineNineNineStillLoses = 'Why 9999 still loses';
const whatElseForms = 'What else forms a stacking context';
const whyThePopoverWins = 'Why the popover wins';

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

test('a reader follows why Third is on top’s foot on to the next part’s page, with the raised card kept in the address', async ({page}) => {
  await page.goto('demos/z-index/why-third-is-on-top/?raised=second');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 2. Why 9999 still loses');

  await expect(page).toHaveURL(/demos\/z-index\/why-9999-still-loses\/\?raised=second$/);
  await expect(zIndexTab(page).partTitle(whyNineNineNineStillLoses)).toBeVisible();
});

test('a reader follows why 9999 still loses from the z-index tab to its page and finds its menus', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(whyNineNineNineStillLoses).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-9999-still-loses\/$/);
  await expect(zIndexTab(page).partTitle(whyNineNineNineStillLoses)).toBeVisible();
  await expect(page.getByText('Z-index · part 2 of 6', {exact: true})).toBeVisible();
  await expect(trappedMenu(page).sortBy).toBeVisible();
});

test('a reader follows what else forms a stacking context from the z-index tab to its page, with the wear in the address kept on the chooser', async ({page}) => {
  await page.goto('demos/z-index/?wears=opacity');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(whatElseForms).click();

  await expect(page).toHaveURL(/demos\/z-index\/what-else-forms-a-stacking-context\/\?wears=opacity$/);
  await expect(page.getByText('Z-index · part 3 of 6', {exact: true})).toBeVisible();
  await expect(contextChooser(page).chosen('opacity: 0.9')).toBeVisible();
});

test('a reader follows why 9999 still loses’s foot on to the next part’s page, with the raised card kept in the address', async ({page}) => {
  await page.goto('demos/z-index/why-9999-still-loses/?raised=second');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 3. What else forms a stacking context');

  await expect(page).toHaveURL(/demos\/z-index\/what-else-forms-a-stacking-context\/\?raised=second$/);
  await expect(zIndexTab(page).partTitle(whatElseForms)).toBeVisible();
});

test('a reader follows why the popover wins from the z-index tab to its page and finds the menus it explains', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(whyThePopoverWins).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-the-popover-wins\/$/);
  await expect(page.getByText('Z-index · part 4 of 6', {exact: true})).toBeVisible();
  await expect(trappedMenu(page).sortBy).toBeVisible();
});

test('a reader follows what else forms a stacking context’s foot on to the next part’s page, with the wear kept in the address', async ({page}) => {
  await page.goto('demos/z-index/what-else-forms-a-stacking-context/?wears=opacity');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 4. Why the popover wins');

  await expect(page).toHaveURL(/demos\/z-index\/why-the-popover-wins\/\?wears=opacity$/);
  await expect(zIndexTab(page).partTitle(whyThePopoverWins)).toBeVisible();
});
