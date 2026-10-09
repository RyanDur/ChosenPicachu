import {expect, test} from '@playwright/test';
import {desktop, iPad13Upright, iPadUpright, iPhone, siteFrame} from './__test_support';

test.describe('a 13-inch iPad held upright', () => {
  test.use(iPad13Upright);

  test('shows the site nav', async ({page}) => {
    await page.goto('');

    await expect(siteFrame(page).nav).toBeVisible();
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

for (const {size, device} of [{size: 'a phone', device: iPhone}, {size: 'a desktop', device: desktop}]) {
  test.describe(`on ${size}, the rail says which page the reader is on`, () => {
    test.use(device);

    test('marks the page the reader lands on, even at an address typed without its slash', async ({page}) => {
      await page.goto('users');

      await expect(page).toHaveURL(/\/users\/$/);
      const nav = siteFrame(page).nav;
      await expect(nav.getByRole('link', {name: 'Users'})).toHaveAttribute('aria-current', 'page');
    });

    test('moves the mark to Demos and back to Home, and the followed item keeps focus', async ({page}) => {
      await page.goto('');
      const nav = siteFrame(page).nav;
      const demos = nav.getByRole('link', {name: 'Demos'});
      await demos.focus();

      await page.keyboard.press('Enter');

      await expect(demos).toHaveAttribute('aria-current', 'page');
      await expect(demos).toBeFocused();

      await page.goBack();

      await expect(nav.getByRole('link', {name: 'Home'})).toHaveAttribute('aria-current', 'page');
      await expect(demos).not.toHaveAttribute('aria-current');
    });
  });
}
