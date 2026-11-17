import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {accordionsTab, siteFrame} from './__test_support';

test('a reader follows the measured height from the accordions tab to its page, with the fold it measures at its top', async ({page}) => {
  await page.goto('demos/accordions/');
  await siteFrame(page).hydrated();

  await accordionsTab(page).partLink('The measured height').click();

  await expect(page).toHaveURL(/demos\/accordions\/the-measured-height\/$/);
  await expect(accordionsTab(page).partTitle('The measured height')).toBeVisible();
  await expect(page.getByTitle('A fold measured by plain script')).toBeVisible();
});

test('the measured height’s page builds its fold with the fold type chosen on the tab', async ({page}) => {
  await page.goto('demos/accordions/?type=inclusive&style=drawer');
  await siteFrame(page).hydrated();

  await accordionsTab(page).partLink('The measured height').click();
  await page.getByText('How this site does it', {exact: true}).click();

  await expect(page).toHaveURL(/demos\/accordions\/the-measured-height\/\?type=inclusive&style=drawer$/);
  await expect(page.getByRole('heading', {name: 'Accordion using checkboxes and a measured height', exact: true})).toBeVisible();
});
