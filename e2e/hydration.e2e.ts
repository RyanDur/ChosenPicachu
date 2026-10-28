import {expect, type Page, test} from '@playwright/test';
import {siteFrame, twoFramesLater} from './__test_support';

for (const path of [
  '', 'record/', 'practice/behavior/', 'demos/accordions/', 'demos/accordions/?type=inclusive', 'demos/z-index/', 'demos/drag-and-drop/',
  'demos/charts/', 'demos/charts/price/', 'demos/tables/', 'demos/tables/?world=vanilla', 'demos/tables/?tut=menu', 'users/', 'gallery/?page=1&size=8&tab=aic', 'games/'
]) {
  test(`the script takes over /${path} without an error`, async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(path);

    await siteFrame(page).hydrated();
    await twoFramesLater(page);

    expect(errors).toEqual([]);
  });
}

test.describe('a reader with script off', () => {
  test.use({javaScriptEnabled: false});

  for (const {path, needScript} of [
    {path: 'demos/tables/', needScript: (page: Page) => [page.getByRole('button', {name: /^move row \d/}), page.getByRole('button', {name: /^resize /}), page.getByRole('button', {name: /^sort /})]},
    {path: 'demos/drag-and-drop/', needScript: (page: Page) => [page.getByRole('button', {name: /^grip for /})]},
    {path: 'users/', needScript: (page: Page) => [page.getByRole('button', {name: 'Draw a new avatar'}), page.getByRole('button', {name: 'Reset'}), page.getByRole('button', {name: 'Add'})]},
    {path: 'demos/z-index/', needScript: (page: Page) => [page.getByRole('group', {name: 'What card one wears'}).getByRole('radio'), page.getByRole('checkbox', {name: 'Card one has z-index: 1'})]}
  ]) {
    test(`finds the controls on /${path} that need the script there, and disabled`, async ({page}) => {
      await page.goto(path);

      for (const controls of needScript(page)) {
        await expect(controls.first()).toBeVisible();
        for (const control of await controls.all()) {
          await expect(control).toBeDisabled();
        }
      }
    });
  }
});
