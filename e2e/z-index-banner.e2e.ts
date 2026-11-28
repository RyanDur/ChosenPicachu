import {expect} from '@playwright/test';
import {test} from './__test_support/history-writes';
import {
  boxOf, dialRow, feedbackOn, hydration, pillSwitch, pressTab, siteFrame, tabsTo, wholeOnTop, zIndexTab
} from './__test_support';

const fixedBannerPage = 'demos/z-index/why-a-fixed-banner-still-loses/';
const buildPage = 'demos/z-index/lets-build-this-feature/';

test.describe('the fixed banners', {tag: ['@iPhone', '@desktop']}, () => {
  test('Let’s build this feature brings the step that makes the panel a popover into view, with its story heading in view', async ({page}) => {
    await page.goto(fixedBannerPage);
    await siteFrame(page).hydrated();

    await zIndexTab(page).linkToTheBannerStory().click();

    await expect(page.getByText('Make the panel a popover', {exact: true})).toBeInViewport();
    await expect(page.getByText('The user sees the news over the page')).toBeInViewport();
  });
});

test('Back from Let’s build this feature returns the reader to the link they followed, and Forward to the tutorial\'s story', {tag: ['@iPhone', '@desktop']}, async ({page}) => {
  await page.goto(fixedBannerPage);
  await siteFrame(page).hydrated();
  const link = zIndexTab(page).linkToTheBannerStory();
  await link.click();
  await expect(page.getByText('Make the panel a popover', {exact: true})).toBeInViewport();

  await page.goBack();
  await expect(link).toBeInViewport();

  await page.goForward();
  await expect(page.getByText('The user sees the news over the page').first()).toBeInViewport();
});

test('a keyboard reader who follows Let’s build this feature reaches the story\'s opener with one Tab, and Enter folds the story', async ({page}) => {
  await page.goto(fixedBannerPage);
  await siteFrame(page).hydrated();
  const link = zIndexTab(page).linkToTheBannerStory();
  await tabsTo(page, link);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/lets-build-this-feature\/#news-top-story$/);
  await expect(page.getByRole('listitem').filter({has: page.getByRole('group', {name: 'The user sees the news over the page'})}).last()).toBeFocused();

  await expect(page.getByText('Make the panel a popover', {exact: true})).toBeVisible();

  await pressTab(page);
  await page.keyboard.press('Enter');

  await expect(page.getByText('Make the panel a popover', {exact: true})).toBeHidden();
});

test('a reader who follows Let’s build this feature with motion allowed lands on the story\'s heading, with only its place in the address', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto(fixedBannerPage);
  await siteFrame(page).hydrated();

  await zIndexTab(page).linkToTheBannerStory().click();

  await expect(page).toHaveURL(/\/lets-build-this-feature\/#news-top-story$/);
  await expect(page.getByText('The user sees the news over the page').first()).toBeInViewport();
});

test('a reader with a saved link that still names the story\'s record lands on the story, open', async ({page}) => {
  await page.goto('demos/z-index/lets-build-this-feature/?news=top#news-top-story');

  await expect(page.getByRole('group', {name: 'The user sees the news over the page'})).toHaveAttribute('open');
  await expect(page.getByText('The user sees the news over the page').first()).toBeInViewport();
});

test('a story the reader opened by hand is closed again after a reload, and the address keeps no record of it', async ({page}) => {
  await page.goto('demos/z-index/lets-build-this-feature/');
  await siteFrame(page).hydrated();
  const story = page.getByRole('group', {name: 'The user can have multiple banners'});

  await story.getByText('The user can have multiple banners').click();
  await expect(story).toHaveAttribute('open');
  await expect(page).toHaveURL(/\/lets-build-this-feature\/$/);

  await page.reload();
  await siteFrame(page).hydrated();

  await expect(story).not.toHaveAttribute('open');
});

test('on let’s build this feature’s page, a reader chooses an entrance and raises a banner under the dials', async ({page}) => {
  await page.goto('demos/z-index/lets-build-this-feature/');
  await pillSwitch(page, 'entrance').choose('Left');

  await zIndexTab(page).raisesABanner();

  await expect(zIndexTab(page).newestBanner()).toBeVisible();
});

const lessMotionEntrance = 'If your system asks for less motion, a new banner appears in place, whichever entrance you choose.';

test('the entrance reads the chosen side, and reads that a new banner appears in place once the reader asks for less motion', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto('demos/z-index/lets-build-this-feature/?enter=right');
  const {reading} = dialRow(page, 'entrance');
  await reading.scrollIntoViewIfNeeded();

  await expect(reading).toHaveText('A new banner slides in from past the window’s right edge.', {useInnerText: true});

  await page.emulateMedia({reducedMotion: 'reduce'});

  await expect(reading).toHaveText(lessMotionEntrance, {useInnerText: true});
});

test('a link that holds the panel to the window’s bottom edge raises the site’s banner there', async ({page}) => {
  await page.goto(`${buildPage}?side=bottom`);
  const banners = zIndexTab(page);

  await banners.raisesABanner();
  await expect(banners.newestBanner()).toBeVisible();

  const {height} = page.viewportSize() ?? {height: 0};
  await expect.poll(async () => {
    const {y, height: tall} = await boxOf(banners.newestBanner());
    return y + tall > height / 2;
  }).toBe(true);
});

test('a reader who dismisses the site’s only banner is left with no site banner', async ({page}) => {
  await page.goto(buildPage);
  const banners = zIndexTab(page);
  await banners.raisesABanner();
  await expect(banners.banners).toHaveCount(1);

  await banners.newestBanner().getByRole('button', {name: /^dismiss /}).click();

  await expect(banners.banners).toHaveCount(0);
});

test('the site’s banners, first shown while the site menu is open, go whole over the menu, and the menu stays open', {tag: '@iPhone'}, async ({page}) => {
  await page.goto(`${buildPage}?side=bottom`);
  await siteFrame(page).hydrated();
  const banners = zIndexTab(page);
  await siteFrame(page).menu.tap();
  await expect(siteFrame(page).nav).toBeVisible();

  await banners.raiser.press('Enter');

  await expect(banners.newestBanner()).toBeVisible();
  await expect(siteFrame(page).nav).toBeVisible();
  await expect.poll(() => wholeOnTop(banners.newestBanner())).toBe(true);
});

test('a site banner waits out the open Feedback dialog, which stays open, and shows again once it closes', async ({page}) => {
  await page.goto(buildPage);
  await siteFrame(page).hydrated();
  const banners = zIndexTab(page);
  const feedback = feedbackOn(page);
  await banners.raisesABanner();
  await expect(banners.newestBanner()).toBeVisible();

  await feedback.open.click();

  await expect(feedback.dialog).toBeVisible();
  await expect(banners.newestBanner()).toBeHidden();

  await page.keyboard.press('Escape');

  await expect(feedback.dialog).toBeHidden();
  await expect(banners.newestBanner()).toBeVisible();
});

test('a site banner dismissed just before the Feedback dialog opens is gone once it closes, and another can be raised', async ({page}) => {
  await page.goto(buildPage);
  await siteFrame(page).hydrated();
  const banners = zIndexTab(page);
  const feedback = feedbackOn(page);
  await banners.raisesABanner();
  await expect(banners.newestBanner()).toBeVisible();

  await banners.newestBanner().getByRole('button', {name: /^dismiss /}).click();
  await feedback.open.click();
  await expect(feedback.dialog).toBeVisible();
  await page.keyboard.press('Escape');

  await expect(feedback.dialog).toBeHidden();
  await expect(banners.banners).toHaveCount(0);
  await banners.raisesABanner();
  await expect(banners.banners).toHaveCount(1);
  await expect(banners.newestBanner()).toBeVisible();
});

test('a site banner stays up through Back from the part before Let’s build this feature, and one raised after Back shows', async ({page}) => {
  await page.goto(buildPage);
  await siteFrame(page).hydrated();
  const banners = zIndexTab(page);
  await banners.raisesABanner();
  await expect(banners.newestBanner()).toBeVisible();
  await banners.followsTheFoot('Previous: 6. Why the popover wins');
  await expect(page).toHaveURL(/why-the-popover-wins\/$/);

  await page.goBack();

  await expect(banners.banners.first()).toBeVisible();
  await banners.raisesABanner();
  await expect(banners.newestBanner()).toBeVisible();
});

test('a reader who dismisses one of two site banners is left with the other', async ({page}) => {
  await page.goto(buildPage);
  const banners = zIndexTab(page);
  await banners.raisesABanner();
  await banners.raisesABanner();
  await expect(banners.banners).toHaveCount(2);
  const kept = await banners.banners.last().textContent();

  await banners.banners.first().getByRole('button', {name: /^dismiss /}).click();

  await expect(banners.banners).toHaveCount(1);
  await expect(banners.newestBanner()).toHaveText(kept ?? '');
});

test('in a stack that grows sideways, a dismissed banner leaves', async ({page}) => {
  await page.goto(`${buildPage}?stack=left`);
  const banners = zIndexTab(page);
  await banners.raisesABanner();
  await expect(banners.banners).toHaveCount(1);

  await banners.newestBanner().getByRole('button', {name: /^dismiss /}).click();

  await expect(banners.banners).toHaveCount(0);
});

test('a raised note is announced: the browser finds it in the page’s alert', async ({page}) => {
  await page.goto(buildPage);
  const banners = zIndexTab(page);

  await banners.raisesABanner();

  await expect(banners.banners).toHaveCount(1);
});

test('given let’s build this feature’s page before its script runs, Raise a banner is disabled; once the script runs, the first press raises a banner', async ({page}) => {
  const address = 'demos/z-index/lets-build-this-feature/';
  await hydration(page).holdBack(address);
  await page.goto(address);
  const controls = zIndexTab(page);

  await expect(controls.raiser).toBeDisabled();
  await hydration(page).release();

  await controls.raisesABanner();

  await expect(controls.newestBanner()).toBeVisible();
});
