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

test('a reader follows the measured height’s foot on to what the platform gives now, with the dials kept', async ({page}) => {
  await page.goto('demos/accordions/the-measured-height/?type=exclusive&style=drawer');
  await siteFrame(page).hydrated();

  await page.getByRole('navigation', {name: 'the accordions parts'})
    .getByRole('link', {name: 'Next: 5. What the platform gives now'}).click();

  await expect(page).toHaveURL(/demos\/accordions\/what-the-platform-gives-now\/\?type=exclusive&style=drawer$/);
  await expect(page.getByRole('heading', {name: 'Exclusive accordion using details elements', exact: true})).toBeVisible();
});

test('a reader follows what the platform gives now’s foot on to how a sliding fold moves, with the dials kept', async ({page}) => {
  await page.goto('demos/accordions/what-the-platform-gives-now/?type=exclusive&style=drawer');
  await siteFrame(page).hydrated();

  await page.getByRole('navigation', {name: 'the accordions parts'})
    .getByRole('link', {name: 'Next: 6. How a sliding fold moves'}).click();

  await expect(page).toHaveURL(/demos\/accordions\/how-a-sliding-fold-moves\/\?type=exclusive&style=drawer$/);
  await expect(accordionsTab(page).partTitle('How a sliding fold moves')).toBeVisible();
});

test('a reader opens how a sliding fold moves from the tab, and its details fold is built with the dials chosen there', async ({page}) => {
  await page.goto('demos/accordions/?type=inclusive&style=drawer');
  await siteFrame(page).hydrated();

  await accordionsTab(page).partLink('How a sliding fold moves').click();

  await expect(page).toHaveURL(/demos\/accordions\/how-a-sliding-fold-moves\/\?type=inclusive&style=drawer$/);
  await expect(page.getByRole('heading', {name: 'Inclusive accordion using details elements', exact: true})).toBeVisible();
});

test('a reader follows the panel from the max-height guess to what the platform gives now, with the dials kept', async ({page}) => {
  await page.goto('demos/accordions/the-max-height-guess/?type=inclusive&style=drawer');
  await siteFrame(page).hydrated();

  await page.getByRole('navigation', {name: 'Parts', exact: true})
    .getByRole('link', {name: 'What the platform gives now'}).click();

  await expect(page).toHaveURL(/demos\/accordions\/what-the-platform-gives-now\/\?type=inclusive&style=drawer$/);
  await expect(page.getByRole('heading', {name: 'Inclusive accordion using details elements', exact: true})).toBeVisible();
});
