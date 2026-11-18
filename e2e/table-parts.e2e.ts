import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {documentScrollY, pillSwitch, siteFrame, twoFramesLater} from './__test_support';

test('a reader follows the need and its clues’ foot on to the sketch’s page with the build kept', async ({page}) => {
  await page.goto('demos/tables/the-need-and-its-clues/?world=vanilla');
  await siteFrame(page).hydrated();

  await page.getByRole('navigation', {name: 'the tables parts'})
    .getByRole('link', {name: 'Next: 2. Sketch a design from the need'}).click();

  await expect(page).toHaveURL(/demos\/tables\/the-sketch\/\?world=vanilla$/);
  await expect(pillSwitch(page, 'world').pill('Vanilla')).toBeChecked();
});

test('a reader follows a slice from the slices’ page to the still table’s page, with the build kept and its story open', async ({page}) => {
  await page.goto('demos/tables/the-slices/?world=vanilla');
  await siteFrame(page).hydrated();

  await page.getByRole('list', {name: 'the slices'}).getByRole('link', {name: 'station 4'}).click();

  await expect(page).toHaveURL(/demos\/tables\/the-still-table\/\?world=vanilla$/);
  await expect(pillSwitch(page, 'world').pill('Vanilla')).toBeChecked();
  await expect(page.getByRole('group', {name: 'The trader can read the market in a table'})).toHaveAttribute('open');
});

test('a reader who follows a link out of the live table’s page and comes Back is where they were', async ({page}) => {
  await page.goto('demos/tables/the-live-table-and-the-store/?world=vanilla');
  await siteFrame(page).hydrated();
  const out = page.getByRole('link', {name: 'charts tab', exact: true});
  await out.scrollIntoViewIfNeeded();
  await twoFramesLater(page);
  const where = await documentScrollY(page);
  expect(where).toBeGreaterThan(0);

  await out.click();
  await expect(page).toHaveURL(/demos\/charts\/\?world=vanilla$/);
  await page.goBack();

  await expect(page).toHaveURL(/demos\/tables\/the-live-table-and-the-store\/\?world=vanilla$/);
  await expect.poll(() => documentScrollY(page)).toBe(where);
});

test.describe('a reader with script turned off', () => {
  test.use({javaScriptEnabled: false});

  test('finds both of the live table’s stories open as its page first draws', async ({page}) => {
    await page.goto('demos/tables/the-live-table-and-the-store/');

    await expect(page.getByRole('group', {name: 'The trader can watch the market live, one lookback beside another'})).toHaveAttribute('open');
    await expect(page.getByRole('group', {name: 'The page is a store, and so is the table'})).toHaveAttribute('open');
  });
});
