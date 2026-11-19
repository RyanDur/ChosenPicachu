import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {pillSwitch, siteFrame, tablesDemo} from './__test_support';

test('a desk reader follows Sort menu from the parts beside the opening to the Sort menu page', {tag: '@desktop'}, async ({page}) => {
  await page.goto('demos/tables/');
  await siteFrame(page).hydrated();

  await tablesDemo(page).partLink('Sort menu').click();

  await expect(page).toHaveURL(/demos\/tables\/menu\/$/);
  await expect(page.getByRole('region', {name: 'build the sort menu yourself'})).toBeVisible();
});

test('a desk reader who chooses Vanilla beside the opening finds the still table’s part in the Vanilla build', {tag: '@desktop'}, async ({page}) => {
  await page.goto('demos/tables/');
  await siteFrame(page).hydrated();
  await pillSwitch(page, 'world').choose('Vanilla');

  await tablesDemo(page).partLink('Build the still table').click();

  await expect(page).toHaveURL(/demos\/tables\/the-still-table\/\?world=vanilla$/);
  await expect(pillSwitch(page, 'world').pill('Vanilla')).toBeChecked();
});

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

  await page.getByRole('list', {name: 'the slices'}).getByRole('link', {name: 'part 4'}).click();

  await expect(page).toHaveURL(/demos\/tables\/the-still-table\/\?world=vanilla$/);
  await expect(pillSwitch(page, 'world').pill('Vanilla')).toBeChecked();
  await expect(page.getByRole('group', {name: 'The trader can read the market in a table'})).toHaveAttribute('open');
});

test('a reader on a tutorial page reached by a link saved with a story follows the Tables link to the tables tab', async ({page}) => {
  await page.goto('demos/tables/sort/?world=vanilla&living=flow%2Cstore');
  await siteFrame(page).hydrated();

  await page.getByRole('region', {name: 'Drag sort'}).getByRole('link', {name: 'Tables', exact: true}).first().click();

  await expect(page).toHaveURL(/demos\/tables\/\?world=vanilla$/);
  await expect(tablesDemo(page).partLink('Sort menu')).toBeVisible();
});

test('a reader who follows a link out of the live table’s page and comes Back is on the live table’s page', async ({page}) => {
  await page.goto('demos/tables/the-live-table-and-the-store/?world=vanilla');
  await siteFrame(page).hydrated();

  await page.getByRole('link', {name: 'charts tab', exact: true}).click();
  await expect(page).toHaveURL(/demos\/charts\/\?world=vanilla$/);
  await page.goBack();

  await expect(page).toHaveURL(/demos\/tables\/the-live-table-and-the-store\/\?world=vanilla$/);
  await expect(page.getByRole('heading', {level: 2, name: 'Make the table live', exact: true})).toBeVisible();
});

test.describe('a reader with script turned off', () => {
  test.use({javaScriptEnabled: false});

  test('finds both of the live table’s stories open as its page first draws', async ({page}) => {
    await page.goto('demos/tables/the-live-table-and-the-store/');

    await expect(page.getByRole('group', {name: 'The trader can watch the market live, one lookback beside another'})).toHaveAttribute('open');
    await expect(page.getByRole('group', {name: 'The page is a store, and so is the table'})).toHaveAttribute('open');
  });
});
