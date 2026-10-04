import {within} from '@testing-library/react';
import {not} from '@ryandur/sand';
import {computeAccessibleName} from 'dom-accessibility-api';

const runWith = (part: HTMLElement, holds: (run: HTMLElement) => boolean, what: string): HTMLElement => {
  const holding = within(part).getAllByRole('listitem').filter(holds);
  const innermost = holding.filter(run => not(holding.some(other => other !== run && run.contains(other))));
  if (innermost.length === 0) {
    throw new Error(`no run ${what}`);
  }
  if (innermost.length > 1) {
    throw new Error(`${innermost.length} runs ${what}`);
  }
  return innermost[0];
};

const runTelling = (part: HTMLElement, words: RegExp): HTMLElement =>
  runWith(part, run => within(run).queryByText(words) !== null, `tells ${words}`);

const runDrawing = (part: HTMLElement, drawing: RegExp): HTMLElement =>
  runWith(part, run => within(run).queryByRole('figure', {name: drawing}) !== null, `draws ${drawing}`);

const drawingsIn = (part: HTMLElement): HTMLElement[] =>
  within(part).getAllByRole('figure').filter(figure => within(figure).queryByRole('code') === null);

const everyCodeIn = (run: HTMLElement): string[] => within(run).getAllByRole('code').map(code => code.textContent);

export const explanation = {
  runTelling,
  codeBeside: (part: HTMLElement, words: RegExp): HTMLElement => within(runTelling(part, words)).getByRole('code'),
  everyCodeBeside: (part: HTMLElement, words: RegExp): string[] => everyCodeIn(runTelling(part, words)),
  everyCodeBesideDrawing: (part: HTMLElement, drawing: RegExp): string[] => everyCodeIn(runDrawing(part, drawing)),
  drawingsIn,
  captionsIn: (part: HTMLElement): string[] => drawingsIn(part).map(figure => computeAccessibleName(figure))
};
