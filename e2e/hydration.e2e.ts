import {expect, type Page, test} from '@playwright/test';
import {siteFrame, twoFramesLater} from './__test_support';

for (const path of [
  '', 'record/', 'practice/behavior/', 'demos/accordions/', 'demos/accordions/?type=inclusive', 'demos/z-index/', 'demos/drag-and-drop/',
  'demos/charts/', 'demos/charts/price/', 'demos/tables/', 'demos/tables/?world=vanilla', 'demos/tables/?tut=menu', 'users/', 'gallery/?page=1&size=8&tab=aic', 'gallery/O9138?tab=vam', 'games/', 'games/colorGame'
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

const withoutScript = 'The script draws this page, and it is off. The pages the rail lists are here without it.';

for (const {path, where, title, current} of [
  {path: 'games/colorGame', where: 'an address with no page', title: 'No such room', current: 'Games'},
  {path: 'gallery/O9138?tab=vam', where: 'a piece’s address', title: 'A piece', current: 'Gallery'}
]) {
  test.describe(`a reader with script off at ${where}`, () => {
    test.use({javaScriptEnabled: false});

    test('finds the site under its own name, with no page on the rail marked, and is told why the room is empty', async ({page}) => {
      const answer = await page.goto(path);
      const frame = siteFrame(page);

      expect(answer?.status()).toBe(404);
      await expect(page).toHaveTitle('Chosen Picachu');
      await expect(frame.title).toHaveText('Chosen Picachu');
      await expect(frame.nav.getByRole('link')).toHaveCount(8);
      for (const link of await frame.nav.getByRole('link').all()) {
        await expect(link).not.toHaveAttribute('aria-current');
      }
      await expect(page.getByRole('main').getByRole('paragraph')).toHaveText(withoutScript);
      await expect(page.getByRole('link', {name: 'Discussions page on GitHub'})).toBeVisible();
    });
  });

  test(`a reader whose script has yet to arrive at ${where} sees the site under its own name, and not the words kept for a reader without it`, async ({page}) => {
    await page.route('**/*.js', route => route.abort());
    await page.goto(path);

    await expect(siteFrame(page).title).toHaveText('Chosen Picachu');
    await expect(page.getByRole('main')).toHaveText('');
  });

  test(`the script at ${where} draws its own room, with its page marked on the rail`, async ({page}) => {
    await page.goto(path);

    await expect(siteFrame(page).title).toHaveText(title);
    await expect(siteFrame(page).nav.getByRole('link', {name: current})).toHaveAttribute('aria-current', 'page');
  });
}
