import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {iPhone, phoneSideways, siteFrame} from './__test_support';

const pages = ['Home', 'Record', 'Practice', 'Demos', 'Users', 'Gallery', 'Games', 'Repo'];

for (const {held, device} of [{held: 'upright', device: iPhone}, {held: 'on its side', device: phoneSideways}]) {
  test.describe(`a phone held ${held}`, () => {
    test.use(device);

    test('opens on the page’s title, with the site menu in reach and the site’s pages out of sight', async ({page}) => {
      await page.goto('record/');

      await expect(siteFrame(page).title).toHaveText('The record');
      await expect(siteFrame(page).menu).toBeVisible();
      await expect(siteFrame(page).nav).toBeHidden();
    });

    test('the site menu shows the eight pages in order, with the page the reader is on marked', async ({page}) => {
      await page.goto('users/');
      await siteFrame(page).hydrated();

      await siteFrame(page).menu.tap();

      const nav = siteFrame(page).nav;
      await expect(nav.getByRole('link')).toHaveText(pages);
      await expect(nav.getByRole('link', {name: 'Users'})).toHaveAttribute('aria-current', 'page');
    });

    test('the site menu marks the page the reader lands on, even at an address typed without its slash', async ({page}) => {
      await page.goto('users');
      await siteFrame(page).hydrated();

      await siteFrame(page).menu.tap();

      await expect(page).toHaveURL(/\/users\/$/);
      await expect(siteFrame(page).nav.getByRole('link', {name: 'Users'})).toHaveAttribute('aria-current', 'page');
    });

    test('choosing Demos opens it, and the site menu then marks Demos', async ({page}) => {
      await page.goto('');
      await siteFrame(page).hydrated();
      await siteFrame(page).menu.tap();

      await siteFrame(page).nav.getByRole('link', {name: 'Demos'}).tap();

      await expect(page).toHaveURL(/\/demos\//);
      await siteFrame(page).menu.tap();
      await expect(siteFrame(page).nav.getByRole('link', {name: 'Demos'})).toHaveAttribute('aria-current', 'page');
    });

    test('Feedback in the foot opens its dialog', async ({page}) => {
      await page.goto('');
      await siteFrame(page).hydrated();

      await siteFrame(page).feedback.tap();

      await expect(page.getByRole('dialog', {name: 'Feedback'})).toBeVisible();
    });

    test('Escape closes the site menu', async ({page}) => {
      await page.goto('');
      await siteFrame(page).hydrated();
      await siteFrame(page).menu.tap();
      await expect(siteFrame(page).nav).toBeVisible();

      await page.keyboard.press('Escape');

      await expect(siteFrame(page).nav).toBeHidden();
    });

    test('a tap outside the site menu closes it', async ({page}) => {
      await page.goto('');
      await siteFrame(page).hydrated();
      await siteFrame(page).menu.tap();
      await expect(siteFrame(page).nav).toBeVisible();

      await page.touchscreen.tap(10, 10);

      await expect(siteFrame(page).nav).toBeHidden();
    });

    test('choosing a page in the site menu opens it and closes the menu', async ({page}) => {
      await page.goto('');
      await siteFrame(page).hydrated();
      await siteFrame(page).menu.tap();

      await siteFrame(page).nav.getByRole('link', {name: 'Record'}).tap();

      await expect(page).toHaveURL(/\/record\/$/);
      await expect(siteFrame(page).nav).toBeHidden();
    });
  });
}
