import type {Page} from '@playwright/test';

const measures = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

export const designSketch = (page: Page) => {
  const step = page.getByRole('region', {name: 'Sketch a design from the need', exact: true});
  return {
    step,
    measures,
    headers: async (): Promise<{columns: number; rows: number}> => ({
      columns: await step.getByRole('columnheader').count(),
      rows: await step.getByRole('rowheader').count()
    })
  };
};
