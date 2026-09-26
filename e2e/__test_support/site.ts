import type {Page} from '@playwright/test';

export const siteFrame = (page: Page) => {
  const nav = page.getByRole('navigation', {name: 'site'});
  const main = page.getByRole('main');
  return {
    nav,
    main,
    railBesideThePage: async (): Promise<boolean> => {
      const rail = await nav.boundingBox();
      const pane = await main.boundingBox();
      return rail !== null && pane !== null && rail.x + rail.width <= pane.x;
    },
    navAboveThePage: async (): Promise<boolean> => {
      const row = await nav.boundingBox();
      const pane = await main.boundingBox();
      return row !== null && pane !== null && row.y + row.height <= pane.y;
    }
  };
};
