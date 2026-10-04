import type {Page} from '@playwright/test';

export const demoSettings = (page: Page) => {
  const fold = page.getByRole('group', {name: 'settings'}).first();
  return {
    fold,
    press: (): Promise<void> => fold.getByText(/^settings/).click()
  };
};
