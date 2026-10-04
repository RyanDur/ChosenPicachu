import type {Locator, Page} from '@playwright/test';

const margin = 4;

type Box = {x: number; y: number; width: number; height: number};

const around = async (marked: readonly Locator[]): Promise<Box> => {
  const boxes = (await Promise.all(marked.map(part => part.boundingBox()))).flatMap(box => box === null ? [] : [box]);
  if (boxes.length === 0) throw new Error('the control is not shown');
  const [left, top] = [Math.min(...boxes.map(({x}) => x)), Math.min(...boxes.map(({y}) => y))];
  const [right, bottom] = [Math.max(...boxes.map(({x, width}) => x + width)), Math.max(...boxes.map(({y, height}) => y + height))];
  return {x: left, y: top, width: right - left, height: bottom - top};
};

const shot = async (page: Page, marked: readonly Locator[]): Promise<string> => {
  const box = await around(marked);
  const clip = {x: box.x - margin, y: box.y - margin, width: box.width + 2 * margin, height: box.height + 2 * margin};
  return (await page.screenshot({clip, scale: 'css', animations: 'disabled'})).toString('base64');
};

// a focus indicator counts where the focused pixel differs from the unfocused one by 3:1 or more; it must cover a ring
// one pixel round the control at least
export const focusStandsOut = async (page: Page, control: Locator, marked: readonly Locator[] = [control]): Promise<{changed: number; ring: number}> => {
  await control.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const before = await shot(page, marked);
  await page.keyboard.press('Shift');
  await control.focus();
  const after = await shot(page, marked);
  const box = await around(marked);
  const ring = 2 * (box.width + box.height);
  const changed = await page.evaluate(async ([unfocused, focused]) => {
    const pixels = async (src: string): Promise<Uint8ClampedArray> => {
      const image = new Image();
      image.src = `data:image/png;base64,${src}`;
      await image.decode();
      const canvas = new OffscreenCanvas(image.width, image.height);
      const context = canvas.getContext('2d');
      context?.drawImage(image, 0, 0);
      return context?.getImageData(0, 0, image.width, image.height).data ?? new Uint8ClampedArray();
    };
    const linear = (channel: number): number => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    const luminance = (data: Uint8ClampedArray, at: number): number =>
      0.2126 * linear(data[at]) + 0.7152 * linear(data[at + 1]) + 0.0722 * linear(data[at + 2]);
    const [was, now] = await Promise.all([pixels(unfocused), pixels(focused)]);
    let count = 0;
    for (let at = 0; at < Math.min(was.length, now.length); at += 4) {
      const [lighter, darker] = [luminance(was, at), luminance(now, at)].sort((a, b) => b - a);
      if ((lighter + 0.05) / (darker + 0.05) >= 3) count++;
    }
    return count;
  }, [before, after]);
  return {changed, ring};
};
