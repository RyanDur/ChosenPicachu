import type {Locator, Page} from '@playwright/test';
import {not} from '@ryandur/sand';

export type StepLayout = 'code below prose' | 'code beside prose';

type Box = {x: number; y: number; width: number; height: number};

const insideOf = (outer: Box) => (inner: Box): boolean =>
  inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;

const sampleBeside = async (step: Locator, words: Box | null): Promise<Box | null> =>
  (await Promise.all((await step.getByRole('code').all()).map(code => code.boundingBox())))
    .find(code => code !== null && words !== null && not(insideOf(words)(code))) ?? null;

export const codedStepLayouts = async (page: Page, within: Page | Locator = page): Promise<StepLayout[]> => {
  const steps = within.getByRole('article').or(within.getByRole('listitem'))
    .filter({has: page.getByRole('code'), hasNot: page.getByRole('article')})
    .filter({has: page.getByRole('paragraph')});
  const layouts = await Promise.all((await steps.all()).map(async step => {
    const words = await step.getByRole('paragraph').first().boundingBox();
    const sample = await sampleBeside(step, words);
    return sample && words ? [sample.y >= words.y + words.height ? 'code below prose' as const : 'code beside prose' as const] : [];
  }));
  return layouts.flat();
};

const pictureName = (snapshot: string): string => `"${(/"([^"]*)"/.exec(snapshot)?.[1] ?? 'an unnamed picture').slice(0, 40)}"`;

export const misplacedPictures = async (page: Page): Promise<string[]> => {
  const runs = page.getByRole('listitem').filter({has: page.getByRole('code'), hasNot: page.getByRole('article')})
    .filter({has: page.getByRole('figure').or(page.getByRole('table'))});
  const misplaced = await Promise.all((await runs.all()).map(async run => {
    const [words, name] = await Promise.all([
      run.getByRole('paragraph').first().boundingBox(),
      run.getByRole('paragraph').first().textContent().then(prose => `the run on "${(prose ?? '').trim().slice(0, 40)}"`)
    ]);
    const code = await sampleBeside(run, words);
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

export const roomUnderShutFolds = async (page: Page, story: string): Promise<number[]> => {
  const fold = page.getByRole('group', {name: story, exact: true}).first();
  await fold.getByRole('heading', {name: story, exact: true}).click();
  const listed = fold.getByRole('list', {name: 'the steps'}).getByRole('listitem')
    .filter({has: page.getByText('how we built it', {exact: true})});
  await listed.first().waitFor();
  const steps = await listed.all();
  return (await Promise.all(steps.map(async step => {
    const [whole, bar] = await Promise.all([step.boundingBox(), step.getByText('how we built it', {exact: true}).boundingBox()]);
    return whole && bar ? [Math.round(whole.y + whole.height - bar.y - bar.height)] : [];
  }))).flat();
};
