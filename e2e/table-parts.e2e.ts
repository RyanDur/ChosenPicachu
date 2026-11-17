import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {pillSwitch, siteFrame} from './__test_support';

test('a reader follows the need and its clues’ foot on to the sketch’s page with the build kept', async ({page}) => {
  await page.goto('demos/tables/the-need-and-its-clues/?world=vanilla');
  await siteFrame(page).hydrated();

  await page.getByRole('navigation', {name: 'the tables parts'})
    .getByRole('link', {name: 'Next: 2. Sketch a design from the need'}).click();

  await expect(page).toHaveURL(/demos\/tables\/the-sketch\/\?world=vanilla$/);
  await expect(pillSwitch(page, 'world').pill('Vanilla')).toBeChecked();
});
