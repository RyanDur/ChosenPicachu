import type {Locator, Page} from '@playwright/test';

export const documentScrollY = (page: Page): Promise<number> => page.evaluate(() => window.scrollY);

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
    const countedWhenSet = (property: string): void => {
      const setting = Object.getOwnPropertyDescriptor(Element.prototype, property);
      if (setting?.set) Object.defineProperty(Element.prototype, property, {
        ...setting,
        set(this: Element, value: number): void {
          scrolls += 1;
          setting.set?.call(this, value);
        }
      });
    };
    ['scrollIntoView', 'scrollTo', 'scroll', 'scrollBy'].forEach(method => counted(Element.prototype, method));
    ['scrollTo', 'scroll', 'scrollBy'].forEach(method => counted(window, method));
    ['scrollTop', 'scrollLeft'].forEach(countedWhenSet);
  });
  return async () => Number(await page.evaluate(async () => {
    await new Promise(settled => requestAnimationFrame(() => requestAnimationFrame(settled)));
    const scrolls: unknown = Reflect.get(globalThis, 'scriptScrolls');
    return typeof scrolls === 'function' ? scrolls() : Number.NaN;
  }));
};

export const clickWhereItIs = async (page: Page, target: Locator): Promise<void> => {
  const box = await target.boundingBox();
  if (box === null) throw new Error('nothing on screen to click');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
};

export const isOnTopAtItsFirstLine = (element: Element): boolean => {
  const {left, top} = element.getBoundingClientRect();
  return element.contains(document.elementFromPoint(left + 4, top + 4));
};
