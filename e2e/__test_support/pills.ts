import type {Locator, Page} from '@playwright/test';

export const pillSwitch = (page: Page, name: string) => {
  const group = page.getByRole('group', {name, exact: true}).first();
  return {
    choose: (pill: string): Promise<void> => group.getByText(pill, {exact: true}).click(),
    pill: (name: string): Locator => group.getByRole('radio', {name, exact: true, includeHidden: true}),
    wordsOf: (pill: string): Locator => group.getByText(pill, {exact: true}).first(),
    names: async (): Promise<string[]> => [...(await group.ariaSnapshot()).matchAll(/radio "([^"]+)"/g)].map(([, name]) => name),
    chosen: async (): Promise<string> => /radio "([^"]+)" \[checked\]/.exec(await group.ariaSnapshot())?.[1] ?? ''
  };
};

export const dialRow = (page: Page, name: string) => {
  const pills = page.getByRole('group', {name, exact: true}).last();
  const row = page.getByRole('listitem').filter({has: pills}).last();
  return {row, reading: row.getByRole('status'), shownNames: row.getByText(name, {exact: true})};
};
