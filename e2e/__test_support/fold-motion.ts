import type {Locator, Page} from '@playwright/test';

// press a fold's bar and read the fold's height every frame for 450ms; a slide passes through heights between, a snap doesn't
export const heightsBetween = async (fold: Locator, bar: Locator): Promise<number> => {
  const reading = await fold.evaluateHandle(details => ({heights: new Promise<number[]>(resolve => {
    const heights: number[] = [];
    const start = performance.now();
    const read = (): void => {
      heights.push(Math.round(details.getBoundingClientRect().height));
      if (performance.now() - start < 450) requestAnimationFrame(read);
      else resolve(heights);
    };
    requestAnimationFrame(read);
  })}));
  await bar.click();
  const heights = await reading.evaluate(({heights: read}) => read);
  const [low, high] = [Math.min(...heights), Math.max(...heights)];
  return new Set(heights.filter(height => height > low && height < high)).size;
};

// the pixels in the 3px left of a control that change when the keyboard tabs onto it: the ring's left side, if it isn't clipped;
// a Tab, not focus(), since Firefox draws the ring only for focus that came from the keyboard
export const ringPixelsLeftOf = async (page: Page, control: Locator): Promise<number> => {
  await control.scrollIntoViewIfNeeded();
  const box = await control.boundingBox();
  if (box === null) throw new Error('the control is not shown');
  const strip = {x: box.x - 3, y: box.y - 3, width: 3, height: box.height + 6};
  const before = (await page.screenshot({clip: strip, scale: 'css'})).toString('base64');
  await control.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  const after = (await page.screenshot({clip: strip, scale: 'css'})).toString('base64');
  return page.evaluate(async ([unfocused, focused]) => {
    const pixels = async (src: string): Promise<Uint8ClampedArray> => {
      const image = new Image();
      image.src = `data:image/png;base64,${src}`;
      await image.decode();
      const canvas = new OffscreenCanvas(image.width, image.height);
      const context = canvas.getContext('2d');
      context?.drawImage(image, 0, 0);
      return context?.getImageData(0, 0, image.width, image.height).data ?? new Uint8ClampedArray();
    };
    const [was, now] = await Promise.all([pixels(unfocused), pixels(focused)]);
    let changed = 0;
    for (let at = 0; at < Math.min(was.length, now.length); at += 4) {
      if (Math.abs(was[at] - now[at]) + Math.abs(was[at + 1] - now[at + 1]) + Math.abs(was[at + 2] - now[at + 2]) > 60) changed++;
    }
    return changed;
  }, [before, after]);
};
