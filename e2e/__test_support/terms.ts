import type {Page} from '@playwright/test';

export type DefinitionFit = {width: number; left: number; right: number; overTheWord: boolean};

export const definitionTapped = async (page: Page, story: string, term: string): Promise<DefinitionFit> => {
  const fold = page.getByRole('group', {name: story, exact: true}).first();
  await fold.getByRole('heading', {name: story, exact: true}).click();
  const word = fold.getByRole('button', {name: term, exact: true}).first();
  await word.scrollIntoViewIfNeeded();
  await word.tap();
  const definition = fold.getByLabel(term, {exact: true}).first();
  await definition.waitFor();
  const wordBox = await word.boundingBox();
  if (wordBox === null) throw new Error(`${term} is not shown`);
  return definition.evaluate((shown, around) => {
    const {left, right, top, bottom, width} = shown.getBoundingClientRect();
    const overTheWord = top < around.y + around.height - 1 && bottom > around.y + 1 && left < around.x + around.width && right > around.x;
    return {width, left, right: document.documentElement.clientWidth - right, overTheWord};
  }, wordBox);
};
