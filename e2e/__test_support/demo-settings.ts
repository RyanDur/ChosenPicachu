import type {Page} from '@playwright/test';

export const demoSettings = (page: Page) => {
  const fold = page.getByRole('group', {name: 'settings'}).first();
  const summary = fold.getByText(/^settings/);
  return {
    fold,
    summary,
    dialsLink: page.getByRole('link', {name: 'dials', exact: true}).first(),
    press: (): Promise<void> => summary.click()
  };
};
