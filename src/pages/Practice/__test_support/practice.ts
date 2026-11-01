import {isInaccessible, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Paths} from '@pages/Paths';
import {paragraphOpening} from '@__test_support/paragraph';

const practice = (): HTMLElement => screen.getByRole('region', {name: 'how I organize it'});
const tabs = (): HTMLElement => screen.getByRole('navigation', {name: 'practice'});

const openingParagraphs = (): HTMLElement[] => within(screen.getByRole('main')).getAllByRole('paragraph')
  .filter(paragraph => Boolean(paragraph.compareDocumentPosition(tabs()) & Node.DOCUMENT_POSITION_FOLLOWING));

const paragraphs = (): string[] => within(practice()).getAllByRole('paragraph').map(paragraph => paragraph.textContent ?? '');

const drawnTexts = (figure: string): HTMLElement[] =>
  within(within(practice()).getByRole('figure', {name: figure})).getAllByText(/./, {ignore: 'code, figcaption, figcaption *'});

export const practiceAt = (concern: string): string => `${Paths.practice}${concern}/`;

export const practicePage = {
  arrivedOn: (concern: string): Promise<HTMLElement> => screen.findByRole('heading', {name: `Practice ${concern}`, level: 1}),
  tabAddresses: (): (string | null)[] => within(tabs()).getAllByRole('link').map(tab => tab.getAttribute('href')),
  currentTab: (): string => within(tabs()).getByRole('link', {current: 'page'}).textContent ?? '',
  pickTab: (concern: string): Promise<void> => userEvent.click(within(tabs()).getByRole('link', {name: concern})),
  opener: (): Promise<HTMLElement> => screen.findByText(/^Each tab below is one of the three concerns/),
  openingParagraph: paragraphOpening,
  linksIn: (opening: RegExp): (string | null)[][] => within(paragraphOpening(opening)).getAllByRole('link')
    .map(link => [link.textContent, link.getAttribute('href')]),
  beforeTheTabs: (): string[] => openingParagraphs().map(paragraph => paragraph.textContent),
  openingSources: (): string[] => openingParagraphs()
    .flatMap(paragraph => within(paragraph).queryAllByRole('link'))
    .map(link => link.getAttribute('href') ?? '')
    .filter(source => new URL(source, window.location.href).origin !== window.location.origin),
  heading: (): HTMLElement => within(practice()).getByRole('heading', {name: 'how I organize it', level: 2}),
  paragraph: (opening: RegExp): HTMLElement => within(practice()).getByText(opening),
  paragraphs,
  paragraphAfter: (opening: RegExp): string | undefined => {
    const found = paragraphs().findIndex(paragraph => opening.test(paragraph));
    if (found === -1) {
      throw new Error(`no paragraph opening ${opening}`);
    }
    return paragraphs()[found + 1];
  },
  partHeadings: (): string[] => within(practice()).getAllByRole('heading', {level: 3}).map(heading => heading.textContent ?? ''),
  partHeading: (name: string): HTMLElement => within(practice()).getByRole('heading', {level: 3, name}),
  terms: (): string[] => within(practice()).getAllByRole('term').map(term => term.textContent ?? ''),
  definitions: (): string[] => within(practice()).getAllByRole('definition').map(definition => definition.textContent ?? ''),
  linksInDefinitionOf: (term: string): (string | null)[][] => {
    const definition = within(practice()).getAllByRole('term').find(found => found.textContent === term)?.nextElementSibling;
    if (definition instanceof HTMLElement) {
      return within(definition).queryAllByRole('link').map(link => [link.textContent, link.getAttribute('href')]);
    }
    throw new Error(`no definition of ${term}`);
  },
  sourcesLinked: (): string[] => within(practice()).getAllByRole('link')
    .map(link => link.getAttribute('href') ?? '')
    .filter(source => new URL(source, window.location.href).origin !== window.location.origin),
  figure: (name: string): HTMLElement => within(practice()).getByRole('figure', {name}),
  tagIn: (figure: string): string => within(within(practice()).getByRole('figure', {name: figure})).getByRole('code').textContent,
  drawingsSeenIn: (figure: string): string[] => drawnTexts(figure)
    .filter(text => !isInaccessible(text))
    .map(text => text.textContent),
  drawnIn: (figure: string): string[] => drawnTexts(figure).map(text => text.textContent),
  link: (name: string | RegExp): HTMLElement => within(practice()).getByRole('link', {name}),
  citations: (): (string | null | undefined)[][] => within(practice()).getAllByRole('link')
    .filter(link => (link.getAttribute('href') ?? '').startsWith(Paths.record))
    .map(link => [/\d{4}/.exec(link.textContent ?? '')?.[0], link.getAttribute('href')]),
  followMoment: async (name: string): Promise<void> => {
    await screen.findByRole('region', {name: 'how I organize it'});
    await userEvent.click(within(practice()).getAllByRole('link', {name})[0]);
  }
};
