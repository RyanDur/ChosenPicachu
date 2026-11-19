import type {Locator, Page} from '@playwright/test';
import {pressTab} from './keyboard';

const steps = {
  'the clues': {
    step: (page: Page): Locator => page.getByRole('region', {name: 'Start with the need, and let it pick the element', exact: true}),
    before: (step: Locator): Locator => step.getByRole('figure')
  },
  'the features': {
    step: (page: Page): Locator => page.getByRole('region', {name: 'let’s build this feature', exact: true}),
    before: (step: Locator): Locator => step.getByRole('paragraph').first()
  }
};

export type TutorialTableName = keyof typeof steps;

export const tutorialTable = (page: Page, name: TutorialTableName) => {
  const step = steps[name].step(page);
  const table = step.getByRole('table', {name, exact: true});
  return {
    tabLandsInside: async (): Promise<boolean> => {
      await steps[name].before(step).click();
      await pressTab(page);
      return table.evaluate(element => element.contains(document.activeElement));
    }
  };
};
