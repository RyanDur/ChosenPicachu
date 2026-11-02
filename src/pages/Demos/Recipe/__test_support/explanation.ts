import {screen, within} from '@testing-library/react';
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

const drawingsIn = (part: HTMLElement): HTMLElement[] =>
  within(part).getAllByRole('figure')
    .filter(figure => within(figure).queryByRole('code') === null && within(figure).queryAllByTitle(/./).length === 0);

const samplesIn = (run: HTMLElement): HTMLElement[] =>
  within(run).queryAllByRole('figure').flatMap(figure => within(figure).queryAllByRole('code'));

const sampleBeside = (part: HTMLElement, words: RegExp): HTMLElement => {
  const samples = samplesIn(runTelling(part, words));
  if (samples.length !== 1) {
    throw new Error(`${samples.length} samples beside ${words}`);
  }
  return samples[0];
};

const sourcesIn = (run: HTMLElement): string[] =>
  within(run).queryAllByRole('figure').flatMap(figure => within(figure).queryAllByRole('link', {name: /on GitHub$/}))
    .map(link => link.textContent ?? '');

export const explanation = {
  part: (heading: string): Promise<HTMLElement> => screen.findByRole('region', {name: heading}),
  partIn: (holder: HTMLElement, heading: string): HTMLElement => within(holder).getByRole('region', {name: heading}),
  partNames: (): string[] => screen.getAllByRole('region').map(region => computeAccessibleName(region)),
  partTitles: (holder: HTMLElement): string[] => within(holder).getAllByRole('heading', {level: 2}).map(heading => heading.textContent),
  sectionTitles: (part: HTMLElement): string[] => within(part).getAllByRole('heading', {level: 3}).map(heading => heading.textContent),
  foldsIn: (holder: HTMLElement): HTMLElement[] => within(holder).getAllByRole('group'),
  runsIn: (holder: HTMLElement): HTMLElement[] => within(holder).getAllByRole('listitem'),
  firstLinkIn: (run: HTMLElement): HTMLElement => within(run).getAllByRole('link')[0],
  linkNamed: (part: HTMLElement, name: string | RegExp): HTMLElement => within(part).getByRole('link', {name}),
  drawingNamed: (part: HTMLElement, name: string | RegExp): HTMLElement => within(part).getByRole('figure', {name}),
  saying: (part: HTMLElement, words: string | RegExp): HTMLElement => within(part).getByText(words),
  sourcesBeside: (part: HTMLElement, words: RegExp): string[] => sourcesIn(runTelling(part, words)),
  linksBeside: (part: HTMLElement, words: RegExp): (string | null)[][] => within(runTelling(part, words)).getAllByRole('link')
    .map(link => [link.textContent, link.getAttribute('href')]),
  runTelling,
  codeBeside: sampleBeside,
  drawingsIn
};
