import type {Locator, Page} from '@playwright/test';
import {pillSwitch} from './pills';

export type NestingStep = '1 · The page' | '2 · A context inside' | '3 · The list inside' | '4 · The list outside';

export const nestingExhibit = (page: Page) => {
  const exhibit = page.getByRole('region', {name: 'A context inside a context', exact: true});
  const drawing = exhibit.getByRole('region', {name: 'What the browser draws'});
  const steps = pillSwitch(page, 'Step');
  const css = exhibit.getByRole('figure').filter({hasText: /^CSS/});
  return {
    stepsTo: (step: NestingStep): Promise<void> => steps.choose(step),
    step: (step: NestingStep): Locator => steps.pill(step),
    onTopWhereTheListMeetsCardB: (): Promise<string> => drawing.evaluate(shown => {
      shown.scrollIntoView({block: 'center'});
      const listed = shown.querySelector('ul');
      const card = [...shown.children].find(child => child.textContent?.trim() === 'Card B · z-index: 1');
      if (!listed || !card) throw new Error('the drawing holds no list beside card B');
      const [listBox, cardBox] = [listed.getBoundingClientRect(), card.getBoundingClientRect()];
      const hit = document.elementFromPoint(
        (Math.max(listBox.left, cardBox.left) + Math.min(listBox.right, cardBox.right)) / 2,
        (Math.max(listBox.top, cardBox.top) + Math.min(listBox.bottom, cardBox.bottom)) / 2);
      return listed.contains(hit) ? 'the list' : card.contains(hit) ? 'card B' : 'neither';
    }),
    css,
    markedRules: (): Promise<string[]> =>
      css.evaluate(sample => [...sample.querySelectorAll('mark')].map(marked => marked.textContent?.trim() ?? '')),
    verdict: exhibit.getByRole('status', {name: 'what the browser drew'})
  };
};
