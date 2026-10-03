import {expect, test} from '@playwright/test';
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
  });
}

test('the old banner is raised, read and dismissed by keyboard, and focus goes back to its button', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const banners = bannerTrap(page);
  await banners.raiseOld.focus();

  await page.keyboard.press('Enter');
  await expect(banners.oldBanner).toBeVisible();
  await banners.dismissOld.focus();
  await page.keyboard.press('Enter');

  await expect(banners.oldBanner).toHaveCount(0);
  await expect(banners.raiseOld).toBeFocused();
});
