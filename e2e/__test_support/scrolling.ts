import type {Page} from '@playwright/test';

export const documentScrollY = (page: Page): Promise<number> => page.evaluate(() => window.scrollY);

export const paneScrollTop = (page: Page): Promise<number> => page.getByRole('main').evaluate(main => main.scrollTop);

export const countScriptScrolls = async (page: Page): Promise<() => Promise<number>> => {
  await page.addInitScript(() => {
    let scrolls = 0;
    Reflect.set(globalThis, 'scriptScrolls', () => scrolls);
    const counted = (owner: object, method: string): void => {
      const original: unknown = Reflect.get(owner, method);
      if (typeof original === 'function') Reflect.set(owner, method, function (this: unknown, ...args: unknown[]): unknown {
        scrolls += 1;
        return Reflect.apply(original, this, args);
      });
    };
    ['scrollIntoView', 'scrollTo', 'scroll', 'scrollBy'].forEach(method => counted(Element.prototype, method));
    ['scrollTo', 'scroll', 'scrollBy'].forEach(method => counted(window, method));
  });
  return async () => Number(await page.evaluate(async () => {
    await new Promise(settled => requestAnimationFrame(() => requestAnimationFrame(settled)));
    const scrolls: unknown = Reflect.get(globalThis, 'scriptScrolls');
    return typeof scrolls === 'function' ? scrolls() : Number.NaN;
  }));
};
