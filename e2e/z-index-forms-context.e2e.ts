import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {contextChooser, hydration, wearsReportedWrong, type Worn} from './__test_support';

const whereTheListOpens: readonly [Worn, 'over' | 'under'][] = [
  ['nothing', 'over'],
  ['position: relative', 'over'],
  ['outline', 'over'],
  ['z-index: 1', 'under'],
  ['opacity: 0.9', 'under'],
  ['transform: rotate(-1deg)', 'under'],
  ['isolation: isolate', 'under']
];

test('choosing each thing card one wears in turn opens the menu over card two for the three that form no context, and under it for the four that do', {tag: ['@iPhone', '@desktop']}, async ({page}) => {
  await page.goto('demos/z-index/what-else-forms-a-stacking-context/');

  expect(await wearsReportedWrong(page, whereTheListOpens)).toEqual([]);
});

test('going back past a choice takes back the sentence, which no longer matches the cards', async ({page}) => {
  await page.goto('demos/z-index/what-else-forms-a-stacking-context/');
  const chooser = contextChooser(page);
  await chooser.wearing('opacity: 0.9').click();
  await chooser.open();
  await expect(chooser.said).toContainText('under card two');
  await page.keyboard.press('Escape');

  await page.goBack();

  await expect(chooser.wearing('nothing')).toBeChecked();
  await expect(chooser.said).toBeEmpty();
});

test('pressing the old-way Sort by again closes its menu', async ({page}) => {
  await page.goto('demos/z-index/what-else-forms-a-stacking-context/');
  const chooser = contextChooser(page);
  await chooser.open();
  await expect(page.getByRole('menu')).toBeVisible();

  await chooser.sortBy.click();

  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(chooser.sortBy).toBeFocused();
});

test('Shift+Tab from a choice closes the old-way menu, wherever focus lands', async ({page}) => {
  await page.goto('demos/z-index/what-else-forms-a-stacking-context/');
  const chooser = contextChooser(page);
  await chooser.openByKeyboard();
  await expect(chooser.choice('name')).toBeFocused();

  await page.keyboard.press('Shift+Tab');

  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(chooser.sortBy).toHaveAttribute('aria-expanded', 'false');
});

test('a press outside the open old-way menu closes it', async ({page}) => {
  await page.goto('demos/z-index/what-else-forms-a-stacking-context/');
  const chooser = contextChooser(page);
  await chooser.open();
  await expect(page.getByRole('menu')).toBeVisible();

  await chooser.heading.click();

  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('given the page before its script runs, the old-way Sort by is disabled; once the script runs, the first Enter opens its menu', async ({page}) => {
  const address = 'demos/z-index/what-else-forms-a-stacking-context/';
  await hydration(page).holdBack(address);
  await page.goto(address);
  const chooser = contextChooser(page);

  await expect(chooser.sortBy).toBeDisabled();
  await hydration(page).release();

  await chooser.openByKeyboard();

  await expect(chooser.choice('name')).toBeFocused();
});
