import {expect, test as base} from '@playwright/test';
import {accordionsTab, showing, type Build} from './accordions';

export const test = base.extend<object, {workerOfItsOwn: string}>({workerOfItsOwn: ['the accordions tab', {scope: 'worker', option: true}]});

export const layoutRounding = 1;

export const everyBuildJourneys = (fold: readonly Build[]): void => {
  for (const build of fold.filter(build => build !== 'the details build')) {
    test(`a keyboard reader opens the first fold of ${build} and reads its text`, async ({page}) => {
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      await expect(part.fold).toBeVisible();

      await part.openByKeyboard();

      await expect.poll(part.isOpen).toBe(true);
      await expect.poll(part.showsText).toBe(true);
    });
  }
};
