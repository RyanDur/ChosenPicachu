import type {Page} from '@playwright/test';
import {pressTab} from './keyboard';

export const tutorialTable = (page: Page, name: string) => {
  const table = page.getByRole('table', {name, exact: true});
  return {
    table,
    wordsPastItsPart: (): Promise<string[]> => table.evaluate(element => {
      const edge = Math.min(element.getBoundingClientRect().right, element.parentElement?.getBoundingClientRect().right ?? Infinity);
      return [...element.querySelectorAll('th, td')].filter(cell => {
        const words = document.createRange();
        words.selectNodeContents(cell);
        return [...words.getClientRects()].some(line => line.right > edge + 1);
      }).map(cell => cell.textContent.trim());
    }),
    slides: (): Promise<boolean> => table.evaluate(element => element.scrollWidth > element.clientWidth),
    headers: async (): Promise<{columns: number; rows: number}> => ({
      columns: await table.getByRole('columnheader').count(),
      rows: await table.getByRole('rowheader').count()
    }),
    tabLandsInside: async (): Promise<boolean> => {
      await table.locator('xpath=preceding-sibling::*[1]').click();
      await pressTab(page);
      return table.evaluate(element => element.contains(document.activeElement));
    }
  };
};
