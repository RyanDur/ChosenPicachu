import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {accordionsTab, siteFrame} from './__test_support';

test('a reader follows a box remembers the fold from the accordions tab to its page, with the known-height fold at its top', async ({page}) => {
  await page.goto('demos/accordions/');
  await siteFrame(page).hydrated();

  await accordionsTab(page).partLink('A box remembers the fold, and a rule reads it').click();

  await expect(page).toHaveURL(/demos\/accordions\/a-box-remembers-the-fold\/$/);
  await expect(accordionsTab(page).partTitle('A box remembers the fold, and a rule reads it')).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Accordion using a radio group and a known height', exact: true})).toBeVisible();
});

test('a box remembers the fold’s page builds its fold with the fold type chosen on the tab', async ({page}) => {
  await page.goto('demos/accordions/?type=inclusive&style=drawer');
  await siteFrame(page).hydrated();

  await accordionsTab(page).partLink('A box remembers the fold, and a rule reads it').click();

  await expect(page).toHaveURL(/demos\/accordions\/a-box-remembers-the-fold\/\?type=inclusive&style=drawer$/);
  await expect(page.getByRole('heading', {name: 'Accordion using checkboxes and a known height', exact: true})).toBeVisible();
});

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
  await page.getByText('How this page builds it', {exact: true}).click();

  await expect(page).toHaveURL(/demos\/accordions\/the-measured-height\/\?type=inclusive&style=drawer$/);
  await expect(page.getByRole('heading', {name: 'Accordion using checkboxes and a measured height', exact: true})).toBeVisible();
});

test('a reader follows the measured height’s foot on to the next part, and lands on its heading on the tab with the dials kept', async ({page}) => {
  await page.goto('demos/accordions/the-measured-height/?type=exclusive&style=drawer');
  await siteFrame(page).hydrated();

  await page.getByRole('navigation', {name: 'the accordions parts'})
    .getByRole('link', {name: 'Next: 5. What the platform gives now'}).click();

  await expect(page).toHaveURL(/demos\/accordions\/\?type=exclusive&style=drawer#platform-way-heading$/);
  await expect(page.getByRole('group', {name: 'fold type'}).getByRole('radio', {name: 'Exclusive'})).toBeChecked();
});
