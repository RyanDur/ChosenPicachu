import type {Page} from '@playwright/test';

export type StepLayout = 'code below prose' | 'code beside prose';

export const codedStepLayouts = async (page: Page): Promise<StepLayout[]> => {
  const steps = page.getByRole('article').filter({has: page.getByRole('code'), hasNot: page.getByRole('article')});
  const layouts = await Promise.all((await steps.all()).map(async step => {
    const words = await step.getByRole('paragraph').first().boundingBox();
    const code = await step.getByRole('code').first().boundingBox();
    return words === null || code === null ? [] : [code.y >= words.y + words.height ? 'code below prose' as const : 'code beside prose' as const];
  }));
  return layouts.flat();
};
