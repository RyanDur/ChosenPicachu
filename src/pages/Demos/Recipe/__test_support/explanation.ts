import {screen, within} from '@testing-library/react';
import {is, not} from '@ryandur/sand';
import {computeAccessibleName} from 'dom-accessibility-api';

const linkInProse = (part: HTMLElement, name: string): HTMLElement => {
  const found = within(part).getAllByRole('paragraph').flatMap(paragraph => within(paragraph).queryAllByRole('link', {name}));
  if (not(found.length)) {
    throw new Error(`no link named ${name} in the part's prose`);
  }
  if (found.length > 1) {
    throw new Error(`${found.length} links named ${name} in the part's prose`);
  }
  return found[0];
};

const runWith = (part: HTMLElement, holds: (run: HTMLElement) => boolean, what: string): HTMLElement => {
  const holding = within(part).getAllByRole('listitem').filter(holds);
  const innermost = holding.filter(run => not(holding.some(other => other !== run && run.contains(other))));
  if (not(innermost.length)) {
    throw new Error(`no run ${what}`);
  }
  if (innermost.length > 1) {
    throw new Error(`${innermost.length} runs ${what}`);
  }
  return innermost[0];
};

const runTelling = (part: HTMLElement, words: RegExp): HTMLElement =>
  runWith(part, run => is(within(run).queryByText(words)), `tells ${words}`);

const openerOf = (part: HTMLElement): HTMLElement => {
  const title = within(part).getByRole('heading', {level: 2});
  const afterTitle = within(part).getAllByRole('paragraph')
    .filter(paragraph => is(title.compareDocumentPosition(paragraph) & Node.DOCUMENT_POSITION_FOLLOWING));
  if (not(afterTitle.length)) {
    throw new Error('no paragraph after the part\'s title');
  }
  return afterTitle[0];
};

const drawingsIn = (part: HTMLElement): HTMLElement[] =>
  within(part).getAllByRole('figure')
    .filter(figure => not(within(figure).queryByRole('code')) && not(within(figure).queryAllByTitle(/./).length));

const sampleFiguresIn = (run: HTMLElement): HTMLElement[] => {
  const figures = within(run).queryAllByRole('figure');
  return figures.filter(figure => not(figures.some(other => other !== figure && figure.contains(other))));
};

const samplesIn = (run: HTMLElement): HTMLElement[] =>
  sampleFiguresIn(run).flatMap(figure => within(figure).queryAllByRole('code'));

const sampleBeside = (part: HTMLElement, words: RegExp): HTMLElement => {
  const samples = samplesIn(runTelling(part, words));
  if (samples.length !== 1) {
    throw new Error(`${samples.length} samples beside ${words}`);
  }
  return samples[0];
};

const sourcesIn = (run: HTMLElement): string[] =>
  sampleFiguresIn(run).flatMap(figure => within(figure).queryAllByRole('link', {name: /on GitHub$/}))
    .map(link => link.textContent);

export const explanation = {
  part: (heading: string): Promise<HTMLElement> => screen.findByRole('region', {name: heading}),
  partIn: (holder: HTMLElement, heading: string): HTMLElement => within(holder).getByRole('region', {name: heading}),
  partNames: (): string[] => screen.getAllByRole('region').map(region => computeAccessibleName(region)),
  partTitles: (holder: HTMLElement): string[] => within(holder).getAllByRole('heading', {level: 2}).map(heading => heading.textContent),
  sectionTitles: (part: HTMLElement): string[] => within(part).getAllByRole('heading', {level: 3}).map(heading => heading.textContent),
  foldsIn: (holder: HTMLElement): HTMLElement[] => within(holder).getAllByRole('group'),
  foldLabelsIn: (holder: HTMLElement): string[] => within(holder).getAllByRole('group')
    .map(fold => within(fold).getAllByText(/\S/)[0].textContent),
  runsIn: (holder: HTMLElement): HTMLElement[] => within(holder).getAllByRole('listitem'),
  samplesIn,
  linkNamed: (part: HTMLElement, name: string | RegExp): HTMLElement => within(part).getByRole('link', {name}),
  linkInProse,
  linksNamed: (part: HTMLElement, name: string | RegExp): HTMLElement[] => within(part).getAllByRole('link', {name}),
  linksTo: (part: HTMLElement, site: string): HTMLElement[] => within(part).getAllByRole('link')
    .filter(link => link.getAttribute('href')?.startsWith(site) ?? false),
  queryLinkNamed: (part: HTMLElement, name: string | RegExp): HTMLElement | null => within(part).queryByRole('link', {name}),
  drawingNamed: (part: HTMLElement, name: string | RegExp): HTMLElement => within(part).getByRole('figure', {name}),
  drawingsTitled: (part: HTMLElement, titles: string[]): HTMLElement[] =>
    titles.map(title => within(part).getByRole('figure', {name: new RegExp(`^${title}\\.`)})),
  saying: (part: HTMLElement, words: string | RegExp): HTMLElement => within(part).getByText(words),
  opener: openerOf,
  sourcesBeside: (part: HTMLElement, words: RegExp): string[] => sourcesIn(runTelling(part, words)),
  sampleFilesBeside: (part: HTMLElement, words: RegExp): string[][] =>
    sampleFiguresIn(runTelling(part, words)).map(figure =>
      within(figure).getAllByRole('link').map(link => link.textContent ?? '')),
  linksBeside: (part: HTMLElement, words: RegExp): (string | null)[][] => within(runTelling(part, words)).getAllByRole('link')
    .map(link => [link.textContent, link.getAttribute('href')]),
  runTelling,
  codeBeside: sampleBeside,
  drawingsIn
};
