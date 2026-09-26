import type {Page} from '@playwright/test';

export const tablesDemo = (page: Page) => ({
  settingsFold: page.getByRole('group', {name: 'settings'}).first(),
  controls: page.getByRole('region', {name: 'table controls'}),
  pressSettings: (): Promise<void> => page.getByRole('group', {name: 'settings'}).first().getByText(/^settings/).click()
});
