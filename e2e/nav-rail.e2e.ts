import {expect, test} from '@playwright/test';
import {desktop, iPad13Upright, iPadUpright, iPhone, siteFrame} from './__test_support';

test.describe('a 13-inch iPad held upright', () => {
  test.use(iPad13Upright);

  test('has the nav in reach without scrolling', async ({page}) => {
    await page.goto('');

    await expect(siteFrame(page).nav).toBeInViewport();
  });
});

for (const {size, device} of [{size: 'a phone', device: iPhone}, {size: 'a tablet', device: iPadUpright}, {size: 'a desktop', device: desktop}]) {
  test(`on ${size}, the site nav and Feedback show inside the pages and feedback rail under the real sheet`, async ({browser}) => {
    const context = await browser.newContext(device);
    const page = await context.newPage();
    await page.goto('');
    const rail = page.getByRole('region', {name: 'pages and feedback'});

    await expect(rail.getByRole('navigation', {name: 'site'})).toBeVisible();
    await expect(rail.getByRole('button', {name: 'Feedback'})).toBeVisible();
    await context.close();
  });
}
