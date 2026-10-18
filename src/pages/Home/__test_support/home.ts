import {screen, within} from '@testing-library/react';

const concern = (name: string): HTMLElement => screen.getByRole('region', {name});
const momentsOf = (name: string): HTMLElement => within(concern(name)).getByRole('region', {name: `${name} from the record`});

const essayOf = (name: string): HTMLElement[] => {
  const asides = [within(concern(name)).getByRole('blockquote'), momentsOf(name)];
  return within(concern(name)).getAllByRole('paragraph').filter(paragraph => !asides.some(aside => aside.contains(paragraph)));
};

export const homePage = {
  paragraph: (opening: RegExp): HTMLElement => screen.getByText(opening),
  linksIn: (paragraph: HTMLElement): HTMLElement[] => within(paragraph).getAllByRole('link'),
  concernHeadings: (): (string | null)[] => within(screen.getByRole('article')).getAllByRole('heading', {level: 2}).map(heading => heading.textContent),
  quotation: (words: RegExp): HTMLElement => screen.getByText(words),
  quotationSource: (name: string): HTMLElement => within(concern(name)).getByRole('link', {name: /^Brendan Eich, in Computerworld/}),
  practiceHeading: (): HTMLElement | null => screen.queryByRole('heading', {name: 'how I organize it'}),
  practiceRegion: (): HTMLElement | null => screen.queryByRole('region', {name: /how I organize it/}),
  essay: (name: string): string[] => essayOf(name).map(paragraph => paragraph.textContent ?? ''),
  essayOpening: (name: string): HTMLElement => essayOf(name)[0],
  quotations: (name: string, quoted: string): HTMLElement[] => within(concern(name)).getAllByRole('link', {name: quoted}),
  moments: momentsOf,
  momentList: (name: string): HTMLElement => within(momentsOf(name)).getByRole('list', {name: `${name}, from the record`}),
  momentLines: (name: string): (string | null)[] =>
    within(within(momentsOf(name)).getByRole('list', {name: `${name}, from the record`})).getAllByRole('link').map(line => line.textContent),
  momentLine: (name: string, line: string): HTMLElement =>
    within(within(momentsOf(name)).getByRole('list', {name: `${name}, from the record`})).getByRole('link', {name: line}),
  momentsHeading: (name: string): HTMLElement => within(momentsOf(name)).getByRole('heading', {level: 3, name: 'from the record'}),
  wholeRecord: (name: string): HTMLElement => within(concern(name)).getByRole('link', {name: 'the whole record'})
};
