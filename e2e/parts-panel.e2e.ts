import {expect, type Page} from '@playwright/test';
import {test} from './__test_support/journey';
import {siteFrame} from './__test_support';

const parts = (page: Page) => page.getByRole('navigation', {name: 'Parts', exact: true});
const hideParts = (page: Page) => page.getByRole('button', {name: 'Hide parts'});
const showParts = (page: Page) => page.getByRole('button', {name: 'Show parts'});
const tablesSize = (page: Page) => page.getByText(/^Eight parts, about \d+ minutes\.$/);
const next = (page: Page) => page.getByRole('navigation', {name: 'the tables parts'}).getByRole('link', {name: /^Next: /});
const partTitled = (page: Page, title: string) => page.getByRole('heading', {level: 2, name: title, exact: true});

const onTheSketch = async (page: Page): Promise<void> => {
  await page.goto('demos/tables/the-sketch/');
  await siteFrame(page).hydrated();
};

test.describe('a reader on a desk or a phone', {tag: ['@desktop', '@iPhone']}, () => {
  test('folds the parts list away, and the tab’s size and Show parts are left above the part', async ({page}) => {
    await onTheSketch(page);

    await hideParts(page).click();

    await expect(parts(page)).toBeHidden();
    await expect(tablesSize(page)).toBeVisible();
    await expect(showParts(page)).toBeVisible();
  });

  test('brings the parts list back with the part it is on marked', async ({page}) => {
    await onTheSketch(page);
    await hideParts(page).click();

    await showParts(page).click();

    await expect(parts(page).getByRole('link', {name: 'Sketch a design from the need'}))
      .toHaveAttribute('aria-current', 'page');
  });

  test('finds the parts list still folded on the next part and again after Back', async ({page}) => {
    await onTheSketch(page);
    await hideParts(page).click();

    await next(page).click();

    await expect(partTitled(page, 'Slice the design into stories')).toBeVisible();
    await expect(showParts(page)).toBeVisible();
    await expect(parts(page)).toBeHidden();

    await page.goBack();

    await expect(partTitled(page, 'Sketch a design from the need')).toBeVisible();
    await expect(showParts(page)).toBeVisible();
    await expect(parts(page)).toBeHidden();
  });

  test('pressing Enter on Hide parts lands on Show parts, which says the list is collapsed', async ({page}) => {
    await onTheSketch(page);
    await hideParts(page).focus();

    await page.keyboard.press('Enter');

    await expect(page.getByRole('button', {name: 'Show parts', expanded: false})).toBeFocused();
  });
});

test('a reader on a part’s page with nothing folded finds Hide parts said as expanded', {tag: '@desktop'}, async ({page}) => {
  await onTheSketch(page);

  await expect(page.getByRole('button', {name: 'Hide parts', expanded: true})).toBeVisible();
});

test('a reader on the tab’s opening page finds no Hide parts', {tag: '@desktop'}, async ({page}) => {
  await page.goto('demos/tables/');
  await siteFrame(page).hydrated();

  await expect(parts(page)).toBeVisible();
  await expect(hideParts(page)).toHaveCount(0);
});
