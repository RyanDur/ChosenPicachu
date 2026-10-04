import type {Locator, Page} from '@playwright/test';

const roomBefore = (word: Locator): Promise<number> => word.evaluate(element => {
  const range = document.createRange();
  range.selectNodeContents(element);
  return range.getBoundingClientRect().left;
});

const roomAfter = (word: Locator): Promise<number> => word.evaluate(element => {
  const range = document.createRange();
  range.selectNodeContents(element);
  return document.documentElement.clientWidth - range.getBoundingClientRect().right;
});

export const siteFrame = (page: Page) => {
  const nav = page.getByRole('navigation', {name: 'site'});
  const main = page.getByRole('main');
  return {
    nav,
    main,
    title: page.getByRole('heading', {level: 1}),
    home: nav.getByRole('link', {name: 'Home', exact: true}),
    roomBeforeHome: (): Promise<number> => roomBefore(nav.getByRole('link', {name: 'Home'})),
    roomAfterFeedback: (): Promise<number> => roomAfter(page.getByRole('button', {name: 'Feedback', exact: true})),
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
