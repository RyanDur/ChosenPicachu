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

export type Frame = {height: number; textBottomGap: number};

export const framesWhileMoving = (paragraph: Locator): Promise<Frame[]> => paragraph.evaluate(element =>
  new Promise<Frame[]>((resolve, reject) => {
    const fold = element.parentElement;
    if (fold === null) {
      reject(new Error('the paragraph sits in no fold to measure against'));
      return;
    }
    let text: Element = element;
    while (text.firstElementChild !== null) {
      text = text.firstElementChild;
    }
    const between: Element[] = [];
    for (let box = text.parentElement; box !== null && box !== fold; box = box.parentElement) {
      between.push(box);
    }
    const clips = [...between, fold].filter(box => getComputedStyle(box).overflowY !== 'visible');
    const shownTextBottom = () => Math.min(text.getBoundingClientRect().bottom, ...clips.map(clip => clip.getBoundingClientRect().bottom));
    const closed = fold.getBoundingClientRect().height;
    const deadline = performance.now() + 5000;
    const sampled: Frame[] = [];
    const moving = () => fold.getAnimations({subtree: true}).some(motion => motion.playState === 'running');
    const sample = () => {
      const box = fold.getBoundingClientRect();
      if (box.height !== closed || sampled.length > 0) {
        sampled.push({height: box.height, textBottomGap: Math.abs(box.bottom - shownTextBottom())});
      }
      const settled = sampled.length > 1 && !moving();
      if (settled || performance.now() > deadline) {
        resolve(sampled);
      } else {
        requestAnimationFrame(sample);
      }
    };
    requestAnimationFrame(sample);
  }));
