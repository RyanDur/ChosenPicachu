import type {Page} from '@playwright/test';

export const seedRandom = async (page: Page, seed: number): Promise<void> => {
  await page.addInitScript(start => {
    let state = start;
    Math.random = () => {
      state = state * 16807 % 2147483647;
      return (state - 1) / 2147483646;
    };
  }, seed);
};
