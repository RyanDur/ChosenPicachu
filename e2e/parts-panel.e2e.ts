import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {partsPanel} from './__test_support/parts-panel';

test.describe('a reader on a desk or a phone', {tag: ['@desktop', '@iPhone']}, () => {
  test('folds the parts list away, and the tab’s size and Show parts stay', async ({page}) => {
    const panel = partsPanel(page);
    await panel.openTheSketch();

    await panel.hideTheParts();

    await expect(panel.parts).toBeHidden();
    await expect(panel.partsAndMinutes).toBeVisible();
    await expect(panel.showParts).toBeVisible();
  });

  test('brings the parts list back with the part it is on marked', async ({page}) => {
    const panel = partsPanel(page);
    await panel.openTheSketch();
    await panel.hideTheParts();

    await panel.showTheParts();

    await expect(panel.parts).toBeVisible();
    await expect(panel.parts.getByRole('link', {name: 'Sketch a design from the need'}))
      .toHaveAttribute('aria-current', 'page');
  });

  test('finds the parts list still folded on the next part and again after Back', async ({page}) => {
    const panel = partsPanel(page);
    await panel.openTheSketch();
    await panel.hideTheParts();

    await panel.goToTheNextPart();

    await expect(panel.partTitled('Slice the design into stories')).toBeVisible();
    await expect(panel.showParts).toBeVisible();
    await expect(panel.parts).toBeHidden();

    await page.goBack();

    await expect(panel.partTitled('Sketch a design from the need')).toBeVisible();
    await expect(panel.showParts).toBeVisible();
    await expect(panel.parts).toBeHidden();
  });
});
