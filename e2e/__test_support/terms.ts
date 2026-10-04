import type {Page} from '@playwright/test';

export type DefinitionFit = {width: number; floor: number; left: number; right: number; overTheWord: boolean};

export const definitionTapped = async (page: Page, story: string, term: string, shown = term): Promise<DefinitionFit> => {
  const fold = page.getByRole('group', {name: story, exact: true}).first();
  await fold.getByRole('heading', {name: story, exact: true}).click();
  const word = fold.getByRole('button', {name: shown, exact: true}).first();
  await word.evaluate(button => {
    for (let around = button.closest('details'); around !== null; around = around.parentElement?.closest('details') ?? null) {
      around.open = true;
    }
  });
  await word.scrollIntoViewIfNeeded();
  await word.tap();
  const definition = fold.getByLabel(term, {exact: true}).first();
  await definition.waitFor();
  const wordBox = await word.boundingBox();
  if (wordBox === null) throw new Error(`${term} is not shown`);
  return definition.evaluate((shown, around) => {
    const probe = document.createElement('span');
    probe.style.cssText = 'position: absolute; inline-size: 45ch';
    shown.append(probe);
    const floor = Math.min(probe.getBoundingClientRect().width, document.documentElement.clientWidth - 32);
    probe.remove();
    const {left, right, top, bottom, width} = shown.getBoundingClientRect();
    const overTheWord = top < around.y + around.height - 1 && bottom > around.y + 1 && left < around.x + around.width && right > around.x;
    return {width, floor, left, right: document.documentElement.clientWidth - right, overTheWord};
  }, wordBox);
};
