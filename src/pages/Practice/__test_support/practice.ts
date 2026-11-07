import {isInaccessible, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {maybe, not} from '@ryandur/sand';
import {Paths} from '@pages/Paths';

const practice = (): HTMLElement => screen.getByRole('region', {name: 'how I organize it'});
const tabs = (): HTMLElement => screen.getByRole('navigation', {name: 'practice'});

const openingParagraphs = (): HTMLElement[] => within(screen.getByRole('main')).getAllByRole('paragraph')
  .filter(paragraph => Boolean(paragraph.compareDocumentPosition(tabs()) & Node.DOCUMENT_POSITION_FOLLOWING));

const leadsToThisSitesCode = (link: HTMLElement): boolean => (link.getAttribute('href') ?? '').startsWith(Paths.repo);

const carveLinks = (): HTMLElement[] => within(practice()).getAllByRole('figure')
  .filter(figure => within(figure).queryAllByRole('code').length > 0)
  .flatMap(carve => within(carve).queryAllByRole('link'));

const drawnTexts = (figure: string | RegExp): HTMLElement[] =>
  within(within(practice()).getByRole('figure', {name: figure})).getAllByText(/./, {ignore: 'code, figcaption, figcaption *'});

const linkElementsUnder = (part: string): HTMLElement[] => {
  const heading = within(practice()).getByRole('heading', {level: 3, name: part});
  const parts = within(practice()).getAllByRole('heading', {level: 3});
  const next = maybe(parts[parts.indexOf(heading) + 1]);
  return within(practice()).getAllByRole('link')
    .filter(link => Boolean(heading.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING))
    .filter(link => next
      .map(after => Boolean(after.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_PRECEDING))
      .orElse(true));
};

export const practiceAt = (concern: string): string => `${Paths.practice}${concern}/`;

export const practicePage = {
  arrivedOn: (concern: string): Promise<HTMLElement> => screen.findByRole('heading', {name: `Practice ${concern}`, level: 1}),
  tabAddresses: (): (string | null)[] => within(tabs()).getAllByRole('link').map(tab => tab.getAttribute('href')),
  currentTab: (): string => within(tabs()).getByRole('link', {current: 'page'}).textContent ?? '',
  pickTab: (concern: string): Promise<void> => userEvent.click(within(tabs()).getByRole('link', {name: concern})),
  opener: (): Promise<HTMLElement> => screen.findByText(/^Each tab below is one of the three concerns/),
  openingLinks: (): (string | null)[][] => openingParagraphs()
    .flatMap(paragraph => within(paragraph).queryAllByRole('link'))
    .map(link => [link.textContent, link.getAttribute('href')]),
  openingSources: (): string[] => openingParagraphs()
    .flatMap(paragraph => within(paragraph).queryAllByRole('link'))
    .map(link => link.getAttribute('href') ?? '')
    .filter(source => new URL(source, window.location.href).origin !== window.location.origin),
  heading: (): HTMLElement => within(practice()).getByRole('heading', {name: 'how I organize it', level: 2}),
  linksInDefinitionOf: (term: string): (string | null)[][] => {
    const definition = within(practice()).getAllByRole('term').find(found => found.textContent === term)?.nextElementSibling;
    if (definition instanceof HTMLElement) {
      return within(definition).queryAllByRole('link').map(link => [link.textContent, link.getAttribute('href')]);
    }
    throw new Error(`no definition of ${term}`);
  },
  partHeadings: (): string[] => within(practice()).getAllByRole('heading', {level: 3}).map(heading => heading.textContent ?? ''),
  partHeading: (name: string): HTMLElement => within(practice()).getByRole('heading', {level: 3, name}),
  linksUnder: (part: string): (string | null)[][] => linkElementsUnder(part)
    .map(link => [link.textContent, link.getAttribute('href')]),
  linkUnder: (part: string, name: string | RegExp): HTMLElement => {
    const inPart = linkElementsUnder(part);
    const named = within(practice()).getAllByRole('link', {name}).filter(link => inPart.includes(link));
    if (named.length !== 1) {
      throw new Error(`${named.length} links named ${name} under ${part}, not one`);
    }
    return named[0];
  },
  sourcesLinked: (): string[] => {
    const pointersToCode = carveLinks();
    return within(practice()).getAllByRole('link')
      .filter(link => not(leadsToThisSitesCode(link)) && not(pointersToCode.includes(link)))
      .map(link => link.getAttribute('href') ?? '')
      .filter(source => new URL(source, window.location.href).origin !== window.location.origin);
  },
  figure: (name: string | RegExp): HTMLElement => within(practice()).getByRole('figure', {name}),
  sample: (name: string, showing: string): HTMLElement => {
    const samples = within(practice()).getAllByRole('figure', {name}).filter(figure => figure.textContent.includes(showing));
    if (samples.length !== 1) {
      throw new Error(`${samples.length} samples named ${name} showing ${showing}, not one`);
    }
    return samples[0];
  },
  drawingsSeenIn: (figure: string | RegExp): string[] => drawnTexts(figure)
    .filter(text => !isInaccessible(text))
    .map(text => text.textContent),
  imagesHeardIn: (caption: string): HTMLElement[] =>
    within(within(practice()).getByRole('figure', {name: caption})).queryAllByRole('img'),
  link: (name: string | RegExp): HTMLElement => within(practice()).getByRole('link', {name})
};
