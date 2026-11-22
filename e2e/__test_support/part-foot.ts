import type {Locator, Page} from '@playwright/test';

export const partFoot = (page: Page) => {
  const foot = page.getByRole('navigation', {name: 'Parts, in order'});
  return {
    link: (name: string): Locator => foot.getByRole('link', {name, exact: true}),
    links: (): Locator => foot.getByRole('link'),
    says: (words: string): Locator => foot.getByText(words, {exact: true})
  };
};
