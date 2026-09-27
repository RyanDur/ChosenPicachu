import type {Locator} from '@playwright/test';

export const heightByTheNextFrame = (fold: Locator): Promise<number> => fold.evaluate(element =>
  new Promise<number>(resolve => requestAnimationFrame(() => resolve(element.getBoundingClientRect().height))));

export const heightOnceSettled = async (fold: Locator): Promise<number> => {
  await fold.evaluate(element => Promise.all(element.getAnimations({subtree: true}).map(motion => motion.finished)));
  return heightByTheNextFrame(fold);
};

export const firstHeightAfter = (fold: Locator, closed: number): Promise<number> => fold.evaluate((element, from) =>
  new Promise<number>(resolve => {
    const deadline = performance.now() + 5000;
    const sample = () => {
      const height = element.getBoundingClientRect().height;
      if (height !== from || performance.now() > deadline) {
        resolve(height);
      } else {
        requestAnimationFrame(sample);
      }
    };
    requestAnimationFrame(sample);
  }), closed);
