import type {Locator, Page} from '@playwright/test';
import {pressTab} from './keyboard';

const steps = {
  'the clues': {
    step: (page: Page): Locator => page.getByRole('region', {name: 'Start with the need, and let it pick the element', exact: true}),
    before: (step: Locator): Locator => step.getByRole('figure')
  },
  'the layers': {
    step: (page: Page): Locator => page.getByRole('listitem')
      .filter({has: page.getByRole('heading', {name: 'Layer on functionality, in the order it was asked for', exact: true})}),
    before: (step: Locator): Locator => step.getByText(/Both axes, every layer, or the layer is not done/)
  }
};

type Box = {x: number; width: number} | null;

const rightOf = (box: Box): number => box ? box.x + box.width : Infinity;

export type TutorialTableName = keyof typeof steps;

export const tutorialTable = (page: Page, name: TutorialTableName) => {
  const step = steps[name].step(page);
  const table = step.getByRole('table', {name, exact: true});
  const cells = table.getByRole('columnheader').or(table.getByRole('rowheader')).or(table.getByRole('cell'));
  return {
    wordsPastItsStep: async (): Promise<string[]> => {
      const [tableBox, stepBox] = await Promise.all([table.boundingBox(), step.boundingBox()]);
      const edge = Math.min(rightOf(tableBox), rightOf(stepBox));
      return cells.evaluateAll((all, right) => all.filter(cell => {
        const words = document.createRange();
        words.selectNodeContents(cell);
        return [...words.getClientRects()].some(line => line.right > right + 1);
      }).map(cell => cell.textContent.trim()), edge);
    },
    slides: (): Promise<boolean> => table.evaluate(element => element.scrollWidth > element.clientWidth),
    headers: async (): Promise<{columns: number; rows: number}> => ({
      columns: await table.getByRole('columnheader').count(),
      rows: await table.getByRole('rowheader').count()
    }),
    tabLandsInside: async (): Promise<boolean> => {
      await steps[name].before(step).click();
      await pressTab(page);
      return table.evaluate(element => element.contains(document.activeElement));
    }
  };
};
