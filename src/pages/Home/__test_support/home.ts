import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const section = (name: string): HTMLElement => screen.getByRole('region', {name});

const ownParagraphs = (name: string): HTMLElement[] => {
  const quotation = within(section(name)).getByRole('blockquote');
  return within(section(name)).getAllByRole('paragraph').filter(paragraph => !quotation.contains(paragraph));
};

const claim = (name: string): HTMLElement[] =>
  ownParagraphs(name).filter(paragraph => within(paragraph).queryAllByRole('link', {name: /^(Its story is on|How I organize it is on)/}).length === 0);

export const homePage = {
  arrived: (): Promise<HTMLElement> => screen.findByRole('heading', {level: 2, name: 'Structure'}),
  openerLinks: (): (string | null)[][] => {
    const firstSection = within(screen.getByRole('article')).getAllByRole('heading', {level: 2})[0];
    return within(screen.getByRole('article')).getAllByRole('link')
      .filter(link => Boolean(firstSection.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_PRECEDING))
      .map(link => [link.textContent, link.getAttribute('href')]);
  },
  sectionHeadings: (): (string | null)[] => within(screen.getByRole('article')).getAllByRole('heading', {level: 2}).map(heading => heading.textContent),
  quotationIn: (name: string): HTMLElement => within(section(name)).getByRole('blockquote'),
  quotationSource: (name: string): HTMLElement => within(section(name)).getByRole('link', {name: /^Brendan Eich, in Computerworld/}),
  claim,
  sectionHeading: (name: string): HTMLElement => within(section(name)).getByRole('heading', {level: 2, name}),
  sectionLinks: (name: string): HTMLElement[] => within(section(name)).getAllByRole('link'),
  sourcesLinked: (): string[] => within(screen.getByRole('main')).getAllByRole('link')
    .map(link => link.getAttribute('href') ?? '')
    .filter(source => new URL(source, window.location.href).origin !== window.location.origin),
  claimLinks: (name: string): HTMLElement[] => claim(name).flatMap(paragraph => within(paragraph).queryAllByRole('link')),
  storySignpost: (name: string): HTMLElement => within(section(name)).getByRole('link', {name: 'Its story is on the Record.'}),
  followStorySignpost: (name: string): Promise<void> => userEvent.click(within(section(name)).getByRole('link', {name: 'Its story is on the Record.'})),
  practiceSignpost: (name: string): HTMLElement => within(section(name)).getByRole('link', {name: 'How I organize it is on Practice.'})
};
