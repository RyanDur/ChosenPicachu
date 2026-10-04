import type {Page} from '@playwright/test';

export type Pixels = {width: number; height: number; rgba: number[]};

export const decodedShot = (page: Page, shot: Buffer): Promise<Pixels> => page.evaluate(async src => {
  const image = new Image();
  image.src = `data:image/png;base64,${src}`;
  await image.decode();
  const canvas = new OffscreenCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context?.drawImage(image, 0, 0);
  return {width: image.width, height: image.height, rgba: [...context?.getImageData(0, 0, image.width, image.height).data ?? []]};
}, shot.toString('base64'));
