import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {popoverExhibit, siteFrame, wholeOnTop} from './__test_support';

const address = 'demos/z-index/why-the-popover-wins/';

test.describe('the menu in the top layer', {tag: ['@iPhone', '@desktop']}, () => {
  test('left alone, the list Sort by opens sits in the middle of the window, over everything', async ({page}) => {
    await page.goto(address);
    await siteFrame(page).hydrated();
    const menu = popoverExhibit(page);

    await menu.sortBy.click();

    await expect(menu.list).toBeVisible();
    await expect.poll(() => menu.centeredInTheWindow()).toBe(true);
    await expect.poll(() => wholeOnTop(menu.list)).toBe(true);
  });

  test('with card one given z-index 9999, the list still opens above the card', async ({page}) => {
    await page.goto(address);
    await siteFrame(page).hydrated();
    const menu = popoverExhibit(page);
    await menu.nineThousand.click();
    await expect(menu.nineThousand).toBeChecked();
    await menu.cardOneUnderTheMiddle();

    await menu.sortBy.click();

    await expect(menu.list).toBeVisible();
    await expect.poll(() => wholeOnTop(menu.list)).toBe(true);
  });
});

test('Escape closes the list and gives focus back to Sort by', async ({page}) => {
  await page.goto(address);
  await siteFrame(page).hydrated();
  const menu = popoverExhibit(page);
  await menu.sortBy.press('Enter');
  await page.keyboard.press('Tab');
  await expect(menu.newest).toBeFocused();

  await page.keyboard.press('Escape');

  await expect(menu.list).toBeHidden();
  await expect(menu.sortBy).toBeFocused();
});

test('a click outside the list closes it', async ({page}) => {
  await page.goto(address);
  await siteFrame(page).hydrated();
  const menu = popoverExhibit(page);
  await menu.sortBy.click();
  await expect(menu.list).toBeVisible();

  await menu.caption.click();

  await expect(menu.list).toBeHidden();
});
