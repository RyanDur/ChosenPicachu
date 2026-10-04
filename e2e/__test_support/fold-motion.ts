import type {Locator} from '@playwright/test';

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
