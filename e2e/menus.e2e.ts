import {Locator, Page, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {chartsPage, dragSortTable, siteFrame, stages} from './__test_support';

const opensFromTheKeyboardClosesOnEscape = async (
  page: Page,
  at: string,
  toggle: Locator,
  menu: Locator
): Promise<void> => {
  await page.goto(at);
  await expect(toggle).toBeVisible({timeout: 30_000});
  await siteFrame(page).hydrated();

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
};

test('the price period menu opens from the keyboard and closes on Escape', ({page}) =>
  opensFromTheKeyboardClosesOnEscape(page, 'demos/charts/', chartsPage(page).periodToggle, page.getByLabel('price period by')));

test("a column's sort menu opens from the keyboard and closes on Escape", ({page}) => {
  const trades = dragSortTable(page, stages[0].table(page));

  return opensFromTheKeyboardClosesOnEscape(page, 'demos/tables/', trades.sortToggle('trades'), trades.sortMenu('trades'));
});
