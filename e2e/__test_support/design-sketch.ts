import type {Page} from '@playwright/test';

const measures = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

export const designSketch = (page: Page) => {
  const step = page.getByRole('region', {name: 'Sketch a design from the need', exact: true});
  return {
    step,
    namesOverlapping: async (): Promise<string[]> => {
      await step.scrollIntoViewIfNeeded();
      const boxes = await Promise.all(measures.map(name => step.getByText(name, {exact: true}).first().boundingBox()));
      return measures.slice(1).flatMap((name, at) => {
        const [left, right] = [boxes[at], boxes[at + 1]];
        return left && right && right.x < left.x + left.width ? [`${name} over ${measures[at]}`] : [];
      });
    },
    partsPastTheStep: (): Promise<string[]> => step.evaluate(section => {
      const edge = section.getBoundingClientRect().right;
      return [...section.children]
        .filter(part => part.getBoundingClientRect().right > edge + 1)
        .map(part => part.tagName.toLowerCase());
    }),
    pageScrollsSideways: (): Promise<boolean> => page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  };
};
