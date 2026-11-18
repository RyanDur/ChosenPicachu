import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {desktop, iPad13Upright, iPadUpright, iPhone, siteFrame} from './__test_support';

test.describe('a 13-inch iPad held upright', () => {
  test.use(iPad13Upright);

  test('shows the site nav', async ({page}) => {
    await page.goto('');

    await expect(siteFrame(page).nav).toBeVisible();
  });
});

for (const {size, device} of [{size: 'a tablet', device: iPadUpright}, {size: 'a desktop', device: desktop}]) {
  test.describe(`on ${size}`, () => {
    test.use(device);

    test('the site nav and Feedback show inside the pages and feedback rail under the real style sheet', async ({page}) => {
      await page.goto('');
      const rail = page.getByRole('region', {name: 'pages and feedback'});

      await expect(rail.getByRole('navigation', {name: 'site'})).toBeVisible();
      await expect(rail.getByRole('button', {name: 'Feedback'})).toBeVisible();
    });
  });
}

test.describe('on a phone', () => {
  test.use(iPhone);

  test('Feedback and the site menu show inside the pages and feedback rail under the real style sheet', async ({page}) => {
    await page.goto('');
    const rail = page.getByRole('region', {name: 'pages and feedback'});

    await expect(rail.getByRole('button', {name: 'Feedback'})).toBeVisible();
    await expect(rail.getByRole('button', {name: 'Site menu'})).toBeVisible();
  });
});

test.describe('on a desktop, the rail says which page the reader is on', () => {
  test.use(desktop);

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
