import type {Page} from '@playwright/test';

export type StepLayout = 'code below prose' | 'code beside prose';

export const codedStepLayouts = async (page: Page): Promise<StepLayout[]> => {
  const steps = page.getByRole('article').or(page.getByRole('listitem')).filter({has: page.getByRole('code'), hasNot: page.getByRole('article')});
  const layouts = await Promise.all((await steps.all()).map(async step => {
    const words = await step.getByRole('paragraph').first().boundingBox();
    const code = await step.getByRole('code').first().boundingBox();
    return words === null || code === null ? [] : [code.y >= words.y + words.height ? 'code below prose' as const : 'code beside prose' as const];
  }));
  return layouts.flat();
};

export type Placement = 'under its prose, beside its code' | 'misplaced';

export const pictureInRunPlacements = async (page: Page): Promise<Placement[]> => {
  const runs = page.getByRole('listitem').filter({has: page.getByRole('code'), hasNot: page.getByRole('article')})
    .filter({has: page.getByRole('figure').or(page.getByRole('table'))});
  return Promise.all((await runs.all()).map(async run => {
    const [words, picture, code] = await Promise.all([
      run.getByRole('paragraph').first().boundingBox(),
      run.getByRole('figure').or(run.getByRole('table')).boundingBox(),
      run.getByRole('code').boundingBox()
    ]);
    if (words === null || picture === null || code === null) {
      throw new Error('a run with a picture has no box for its prose, its picture or its code');
    }
    return picture.y >= words.y + words.height && picture.x + picture.width <= code.x ? 'under its prose, beside its code' : 'misplaced';
  }));
};
