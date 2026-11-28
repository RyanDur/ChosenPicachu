import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {
  bannerAtTheEdge, contextChooser, nestingExhibit, partFoot, pileSteps, popoverExhibit, siteFrame, stackingPile,
  zIndexTab
} from './__test_support';

const whyThirdIsOnTop = 'Why Third is on top';
const howPositionPlacesABox = 'How position places a box';
const whyNineNineNineStillLoses = 'Why 9999 still loses';
const whatElseForms = 'What else forms a stacking context';
const whyThePopoverWins = 'Why the popover wins';
const whyAFixedBannerStillLoses = 'Why a fixed banner still loses';
const letsBuildThisFeature = 'Let’s build this feature';

test('a reader follows why Third is on top from the z-index tab to its page and finds its pile', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(whyThirdIsOnTop).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-third-is-on-top\/$/);
  await expect(zIndexTab(page).partTitle(whyThirdIsOnTop)).toBeVisible();
  await expect(page.getByText('Z-index · part 1 of 7', {exact: true})).toBeVisible();
  await expect(page.getByRole('region', {name: 'The pile'})).toBeVisible();
});

test('a card raised on the z-index tab is still raised on the page for why Third is on top', async ({page}) => {
  await page.goto('demos/z-index/');
  await pileSteps(page).stepsTo('4 · Z-index');
  await pileSteps(page).givesAZIndexTo('Second');
  await expect(page).toHaveURL(/[?&]raised=second$/);

  await zIndexTab(page).partLink(whyThirdIsOnTop).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-third-is-on-top\/\?raised=second$/);
  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Second', 'Third', 'First']);
});

test('a reader who steps the tab’s pile back to the overlap finds no card raised on the page for why Third is on top', async ({page}) => {
  await page.goto('demos/z-index/?pile=z-index&raised=first');
  await pileSteps(page).stepsTo('3 · Overlap');
  await expect(page).not.toHaveURL(/raised=/);

  await zIndexTab(page).partLink(whyThirdIsOnTop).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-third-is-on-top\/$/);
  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Third', 'Second', 'First']);
});

test('a reader follows why Third is on top’s foot on to the next part’s page, with the raised card kept in the address', async ({page}) => {
  await page.goto('demos/z-index/why-third-is-on-top/?raised=second');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 2. How position places a box');

  await expect(page).toHaveURL(/demos\/z-index\/how-position-places-a-box\/\?raised=second$/);
  await expect(zIndexTab(page).partTitle(howPositionPlacesABox)).toBeVisible();
  await expect(page.getByText('Z-index · part 2 of 7', {exact: true})).toBeVisible();
});

test('a reader follows how position places a box from the z-index tab to its page and finds where Second goes', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(howPositionPlacesABox).click();

  await expect(page).toHaveURL(/demos\/z-index\/how-position-places-a-box\/$/);
  await expect(page.getByRole('region', {name: 'Where Second goes'})).toBeVisible();
});

test('a reader follows how position places a box’s foot on to the next part’s page, with the raised card kept in the address', async ({page}) => {
  await page.goto('demos/z-index/how-position-places-a-box/?raised=second');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 3. Why 9999 still loses');

  await expect(page).toHaveURL(/demos\/z-index\/why-9999-still-loses\/\?raised=second$/);
  await expect(zIndexTab(page).partTitle(whyNineNineNineStillLoses)).toBeVisible();
});

test('a reader follows why 9999 still loses from the z-index tab to its page and finds a context inside a context', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(whyNineNineNineStillLoses).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-9999-still-loses\/$/);
  await expect(zIndexTab(page).partTitle(whyNineNineNineStillLoses)).toBeVisible();
  await expect(page.getByText('Z-index · part 3 of 7', {exact: true})).toBeVisible();
  await expect(nestingExhibit(page).verdict).toHaveText('Card A forms no context yet.');
});

test('a reader follows what else forms a stacking context from the z-index tab to its page, with the wear in the address kept on the chooser', async ({page}) => {
  await page.goto('demos/z-index/?wears=opacity');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(whatElseForms).click();

  await expect(page).toHaveURL(/demos\/z-index\/what-else-forms-a-stacking-context\/\?wears=opacity$/);
  await expect(page.getByText('Z-index · part 4 of 7', {exact: true})).toBeVisible();
  await expect(contextChooser(page).chosen('opacity: 0.9')).toBeVisible();
});

test('a reader follows why 9999 still loses’s foot on to the next part’s page, with the raised card kept in the address', async ({page}) => {
  await page.goto('demos/z-index/why-9999-still-loses/?raised=second');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 4. What else forms a stacking context');

  await expect(page).toHaveURL(/demos\/z-index\/what-else-forms-a-stacking-context\/\?raised=second$/);
  await expect(zIndexTab(page).partTitle(whatElseForms)).toBeVisible();
});

test('a reader follows why the popover wins from the z-index tab to its page and finds the menu it explains', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(whyThePopoverWins).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-the-popover-wins\/$/);
  await expect(page.getByText('Z-index · part 6 of 7', {exact: true})).toBeVisible();
  await expect(popoverExhibit(page).sortBy).toBeVisible();
});

test('a reader follows what else forms a stacking context’s foot on to the next part’s page, with the wear kept in the address', async ({page}) => {
  await page.goto('demos/z-index/what-else-forms-a-stacking-context/?wears=opacity');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 5. Why a fixed banner still loses');

  await expect(page).toHaveURL(/demos\/z-index\/why-a-fixed-banner-still-loses\/\?wears=opacity$/);
  await expect(zIndexTab(page).partTitle(whyAFixedBannerStillLoses)).toBeVisible();
});

test('a reader follows why a fixed banner still loses from the z-index tab to its page and finds the fixed banner it explains, in a card and on the page', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(whyAFixedBannerStillLoses).click();

  await expect(page).toHaveURL(/demos\/z-index\/why-a-fixed-banner-still-loses\/$/);
  await expect(page.getByText('Z-index · part 5 of 7', {exact: true})).toBeVisible();
  await expect(bannerAtTheEdge(page).verdict).toBeVisible();
});

test('a reader follows why a fixed banner still loses’s foot on to the popover part’s page, with the wear kept in the address', async ({page}) => {
  await page.goto('demos/z-index/why-a-fixed-banner-still-loses/?wears=opacity');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 6. Why the popover wins');

  await expect(page).toHaveURL(/demos\/z-index\/why-the-popover-wins\/\?wears=opacity$/);
  await expect(zIndexTab(page).partTitle(whyThePopoverWins)).toBeVisible();
});

test('a reader follows let’s build this feature from the z-index tab to its page and finds the dials it builds with', async ({page}) => {
  await page.goto('demos/z-index/');
  await siteFrame(page).hydrated();

  await zIndexTab(page).partLink(letsBuildThisFeature).click();

  await expect(page).toHaveURL(/demos\/z-index\/lets-build-this-feature\/$/);
  await expect(page.getByText('Z-index · part 7 of 7', {exact: true})).toBeVisible();
  await expect(page.getByRole('region', {name: 'The banner, at the window’s edge'})).toBeVisible();
});

test('a reader follows why the popover wins’s foot on to the last part’s page, with the wear kept in the address', async ({page}) => {
  await page.goto('demos/z-index/why-the-popover-wins/?wears=opacity');
  await siteFrame(page).hydrated();

  await zIndexTab(page).followsTheFoot('Next: 7. Let’s build this feature');

  await expect(page).toHaveURL(/demos\/z-index\/lets-build-this-feature\/\?wears=opacity$/);
  await expect(zIndexTab(page).partTitle(letsBuildThisFeature)).toBeVisible();
});

test('a reader at the end of the z-index tab follows its foot on to the drag sort tab, with the wear kept in the address', async ({page}) => {
  await page.goto('demos/z-index/lets-build-this-feature/?wears=opacity');
  await siteFrame(page).hydrated();

  await partFoot(page).link('Next tab: Drag sort').click();

  await expect(page).toHaveURL(/demos\/drag-and-drop\/\?wears=opacity$/);
});
