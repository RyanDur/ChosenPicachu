import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {demoSettings, devices, tablesDemo} from './__test_support';

test('the settings a reader left open stay open when the window is made narrow', {tag: '@desktop'}, async ({page}) => {
  const tables = tablesDemo(page);
  await page.goto('demos/tables/sort/');
  await demoSettings(page).press();
  await expect(tables.controls).toBeVisible();

  await page.setViewportSize(devices.phone.viewport);

  await expect(tables.controls).toBeVisible();
});
