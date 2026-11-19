import {expect} from '@playwright/test';
import {test} from './__test_support/history-writes';
import {
  bannerTrap, boxOf, desktop, dialRow, hydration, iPhone, pillSwitch, pressTab, siteFrame, tabsTo, zIndexTab
} from './__test_support';

const fixedBannerPage = 'demos/z-index/why-a-fixed-banner-still-loses/';

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    test('the old banner stays on the window, and card two passes over it while its edge still shows', async ({page}) => {
      await page.goto(fixedBannerPage);
      const banners = bannerTrap(page);
      await banners.raiseOld.click();
      await expect(banners.oldBanner).toBeVisible();

      await banners.scrollCardTwoOnto(banners.oldBanner);

      await expect.poll(() => banners.onTopOf(banners.oldBanner, 'middle')).toBe('card two');
      await expect.poll(() => banners.onTopOf(banners.oldBanner, 'start')).toBe('the banner');
    });

    test('the site’s banner stays over card two as it passes', async ({page}) => {
      await page.goto(fixedBannerPage);
      const banners = bannerTrap(page);
      await banners.raiseSite.click();
      await expect(banners.siteBanner).toBeVisible();

      await banners.scrollCardTwoOnto(banners.siteBanner);

      await expect.poll(() => banners.onTopOf(banners.siteBanner, 'middle')).toBe('the banner');
    });

    test('Let’s build this feature brings the step that writes the panel at the page’s root into view, with its story heading in view', async ({page}) => {
      await page.goto(fixedBannerPage);
      await siteFrame(page).hydrated();
      const part = page.getByRole('region', {name: 'Why a fixed banner still loses'});

      await part.getByRole('link', {name: 'Let’s build this feature', exact: true}).click();

      await expect(page.getByText('Write the panel last, at the page’s root')).toBeInViewport();
      await expect(page.getByText('The user sees the news over the page')).toBeInViewport();
    });

  });
}

test.describe('a reader at a desk', () => {
  test.use(desktop);

  test('Back from Let’s build this feature returns them to the link they followed, and Forward to the tutorial\'s story', async ({page}) => {
    await page.goto(fixedBannerPage);
    await siteFrame(page).hydrated();
    const link = page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'Let’s build this feature', exact: true});
    await link.click();
    await expect(page.getByText('Write the panel last, at the page’s root')).toBeInViewport();

    await page.goBack();
    await expect(link).toBeInViewport();

    await page.goForward();
    await expect(page.getByText('The user sees the news over the page').first()).toBeInViewport();
  });
});

test.describe('a reader on a phone', () => {
  test.use(iPhone);

  test('Back from Let’s build this feature returns them to the link they followed, and Forward to the tutorial\'s story', async ({page}) => {
    await page.goto(fixedBannerPage);
    await siteFrame(page).hydrated();
    const link = page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'Let’s build this feature', exact: true});
    await link.click();
    await expect(page.getByText('Write the panel last, at the page’s root')).toBeInViewport();

    await page.goBack();
    await expect(link).toBeInViewport();

    await page.goForward();
    await expect(page.getByText('The user sees the news over the page').first()).toBeInViewport();
  });
});

test('a keyboard reader who follows Let’s build this feature reaches the story\'s opener with one Tab, and Enter folds the story', async ({page}) => {
  await page.goto(fixedBannerPage);
  await siteFrame(page).hydrated();
  const link = page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'Let’s build this feature', exact: true});
  await tabsTo(page, link);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/lets-build-this-feature\/#news-top-story$/);
  await expect(page.getByRole('listitem').filter({has: page.getByRole('group', {name: 'The user sees the news over the page'})}).last()).toBeFocused();

  await expect(page.getByText('Write the panel last, at the page’s root')).toBeVisible();

  await pressTab(page);
  await page.keyboard.press('Enter');

  await expect(page.getByText('Write the panel last, at the page’s root')).toBeHidden();
});

test('a reader who follows Let’s build this feature with motion allowed lands on the story\'s heading, with only its place in the address', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto(fixedBannerPage);
  await siteFrame(page).hydrated();

  await page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'Let’s build this feature', exact: true}).click();

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
  await page.goto(`${fixedBannerPage}?side=bottom`);
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
  await page.goto(fixedBannerPage);
  const banners = bannerTrap(page);
  await banners.raiseSite.click();
  await expect(banners.siteNotes).toHaveCount(1);

  await banners.siteBanner.getByRole('button', {name: /^dismiss /}).click();

  await expect(banners.siteNotes).toHaveCount(0);
});

test('a reader who dismisses one of two site banners is left with the other', async ({page}) => {
  await page.goto(fixedBannerPage);
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
  await page.goto(`${fixedBannerPage}?stack=left`);
  const banners = bannerTrap(page);
  await banners.raiseSite.click();
  await expect(banners.siteNotes).toHaveCount(1);

  await banners.siteBanner.getByRole('button', {name: /^dismiss /}).click();

  await expect(banners.siteNotes).toHaveCount(0);
});

test('a raised note is announced: the browser finds it in the page’s alert', async ({page}) => {
  await page.goto(fixedBannerPage);
  const banners = bannerTrap(page);

  await banners.raiseSite.click();

  await expect(banners.siteNotes).toHaveCount(1);
});

test('given the page before its script runs, the old way’s Raise a banner is disabled; once the script runs, the first press raises the old banner', async ({page}) => {
  await hydration(page).holdBack(fixedBannerPage);
  await page.goto(fixedBannerPage);
  const banners = bannerTrap(page);

  await expect(banners.raiseOld).toBeDisabled();
  await hydration(page).release();

  await banners.raiseOld.click();

  await expect(banners.oldBanner).toBeVisible();
});

test('given the page before its script runs, the site’s own Raise a banner is disabled; once the script runs, the first press raises the site’s banner', async ({page}) => {
  await hydration(page).holdBack(fixedBannerPage);
  await page.goto(fixedBannerPage);
  const banners = bannerTrap(page);

  await expect(banners.raiseSite).toBeDisabled();
  await hydration(page).release();

  await banners.raiseSite.click();

  await expect(banners.siteBanner).toBeVisible();
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
