import {expect} from '@playwright/test';
import {test as base} from './journey';
import {accordions, type Build} from './accordions';

export const test = base.extend<object, {workerOfItsOwn: string}>({workerOfItsOwn: ['the accordions tab', {scope: 'worker', option: true}]});

export const layoutRounding = 1;

export const everyBuildJourneys = (builds: readonly Build[]): void => {
  for (const build of builds.filter(build => build !== 'the details build')) {
    test(`a keyboard reader opens the first fold of ${build} and reads its text`, async ({page}) => {
      await accordions.tab(page).goTo(build);
      const part = accordions.tab(page).firstPartOf(build);
      await expect(part.fold).toBeVisible();

      await part.openByKeyboard();

      await expect.poll(part.isOpen).toBe(true);
      await expect.poll(part.showsText).toBe(true);
    });
  }
};

export const openAndCloseJourneys = (builds: readonly Build[]): void => {
  for (const build of builds) {
    test(`a reader opens a part of ${build}, closes it again, and its text goes`, async ({page}) => {
      await accordions.tab(page).goTo(build);
      const part = accordions.tab(page).firstPartOf(build);
      await part.open();
      await expect.poll(part.showsText).toBe(true);

      await part.close();

      await expect.poll(part.showsText).toBe(false);
    });
  }
};
