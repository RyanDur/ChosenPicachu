import {expect, Page, test as base} from '@playwright/test';

// WebKit on Linux reports a fetch it cancels when the page navigates away as a page error that ends this way. The
// page threw nothing: a journey that goes from one page to the next while a request is in flight meets it, as
// table-worlds' screen reader journey did on 13b30270 and 5cb1d6c0. A request the browser truly refused would leave its
// page without its data, and the journey's own expectations catch that.
const cancelledByLeaving = /due to access control checks\.$/;

export const test = base.extend<{noUncaughtErrors: void}>({
  noUncaughtErrors: [async ({context}, use) => {
    const errors: string[] = [];
    const watch = (page: Page): void => {
      page.on('pageerror', error => {
        if (!cancelledByLeaving.test(error.message)) errors.push(`${page.url()}: ${error.message}`);
      });
    };
    context.pages().forEach(watch);
    context.on('page', watch);
    await use();
    expect(errors, 'the page threw an error the journey did not ask for').toEqual([]);
  }, {auto: true}]
});
