import {Page, expect, test} from '@playwright/test';
import {bannerTrap, desktop, iPhone, pressTab, tabsTo} from './__test_support';

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    test('the old banner stays on the window, and card two passes over it while its edge still shows', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const banners = bannerTrap(page);
      await banners.raiseOld.click();
      await expect(banners.oldBanner).toBeVisible();

      await banners.scrollCardTwoOnto(banners.oldBanner);

      await expect.poll(() => banners.onTopOf(banners.oldBanner, 'middle')).toBe('card two');
      await expect.poll(() => banners.onTopOf(banners.oldBanner, 'start')).toBe('the banner');
    });

    test('the banner in the top layer stays over card two as it passes', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const banners = bannerTrap(page);
      await banners.raiseNew.click();
      await expect(banners.topLayerBanner).toBeVisible();

      await banners.scrollCardTwoOnto(banners.topLayerBanner);

      await expect.poll(() => banners.onTopOf(banners.topLayerBanner, 'middle')).toBe('the banner');
    });

    test('the tutorial below brings the step that makes the banner a popover into view, with its story heading in view', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const part = page.getByRole('region', {name: 'Why a fixed banner still loses'});

      await part.getByRole('link', {name: 'the tutorial below'}).click();

      await expect(page.getByText('Make the panel a popover')).toBeInViewport();
      await expect(page.getByText('The user sees the news above everything')).toBeInViewport();
    });
  });
}

test.describe('a phone, where the page itself scrolls', () => {
  test.use(iPhone);

  const tutorialBelow = (page: Page) =>
    page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'the tutorial below'});

  test('Back from the tutorial below returns the reader to the link they followed, and Forward to the tutorial\'s story', async ({page}) => {
    await page.goto('demos/?tab=z-index');
    const link = tutorialBelow(page);
    await link.click();
    await expect(page.getByText('Make the panel a popover')).toBeInViewport();

    await page.goBack();
    await expect(link).toBeInViewport();

    await page.goForward();
    await expect(page.getByText('The user sees the news above everything').first()).toBeInViewport();
  });
});

test('a keyboard reader who follows the tutorial below reaches the story\'s opener with one Tab, and Enter folds the story', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const link = page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'the tutorial below'});
  await tabsTo(page, link);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#news-top-story$/);
  await expect(link).not.toBeFocused();
  await expect(page.getByRole('listitem').filter({has: page.getByRole('group', {name: 'The user sees the news above everything'})}).last()).toBeFocused();

  await expect(page.getByText('Make the panel a popover')).toBeVisible();

  await pressTab(page);
  await page.keyboard.press('Enter');

  await expect(page.getByText('Make the panel a popover')).toBeHidden();
});

for (const motion of ['no-preference', 'reduce'] as const) {
  test.describe(`with ${motion} motion asked for`, () => {
    test('a reader who follows step 3\'s link to the slide step lands on that step, its story opened and the step focused', async ({page}) => {
      await page.emulateMedia({reducedMotion: motion});
      await page.goto('demos/?tab=z-index&news=top');

      await page.getByRole('link', {name: 'Slide in from off screen'}).click();

      await expect(page).toHaveURL(/#step-slide-in$/);
      const step = page.getByRole('listitem').filter({has: page.getByRole('heading', {name: 'Slide in from off screen'})}).last();
      await expect(step).toBeFocused();
      await expect(page.getByRole('heading', {name: 'Slide in from off screen'})).toBeInViewport();
    });
  });
}

test('a reader who follows the tutorial below with motion allowed lands on the story\'s heading', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto('demos/?tab=z-index');

  await page.getByRole('region', {name: 'Why a fixed banner still loses'}).getByRole('link', {name: 'the tutorial below'}).click();

  await expect(page).toHaveURL(/#news-top-story$/);
  await expect(page.getByText('The user sees the news above everything').first()).toBeInViewport();
});
