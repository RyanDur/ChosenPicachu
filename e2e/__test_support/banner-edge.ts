import type {Locator, Page} from '@playwright/test';
import {pillSwitch} from './pills';

type BannerStep = '1 · Written in a card' | '2 · Moved to the page';

export const bannerAtTheEdge = (page: Page) => {
  const exhibit = page.getByRole('region', {name: 'The banner at the window’s edge', exact: true});
  const steps = pillSwitch(page, 'Step');
  return {
    stepsTo: (step: BannerStep): Promise<void> => steps.choose(step),
    step: (step: BannerStep): Locator => steps.pill(step),
    verdict: exhibit.getByRole('status', {name: 'what the browser drew'})
  };
};
