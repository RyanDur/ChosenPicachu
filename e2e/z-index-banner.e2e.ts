import {expect, test} from '@playwright/test';
import {bannerTrap, desktop, iPhone} from './__test_support';

const isOnTopAtItsFirstLine = (element: Element): boolean => {
  const {left, top} = element.getBoundingClientRect();
  return element.contains(document.elementFromPoint(left + 4, top + 4));
};

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

    test('the tutorial below brings the step that makes the banner a popover into view, with its story heading clear of the tab bar', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const part = page.getByRole('region', {name: 'Why a fixed banner still loses'});

      await part.getByRole('link', {name: 'the tutorial below'}).click();

      await expect(page.getByText('Make the panel a popover')).toBeInViewport();
      await expect.poll(() => page.getByText('The user sees the news above everything').evaluate(isOnTopAtItsFirstLine)).toBe(true);
    });
  });
}
