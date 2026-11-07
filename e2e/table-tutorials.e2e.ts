import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {siteFrame, tablesDemo} from './__test_support';

test('a reader picks a tutorial from the tables tab, and Back and Forward step through the picks', async ({page}) => {
  const {tutorials} = tablesDemo(page);
  await page.goto('demos/tables/');
  await siteFrame(page).hydrated();

  await tutorials.link('Sort menu').click();
  await expect(page).toHaveURL(/demos\/tables\/menu\/$/);
  await expect(tutorials.title('Sort menu')).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/demos\/tables\/$/);
  await expect(tutorials.link('Sort menu')).toBeVisible();

  await page.goForward();
  await expect(tutorials.title('Sort menu')).toBeVisible();
});

test.describe('a reader with script turned off', () => {
  test.use({javaScriptEnabled: false});

  test('picks a tutorial from the tables tab and reads it whole', async ({page}) => {
    const {tutorials} = tablesDemo(page);
    await page.goto('demos/tables/');

    await tutorials.link('Drag resize').click();

    await expect(page).toHaveURL(/demos\/tables\/resize\/$/);
    await expect(tutorials.title('Drag resize')).toBeVisible();
    await expect(tutorials.firstStory).toBeVisible();
  });
});
