import {Page, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {bannerTrap, boxOf, desktop, dialRow, iPhone, pressTab, tabsTo} from './__test_support';

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    test('the old banner stays on the window, and card two passes over it while its edge still shows', async ({page}) => {
      await page.goto('demos/z-index/');
      const banners = bannerTrap(page);
      await banners.raiseOld.click();
      await expect(banners.oldBanner).toBeVisible();

      await banners.scrollCardTwoOnto(banners.oldBanner);

      await expect.poll(() => banners.onTopOf(banners.oldBanner, 'middle')).toBe('card two');
      await expect.poll(() => banners.onTopOf(banners.oldBanner, 'start')).toBe('the banner');
    });

    test('the site’s banner stays over card two as it passes', async ({page}) => {
      await page.goto('demos/z-index/');
      const banners = bannerTrap(page);
      await banners.raiseSite.click();
      await expect(banners.siteBanner).toBeVisible();

      await banners.scrollCardTwoOnto(banners.siteBanner);

      await expect.poll(() => banners.onTopOf(banners.siteBanner, 'middle')).toBe('the banner');
    });

    test('the tutorial below brings the step that writes the panel at the page’s root into view, with its story heading in view', async ({page}) => {
      await page.goto('demos/z-index/');
      const part = page.getByRole('region', {name: 'Why a fixed banner still loses'});

      await part.getByRole('link', {name: 'the tutorial below'}).click();

      await expect(page.getByText('Write the panel last, at the page’s root')).toBeInViewport();
      await expect(page.getByText('The user sees the news over the page')).toBeInViewport();
    });
  });
}

test.describe('a phone, where the page itself scrolls', () => {
  test.use(iPhone);

  const tutorialBelow = (page: Page) =>
    page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'the tutorial below'});

  test('Back from the tutorial below returns the reader to the link they followed, and Forward to the tutorial\'s story', async ({page}) => {
    await page.goto('demos/z-index/');
    const link = tutorialBelow(page);
    await link.click();
    await expect(page.getByText('Write the panel last, at the page’s root')).toBeInViewport();

    await page.goBack();
    await expect(link).toBeInViewport();

    await page.goForward();
    await expect(page.getByText('The user sees the news over the page').first()).toBeInViewport();
  });
});

test('a keyboard reader who follows the tutorial below reaches the story\'s opener with one Tab, and Enter folds the story', async ({page}) => {
  await page.goto('demos/z-index/');
  const link = page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'the tutorial below'});
  await tabsTo(page, link);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#news-top-story$/);
  await expect(link).not.toBeFocused();
  await expect(page.getByRole('listitem').filter({has: page.getByRole('group', {name: 'The user sees the news over the page'})}).last()).toBeFocused();

  await expect(page.getByText('Write the panel last, at the page’s root')).toBeVisible();

  await pressTab(page);
  await page.keyboard.press('Enter');

  await expect(page.getByText('Write the panel last, at the page’s root')).toBeHidden();
});

test('a reader who follows the tutorial below with motion allowed lands on the story\'s heading', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto('demos/z-index/');

  await page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'the tutorial below'}).click();

  await expect(page).toHaveURL(/#news-top-story$/);
  await expect(page.getByText('The user sees the news over the page').first()).toBeInViewport();
});

const lessMotionEntrance = 'If your system asks for less motion, a new banner appears in place, whichever entrance you choose.';

test('the entrance reads the chosen side, and reads that a new banner appears in place once the reader asks for less motion', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto('demos/z-index/?enter=right');
  const {reading} = dialRow(page, 'entrance');
  await reading.scrollIntoViewIfNeeded();

  await expect(reading).toHaveText('A new banner slides in from past the window’s right edge.', {useInnerText: true});

  await page.emulateMedia({reducedMotion: 'reduce'});

  await expect(reading).toHaveText(lessMotionEntrance, {useInnerText: true});
});

test('a link that holds the panel to the window’s bottom edge raises the site’s banner there', async ({page}) => {
  await page.goto('demos/z-index/?side=bottom');
  const banners = bannerTrap(page);

  await banners.raiseSite.click();
  await expect(banners.siteBanner).toBeVisible();

  const {height} = page.viewportSize() ?? {height: 0};
  await expect.poll(async () => {
    const {y, height: tall} = await boxOf(banners.siteBanner);
    return y + tall > height / 2;
  }).toBe(true);
});

test('a reader who dismisses the site’s only banner is left with no site banner', async ({page}) => {
  await page.goto('demos/z-index/');
  const banners = bannerTrap(page);
  await banners.raiseSite.click();
  await expect(banners.siteNotes).toHaveCount(1);

  await banners.siteBanner.getByRole('button', {name: /^dismiss /}).click();

  await expect(banners.siteNotes).toHaveCount(0);
});

test('a reader who dismisses one of two site banners is left with the other', async ({page}) => {
  await page.goto('demos/z-index/');
  const banners = bannerTrap(page);
  await banners.raiseSite.click();
  await banners.raiseSite.click();
  await expect(banners.siteNotes).toHaveCount(2);
  const kept = await banners.siteNotes.last().textContent();

  await banners.siteNotes.first().getByRole('button', {name: /^dismiss /}).click();

  await expect(banners.siteNotes).toHaveCount(1);
  await expect(banners.siteBanner).toHaveText(kept ?? '');
});

test('in a stack that grows sideways, a dismissed banner leaves', async ({page}) => {
  await page.goto('demos/z-index/?stack=left');
  const banners = bannerTrap(page);
  await banners.raiseSite.click();
  await expect(banners.siteNotes).toHaveCount(1);

  await banners.siteBanner.getByRole('button', {name: /^dismiss /}).click();

  await expect(banners.siteNotes).toHaveCount(0);
});

test('a raised note is announced: the browser finds it in the page’s alert', async ({page}) => {
  await page.goto('demos/z-index/');
  const banners = bannerTrap(page);

  await banners.raiseSite.click();

  await expect(banners.siteNotes).toHaveCount(1);
});
