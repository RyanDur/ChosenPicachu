import type {Page} from '@playwright/test';

const measures = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

export const designSketch = (page: Page) => {
  const step = page.getByRole('region', {name: 'Sketch a design from the need', exact: true});
  return {
    step,
    namesOverlapping: async (): Promise<string[]> => {
      await step.scrollIntoViewIfNeeded();
      const boxes = await Promise.all(measures.map(name => step.getByRole('columnheader', {name, exact: true}).boundingBox()));
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
    namesOutOfView: async (): Promise<string[]> => {
      const frame = await step.getByRole('figure').boundingBox();
      const boxes = await Promise.all(measures.map(name => step.getByRole('columnheader', {name, exact: true}).boundingBox()));
      return measures.filter((_, at) => {
        const box = boxes[at];
        return frame === null || box === null || box.x < frame.x || box.x + box.width > frame.x + frame.width;
      });
    },
    slides: (): Promise<boolean> => step.getByRole('table').evaluate(table =>
      table.parentElement !== null && table.parentElement.scrollWidth > table.parentElement.clientWidth),
    namesOffTheirColumns: async (): Promise<string[]> => {
      const offsets = await Promise.all(measures.map(name => step.getByRole('columnheader', {name, exact: true}).evaluate(column => {
        const words = document.createRange();
        words.selectNodeContents(column);
        const [ink, box] = [words.getBoundingClientRect(), column.getBoundingClientRect()];
        return Math.abs(ink.x + ink.width / 2 - (box.x + box.width / 2));
      })));
      return measures.filter((_, at) => offsets[at] > 2);
    },
    roomAboveTheNames: async (): Promise<number> => {
      const tallest = Math.max(...await Promise.all(measures.map(name => step.getByRole('columnheader', {name, exact: true}).evaluate(column => {
        const words = document.createRange();
        words.selectNodeContents(column);
        return words.getBoundingClientRect().height;
      }))));
      const row = await step.getByRole('columnheader', {name: 'window', exact: true}).boundingBox();
      return (row?.height ?? 0) - tallest;
    },
    headers: async (): Promise<{columns: number; rows: number}> => ({
      columns: await step.getByRole('columnheader').count(),
      rows: await step.getByRole('rowheader').count()
    }),
    pageScrollsSideways: (): Promise<boolean> => page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  };
};
