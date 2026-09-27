import {Locator, Page, expect, test} from '@playwright/test';
import {chartsPage, dragSortTable, stages} from './__test_support';

const menus: readonly {exhibit: string; at: string; toggle: (page: Page) => Locator; menu: (page: Page) => Locator}[] = [
  {exhibit: 'the price period', at: 'demos/?tab=charts', toggle: page => chartsPage(page).periodToggle, menu: page => page.getByLabel('price period by')},
  {exhibit: "a column's sort", at: 'demos/?tab=tables', toggle: page => dragSortTable(page, stages[0].table(page)).sortToggle('trades'), menu: page => dragSortTable(page, stages[0].table(page)).sortMenu('trades')}
];

for (const {exhibit, at, toggle, menu} of menus) {
  test(`${exhibit} menu opens from the keyboard and closes on Escape`, async ({page}) => {
    await page.goto(at);
    await expect(toggle(page)).toBeVisible({timeout: 30_000});

    await toggle(page).focus();
    await page.keyboard.press('Enter');
    await expect(menu(page)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu(page)).toBeHidden();
  });
}
