import {expect, type Page, test} from '@playwright/test';
import {pages} from './pages';
import {siteFrame, twoFramesLater} from './__test_support';

const addressesBesideThePages = ['gallery/?page=1&size=8&tab=aic', 'gallery/O9138?tab=vam', 'games/colorGame'];

for (const path of [...pages.map(({path}) => path), ...addressesBesideThePages]) {
  test(`the script takes over /${path} without an error`, async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(path);

    await siteFrame(page).hydrated();
    await twoFramesLater(page);

    expect(errors).toEqual([]);
  });
}

const theSiteNameBeforeTheScript = async (page: Page, path: string): Promise<void> => {
  await page.route('**/*.js', route => route.abort());
  await page.goto(path);

  await expect(siteFrame(page).title).toHaveText('Chosen Picachu');
  await expect(page.getByRole('main')).toHaveText('');
};

const theScriptDrawsItsRoom = async (page: Page, path: string, title: string, current: string): Promise<void> => {
  await page.goto(path);

  await expect(siteFrame(page).title).toHaveText(title);
  await expect(siteFrame(page).nav.getByRole('link', {name: current})).toHaveAttribute('aria-current', 'page');
};

test('a reader whose script has yet to arrive at an address with no page sees the site under its own name, and not the words kept for a reader without it', ({page}) =>
  theSiteNameBeforeTheScript(page, 'games/colorGame'));

test('the script at an address with no page draws its own room, with its page marked on the rail', ({page}) =>
  theScriptDrawsItsRoom(page, 'games/colorGame', 'No such room', 'Games'));

test('a reader whose script has yet to arrive at a piece’s address sees the site under its own name, and not the words kept for a reader without it', ({page}) =>
  theSiteNameBeforeTheScript(page, 'gallery/O9138?tab=vam'));

test('the script at a piece’s address draws its own room, with its page marked on the rail', ({page}) =>
  theScriptDrawsItsRoom(page, 'gallery/O9138?tab=vam', 'Great Bed of Ware', 'Gallery'));
