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

  test('folds the parts away on the tab’s own page, and the tab’s size and Show parts stay', async ({page}) => {
    const panel = partsPanel(page);
    await panel.openTheTab();

    await panel.hideTheParts();

    await expect(panel.parts).toBeHidden();
    await expect(panel.partsAndMinutes).toBeVisible();
    await expect(panel.showParts).toBeVisible();
  });

  test('opens a shared link with the parts hidden, and brings them back with Show parts', async ({page}) => {
    const panel = partsPanel(page);
    await panel.openTheTab('demos/tables/?parts=hidden');

    await panel.showTheParts();

    await expect(panel.parts).toBeVisible();
  });

  test('finds the parts still hidden on the tab’s own page after hiding them on a part, and again after Back', async ({page}) => {
    const panel = partsPanel(page);
    await panel.openTheSketch();
    await panel.hideTheParts();

    await panel.goToTheTab();

    await expect(panel.showParts).toBeVisible();
    await expect(panel.parts).toBeHidden();

    await page.goBack();

    await expect(panel.partTitled('Sketch a design from the need')).toBeVisible();
    await expect(panel.parts).toBeHidden();
  });

  test('keeps the world dial on the page when the parts hide', async ({page}) => {
    const panel = partsPanel(page);
    await panel.openTheSketch();

    await panel.hideTheParts();

    await expect(panel.showParts).toBeVisible();
    await expect(panel.world).toBeVisible();
  });
});
