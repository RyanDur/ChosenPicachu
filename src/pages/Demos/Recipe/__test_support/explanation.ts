import {within} from '@testing-library/react';

const runWith = (part: HTMLElement, holds: (run: HTMLElement) => boolean, what: string): HTMLElement => {
  const run = within(part).getAllByRole('listitem').find(holds);
  if (run) {
    return run;
  }
  throw new Error(`no run ${what}`);
};

const runTelling = (part: HTMLElement, words: RegExp): HTMLElement =>
  runWith(part, run => within(run).queryByText(words) !== null, `tells ${words}`);

const runDrawing = (part: HTMLElement, drawing: RegExp): HTMLElement =>
  runWith(part, run => within(run).queryByRole('figure', {name: drawing}) !== null, `draws ${drawing}`);

const everyCodeIn = (run: HTMLElement): string[] => within(run).getAllByRole('code').map(code => code.textContent);

export const explanation = {
  runTelling,
  codeBeside: (part: HTMLElement, words: RegExp): HTMLElement => within(runTelling(part, words)).getByRole('code'),
  everyCodeBeside: (part: HTMLElement, words: RegExp): string[] => everyCodeIn(runTelling(part, words)),
  everyCodeBesideDrawing: (part: HTMLElement, drawing: RegExp): string[] => everyCodeIn(runDrawing(part, drawing)),
  captionsIn: (part: HTMLElement): string[] => {
    const captions: string[] = [];
    within(part).getAllByRole('figure', {name: caption => captions.push(caption) > 0});
    return captions;
  }
};
