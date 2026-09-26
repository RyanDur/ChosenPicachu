import {Page, expect, test} from '@playwright/test';
import {fingerTap, iPhone, phoneSideways} from './__test_support';

const doorFold = (page: Page) => page.getByRole('group').filter({has: page.getByText('how I organize it', {exact: true})}).first();
const explainer = (page: Page) => page.getByRole('group').filter({has: page.getByText('what am I looking at?', {exact: true})}).first();

for (const {reader, device} of [{reader: 'a phone', device: iPhone}, {reader: 'a phone held sideways', device: phoneSideways}]) {
  test.describe(reader, () => {
    test.use(device);

    test('opens a page from a finger that lands just off a link in the nav', async ({page}) => {
      await page.goto('');

      await fingerTap(page, page.getByRole('navigation', {name: 'site'}).getByRole('link', {name: 'Users'}));

      await expect(page).toHaveURL(/users/);
    });

    test('opens and closes how I organize it with a finger that lands just off the line', async ({page}) => {
      await page.goto('');
      const fold = doorFold(page);
      const told = fold.getByRole('paragraph', {includeHidden: true}).first();
      await expect(told).toBeHidden();

      await fingerTap(page, fold.getByText('how I organize it', {exact: true}));
      await expect(told).toBeVisible();

      await fingerTap(page, fold.getByText('how I organize it', {exact: true}));
      await expect(told).toBeHidden();
    });

    test('opens and closes what am I looking at with a finger that lands just off the line', async ({page}) => {
      await page.goto('demos/?tab=charts');
      const fold = explainer(page);
      const told = fold.getByRole('paragraph', {includeHidden: true}).first();
      await expect(fold).toBeVisible({timeout: 30_000});
      await expect(told).toBeHidden();

      await fingerTap(page, fold.getByText('what am I looking at?', {exact: true}));
      await expect(told).toBeVisible();

      await fingerTap(page, fold.getByText('what am I looking at?', {exact: true}));
      await expect(told).toBeHidden();
    });

    test('closes a banner with a finger that lands just off its dismiss', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      await page.getByRole('button', {name: 'raise a banner'}).tap();
      const dismiss = page.getByRole('alert').getByRole('button', {name: /^dismiss/}).first();
      await expect(dismiss).toBeVisible();

      await fingerTap(page, dismiss);

      await expect(page.getByRole('alert').getByRole('button', {name: /^dismiss/})).toHaveCount(0);
    });
  });
}
