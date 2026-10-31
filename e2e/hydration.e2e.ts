import {expect, test} from '@playwright/test';
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

for (const {path, where, title, current} of [
  {path: 'games/colorGame', where: 'an address with no page', title: 'No such room', current: 'Games'},
  {path: 'gallery/O9138?tab=vam', where: 'a piece’s address', title: 'Great Bed of Ware', current: 'Gallery'}
]) {
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
