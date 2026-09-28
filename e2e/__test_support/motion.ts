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

export type Frame = {height: number; textBottomGap: number; textAboveTheClip: number};

export const framesWhileMoving = (fold: Locator): Promise<Frame[]> => fold.evaluate(element =>
  new Promise<Frame[]>((resolve, reject) => {
    const paragraph = element.querySelector('p');
    if (!paragraph) {
      reject(new Error('the fold holds no paragraph to measure'));
      return;
    }
    let innermost: Element = paragraph;
    while (innermost.firstElementChild !== null) {
      innermost = innermost.firstElementChild;
    }
    const between: Element[] = [];
    for (let box = innermost.parentElement; box !== null && box !== element; box = box.parentElement) {
      between.push(box);
    }
    const clips = [...between, element].filter(box => getComputedStyle(box).overflowY !== 'visible');
    const shownTextBottom = () => Math.min(...[innermost, ...clips].map(box => box.getBoundingClientRect().bottom));
    const text = document.createRange();
    text.selectNodeContents(innermost);
    const textAboveTheClip = () => Math.max(...[innermost, ...clips].map(box => box.getBoundingClientRect().top)) - text.getBoundingClientRect().top;
    const before = element.getBoundingClientRect().height;
    const deadline = performance.now() + 5000;
    const sampled: Frame[] = [];
    const moving = () => element.getAnimations({subtree: true}).some(motion => motion.playState === 'running');
    const sample = () => {
      const box = element.getBoundingClientRect();
      if (box.height !== before || sampled.length > 0) {
        sampled.push({height: box.height, textBottomGap: Math.abs(box.bottom - shownTextBottom()), textAboveTheClip: textAboveTheClip()});
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
