import {Page, expect, test} from '@playwright/test';
import {bannerTrap, desktop, iPhone} from './__test_support';

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
