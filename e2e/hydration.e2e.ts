import {expect, type Page} from '@playwright/test';
import {test} from './__test_support/journey';
import {pages} from './pages';
import {accordionsTab, siteFrame, twoFramesLater} from './__test_support';

const addressesBesideThePages = ['gallery/?page=1&size=8&tab=aic', 'gallery/O9138?tab=vam', 'games/colorGame'];

for (const path of [...pages.map(({path}) => path), ...addressesBesideThePages]) {
  test(`the script takes over /${path} without an error`, async ({page}) => {
    await page.goto(path);

    await siteFrame(page).hydrated();
    await twoFramesLater(page);
  });
}

test('a reader whose room fails to load keeps the built page, its words, its folds and its links', async ({page}) => {
  await page.route(/\/assets\/(route|tab)-[^/]+\.js$/, route => route.abort());
  const roomRefused = page.waitForEvent('console', message =>
    message.type() === 'error' && message.text().includes('/demos/accordions/ did not load'));
  await page.goto('demos/accordions/');
  await roomRefused;
  const fold = accordionsTab(page).htmlAloneFold('basalt');

  await expect(page.getByRole('heading', {name: 'An accordion in HTML alone'})).toBeVisible();
  await fold.open();
  await expect.poll(fold.showsText).toBe(true);
  await expect(siteFrame(page).feedback).toHaveAttribute('inert');
  await siteFrame(page).nav.getByRole('link', {name: 'Record'}).click();
  await expect(siteFrame(page).title).toHaveText('The record');
});

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
