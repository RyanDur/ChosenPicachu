import type {Page} from '@playwright/test';

export const documentScrollY = (page: Page): Promise<number> => page.evaluate(() => window.scrollY);

export const paneScrollTop = (page: Page): Promise<number> => page.getByRole('main').evaluate(main => main.scrollTop);
