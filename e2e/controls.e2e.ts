import {expect, test} from '@playwright/test';
import {demoSettings, desktop, phone, tablesDemo} from './__test_support';

test.describe('a desktop', () => {
  test.use(desktop);

  test('the settings a reader left open stay open when the window is made narrow', async ({page}) => {
    const tables = tablesDemo(page);
    await page.goto('demos/tables/');
    await demoSettings(page).press();
    await expect(tables.controls).toBeVisible();

    await page.setViewportSize(phone.viewport);

    await expect(tables.controls).toBeVisible();
  });
});

test('an address with no dials shows one build, in the table controls and in the recipe', async ({page}) => {
  await page.goto('demos/tables/');

  const story = await tablesDemo(page).openStory('The trader can sort by column');

  await expect(demoSettings(page).summary).toHaveText('settings <EagerTable className="hide animated"/>');
  await expect(story.getByText('Commit inside the move', {exact: true})).toBeVisible();
  await expect(story.getByText('Carry the real thing', {exact: true})).toBeVisible();
  await expect(story.getByText('Let the column settle', {exact: true})).toBeVisible();
});
