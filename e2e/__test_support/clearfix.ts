import type {Page} from '@playwright/test';
import {pillSwitch} from './pills';
import {siteFrame} from './site';

type ClearfixStep = '1 · In the flow' | '2 · Float' | '3 · The clearfix' | '4 · What we have now';

export const clearfixTray = (page: Page) => {
  const exhibit = page.getByRole('region', {name: 'Where Second goes'});
  const steps = pillSwitch(page, 'The parent that lost its height');
  const opener = exhibit.getByText('Show me the clearfix', {exact: true});
  const closer = exhibit.getByText('Close', {exact: true});
  return {
    question: exhibit.getByText('Has a parent box collapsed on you?', {exact: true}),
    opener,
    closer,
    opens: async (): Promise<void> => {
      await siteFrame(page).hydrated();
      await opener.click();
    },
    closes: (): Promise<void> => closer.click(),
    stepsTo: (step: ClearfixStep): Promise<void> => steps.choose(step),
    steps: page.getByRole('group', {name: 'The parent that lost its height', exact: true}),
    whatTheParentDid: exhibit.getByRole('status', {name: 'what the parent did'})
  };
};
