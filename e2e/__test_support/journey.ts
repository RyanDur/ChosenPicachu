import {not} from '@ryandur/sand';
import {expect, Page, test as base} from '@playwright/test';

// WebKit on Linux reports a fetch it cancels when the page navigates away as a page error that ends this way. The
// page threw nothing: a journey that goes from one page to the next while a request is in flight meets it, as
// table-worlds' screen reader journey did on 13b30270 and 5cb1d6c0. A request the browser truly refused would leave its
// page without its data, and the journey's own expectations catch that.
const canceledByLeaving = /due to access control checks\.$/;
// A late web font lands while a ResizeObserver delivers, so WebKit defers one notification (run 43808186638).
const fontLandedMidDelivery = 'ResizeObserver loop completed with undelivered notifications.';

const isWebKitNoise = (message: string): boolean =>
  canceledByLeaving.test(message) || message === fontLandedMidDelivery;

export const test = base.extend<{noUncaughtErrors: void}>({
  noUncaughtErrors: [async ({context, browserName}, use) => {
    const errors: string[] = [];
    const watch = (page: Page): void => {
      page.on('pageerror', error => {
        if (not(browserName === 'webkit' && isWebKitNoise(error.message))) errors.push(`${page.url()}: ${error.message}`);
      });
    };
    context.pages().forEach(watch);
    context.on('page', watch);
    await use();
    expect(errors, 'the page threw an error the journey did not ask for').toEqual([]);
  }, {auto: true}]
});
