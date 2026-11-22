import type {Locator, Page} from '@playwright/test';
import {maybe} from '@ryandur/sand';
import {pillSwitch} from './pills';

export type NestingStep = 'One context' | 'Two contexts' | 'List inside' | 'List outside';

const unmeasured = {x: Number.NaN, y: Number.NaN, width: 0, height: 0};

const boxOf = async (box: Locator) => maybe(await box.boundingBox()).orElse(unmeasured);

export const nestingExhibit = (page: Page) => {
  const exhibit = page.getByRole('figure', {name: 'A context inside a context', exact: true});
  const drawing = exhibit.getByRole('region', {name: 'What the browser draws'});
  const list = drawing.getByRole('list');
  const cardB = drawing.getByText('Card B · z-index: 1', {exact: true});
  return {
    stepsTo: (step: NestingStep): Promise<void> => pillSwitch(page, 'Step').choose(step),
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
    css: exhibit.getByRole('figure').filter({hasText: /^CSS/}),
    saying: (words: string): Locator => exhibit.getByText(words, {exact: false}),
    verdict: exhibit.getByRole('status', {name: 'what the browser drew'})
  };
};
