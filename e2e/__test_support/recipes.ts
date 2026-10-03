import type {Locator, Page} from '@playwright/test';

export type StepLayout = 'code below prose' | 'code beside prose';

export const codedStepLayouts = async (page: Page, within: Page | Locator = page): Promise<StepLayout[]> => {
  const steps = within.getByRole('article').or(within.getByRole('listitem'))
    .filter({has: page.getByRole('code'), hasNot: page.getByRole('article')})
    .filter({has: page.getByRole('paragraph')});
  const layouts = await Promise.all((await steps.all()).map(async step => {
    const words = await step.getByRole('paragraph').first().boundingBox();
    const code = await step.getByRole('code').first().boundingBox();
    return words === null || code === null ? [] : [code.y >= words.y + words.height ? 'code below prose' as const : 'code beside prose' as const];
  }));
  return layouts.flat();
};

const pictureName = (snapshot: string): string => `"${(/"([^"]*)"/.exec(snapshot)?.[1] ?? 'an unnamed picture').slice(0, 40)}"`;

export const misplacedPictures = async (page: Page): Promise<string[]> => {
  const runs = page.getByRole('listitem').filter({has: page.getByRole('code'), hasNot: page.getByRole('article')})
    .filter({has: page.getByRole('figure').or(page.getByRole('table'))});
  const misplaced = await Promise.all((await runs.all()).map(async run => {
    const [words, code, name] = await Promise.all([
      run.getByRole('paragraph').first().boundingBox(),
      run.getByRole('code').boundingBox(),
      run.getByRole('paragraph').first().textContent().then(prose => `the run on "${(prose ?? '').trim().slice(0, 40)}"`)
    ]);
    const pictures = await run.getByRole('figure').or(run.getByRole('table')).all();
    return Promise.all(pictures.map(async picture => {
      const [drawn, drawing] = await Promise.all([picture.boundingBox(), picture.ariaSnapshot().then(pictureName)]);
      if (words === null || drawn === null || code === null) {
        return [`${name}: a box is missing`];
      }
      return [
        ...(drawn.y < words.y + words.height ? [`${name}: ${drawing} over its prose`] : []),
        ...(drawn.x + drawn.width > code.x ? [`${name}: ${drawing} into its code`] : [])
      ];
    })).then(placed => placed.flat());
  }));
  return runs.count().then(count => count === 0 ? ['no run has a picture'] : misplaced.flat());
};
