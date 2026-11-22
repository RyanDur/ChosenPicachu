import type {Locator, Page} from '@playwright/test';
import {maybe} from '@ryandur/sand';
import {pillSwitch} from './pills';

export type NestingStep = '1 · One context' | '2 · A context inside' | '3 · The list inside' | '4 · The list outside';

const nestingSteps: NestingStep[] = ['1 · One context', '2 · A context inside', '3 · The list inside', '4 · The list outside'];

const unmeasured = {x: Number.NaN, y: Number.NaN, width: 0, height: 0};

const boxOf = async (box: Locator) => maybe(await box.boundingBox()).orElse(unmeasured);

export const nestingExhibit = (page: Page) => {
  const exhibit = page.getByRole('figure', {name: 'A context inside a context', exact: true});
  const drawing = exhibit.getByRole('region', {name: 'What the browser draws'});
  const list = drawing.getByRole('list');
  const cardB = drawing.getByText('Card B · z-index: 1', {exact: true});
  const steps = pillSwitch(page, 'Step');
  const css = exhibit.getByRole('figure').filter({hasText: /^CSS/});
  return {
    stepsTo: (step: NestingStep): Promise<void> => steps.choose(step),
    step: (step: NestingStep): Locator => steps.pill(step),
    stepsCutShort: async (): Promise<NestingStep[]> => {
      await exhibit.scrollIntoViewIfNeeded();
      const around = await boxOf(exhibit);
      const cut = await Promise.all(nestingSteps.map(async step => {
        const label = steps.wordsOf(step);
        const words = await boxOf(label);
        const spills = await label.evaluate(shown => shown.scrollWidth > shown.clientWidth);
        return spills || words.x < around.x || words.x + words.width > around.x + around.width;
      }));
      return nestingSteps.filter((_, at) => cut[at]);
    },
    onTopWhereTheListMeetsCardB: async (): Promise<string> => {
      await drawing.scrollIntoViewIfNeeded();
      const [listBox, cardBox] = await Promise.all([boxOf(list), boxOf(cardB)]);
      const x = (Math.max(listBox.x, cardBox.x) + Math.min(listBox.x + listBox.width, cardBox.x + cardBox.width)) / 2;
      const y = (Math.max(listBox.y, cardBox.y) + Math.min(listBox.y + listBox.height, cardBox.y + cardBox.height)) / 2;
      const [theList, theCard] = await Promise.all([list.elementHandle(), cardB.elementHandle()]);
      return page.evaluate(([listed, card, atX, atY]) => {
        const hit = document.elementFromPoint(atX, atY);
        return listed?.contains(hit) ? 'the list' : card?.contains(hit) ? 'card B' : 'neither';
      }, [theList, theCard, x, y] as const);
    },
    css,
    markedRules: async (): Promise<string[]> => [...(await css.ariaSnapshot()).matchAll(/- mark: "([^"]+)"/g)].map(([, line]) => line),
    saying: (words: string): Locator => exhibit.getByText(words, {exact: false}),
    verdict: exhibit.getByRole('status', {name: 'what the browser drew'})
  };
};
