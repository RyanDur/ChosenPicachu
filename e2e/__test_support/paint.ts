import type {Locator, Page} from '@playwright/test';

// a painted page has no see-through pixel, so any in a shot of it is a part the browser left unpainted
export const unpaintedPixels = async (page: Page, part: Locator): Promise<number> => {
  const box = await part.boundingBox();
  if (box === null) throw new Error('nothing to shoot');
  const shot = (await page.screenshot({clip: box, scale: 'css'})).toString('base64');
  return page.evaluate(async src => {
    const image = new Image();
    image.src = `data:image/png;base64,${src}`;
    await image.decode();
    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context?.drawImage(image, 0, 0);
    const pixels = context?.getImageData(0, 0, image.width, image.height).data ?? new Uint8ClampedArray();
    let unpainted = 0;
    for (let at = 3; at < pixels.length; at += 4) {
      if (pixels[at] === 0) unpainted++;
    }
    return unpainted;
  }, shot);
};
