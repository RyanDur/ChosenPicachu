import {expect, Page, test as base} from '@playwright/test';

export const test = base.extend<{noUncaughtErrors: void}>({
  noUncaughtErrors: [async ({context}, use) => {
    const errors: string[] = [];
    const watch = (page: Page): void => {
      page.on('pageerror', error => errors.push(`${page.url()}: ${error.message}`));
    };
    context.pages().forEach(watch);
    context.on('page', watch);
    await use();
    expect(errors, 'the page threw an error the journey did not ask for').toEqual([]);
  }, {auto: true}]
});
