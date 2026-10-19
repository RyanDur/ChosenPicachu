import {screen, within} from '@testing-library/react';

const concern = (name: string): HTMLElement => screen.getByRole('region', {name});

const ownParagraphs = (name: string): HTMLElement[] => {
  const quotation = within(concern(name)).getByRole('blockquote');
  return within(concern(name)).getAllByRole('paragraph').filter(paragraph => !quotation.contains(paragraph));
};

export const homePage = {
  arrived: (): Promise<HTMLElement> => screen.findByText(/^A webpage is three languages working in concert/),
  paragraph: (opening: RegExp): HTMLElement => screen.getByText(opening),
  linksIn: (paragraph: HTMLElement): HTMLElement[] => within(paragraph).getAllByRole('link'),
  concernHeadings: (): (string | null)[] => within(screen.getByRole('article')).getAllByRole('heading', {level: 2}).map(heading => heading.textContent),
  concernHeading: (name: string): HTMLElement => within(concern(name)).getByRole('heading', {level: 2, name}),
  quotation: (words: RegExp): HTMLElement => screen.getByText(words),
  quotationIn: (name: string): HTMLElement => within(concern(name)).getByRole('blockquote'),
  quotationSource: (name: string): HTMLElement => within(concern(name)).getByRole('link', {name: /^Brendan Eich, in Computerworld/}),
  concernText: (name: string): string[] => ownParagraphs(name).map(paragraph => paragraph.textContent ?? ''),
  summary: (name: string): HTMLElement => ownParagraphs(name)[0],
  storySignpost: (name: string): HTMLElement => within(concern(name)).getByRole('link', {name: 'Its story is on the record.'}),
  practiceSignpost: (name: string): HTMLElement => within(concern(name)).getByRole('link', {name: 'How I organize it is on Practice.'})
};
