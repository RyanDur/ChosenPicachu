import type {Page} from '@playwright/test';

export type StepLayout = 'code below prose' | 'code beside prose';

export const codedStepLayouts = (page: Page): Promise<StepLayout[]> =>
  page.getByRole('article').filter({has: page.getByRole('code')}).evaluateAll(articles => articles.filter(article => article.querySelector('article') === null).flatMap(step => {
    const words = step.querySelector('p')?.getBoundingClientRect();
    const code = step.querySelector('code')?.getBoundingClientRect();
    if (!words || !code || words.width === 0 || code.width === 0) return [];
    return [code.top >= words.bottom ? 'code below prose' as const : 'code beside prose' as const];
  }));
