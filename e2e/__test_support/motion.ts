import type {Locator} from '@playwright/test';

const heightByTheNextFrame = (fold: Locator): Promise<number> => fold.evaluate(element =>
  new Promise<number>(resolve => requestAnimationFrame(() => resolve(element.getBoundingClientRect().height))));

export const heightOnceSettled = async (fold: Locator): Promise<number> => {
  await fold.evaluate(element => Promise.all(element.getAnimations({subtree: true}).map(motion => motion.finished)));
  return heightByTheNextFrame(fold);
};
