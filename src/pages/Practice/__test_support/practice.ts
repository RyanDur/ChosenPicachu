import {isInaccessible, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {maybe, not} from '@ryandur/sand';
import {Paths} from '@pages/Paths';
import {paragraphOpening} from '@__test_support/paragraph';

const practice = (): HTMLElement => screen.getByRole('region', {name: 'how I organize it'});
const tabs = (): HTMLElement => screen.getByRole('navigation', {name: 'practice'});

const openingParagraphs = (): HTMLElement[] => within(screen.getByRole('main')).getAllByRole('paragraph')
  .filter(paragraph => Boolean(paragraph.compareDocumentPosition(tabs()) & Node.DOCUMENT_POSITION_FOLLOWING));

const leadsToThisSitesCode = (link: HTMLElement): boolean => (link.getAttribute('href') ?? '').startsWith(Paths.repo);

const carveLinks = (): HTMLElement[] => within(practice()).getAllByRole('figure')
  .filter(figure => within(figure).queryAllByRole('code').length > 0)
  .flatMap(carve => within(carve).queryAllByRole('link'));

const drawnTexts = (figure: string): HTMLElement[] =>
  within(within(practice()).getByRole('figure', {name: figure})).getAllByText(/./, {ignore: 'code, figcaption, figcaption *'});

export const practiceAt = (concern: string): string => `${Paths.practice}${concern}/`;

export const practicePage = {
  arrivedOn: (concern: string): Promise<HTMLElement> => screen.findByRole('heading', {name: `Practice ${concern}`, level: 1}),
  tabAddresses: (): (string | null)[] => within(tabs()).getAllByRole('link').map(tab => tab.getAttribute('href')),
  currentTab: (): string => within(tabs()).getByRole('link', {current: 'page'}).textContent ?? '',
  pickTab: (concern: string): Promise<void> => userEvent.click(within(tabs()).getByRole('link', {name: concern})),
  opener: (): Promise<HTMLElement> => screen.findByText(/^Each tab below is one of the three concerns/),
  linksInItem: (opening: RegExp): (string | null)[][] => {
    const items = within(practice()).getAllByRole('listitem').filter(item => opening.test(item.textContent));
    if (items.length !== 1) {
      throw new Error(`${items.length} items opening ${opening}, not one`);
    }
    return within(items[0]).getAllByRole('link').map(link => [link.textContent, link.getAttribute('href')]);
  },
  linksIn: (opening: RegExp): (string | null)[][] => within(paragraphOpening(opening)).getAllByRole('link')
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
  quotationAddressIn: (opening: RegExp): string | null => {
    const holders = within(practice()).getAllByRole('listitem').concat(within(practice()).getAllByRole('paragraph'))
      .filter(holder => opening.test(holder.textContent));
    if (holders.length !== 1) {
      throw new Error(`${holders.length} places opening ${opening}, not one`);
    }
    const quotation = within(holders[0]).getAllByRole('link').find(link => link.textContent.startsWith('“'));
    if (!quotation) {
      throw new Error(`no quotation in the place opening ${opening}`);
    }
    return quotation.getAttribute('href');
  },
  partHeadings: (): string[] => within(practice()).getAllByRole('heading', {level: 3}).map(heading => heading.textContent ?? ''),
  partHeading: (name: string): HTMLElement => within(practice()).getByRole('heading', {level: 3, name}),
  linksUnder: (part: string): (string | null)[][] => {
    const heading = within(practice()).getByRole('heading', {level: 3, name: part});
    const parts = within(practice()).getAllByRole('heading', {level: 3});
    const next = maybe(parts[parts.indexOf(heading) + 1]);
    return within(practice()).getAllByRole('link')
      .filter(link => Boolean(heading.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING))
      .filter(link => next.map(after => Boolean(after.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_PRECEDING)).orElse(true))
      .map(link => [link.textContent, link.getAttribute('href')]);
  },
  sourcesLinked: (): string[] => {
    const pointersToCode = carveLinks();
    return within(practice()).getAllByRole('link')
      .filter(link => not(leadsToThisSitesCode(link)) && not(pointersToCode.includes(link)))
      .map(link => link.getAttribute('href') ?? '')
      .filter(source => new URL(source, window.location.href).origin !== window.location.origin);
  },
  figure: (name: string): HTMLElement => within(practice()).getByRole('figure', {name}),
  drawingsSeenIn: (figure: string): string[] => drawnTexts(figure)
    .filter(text => !isInaccessible(text))
    .map(text => text.textContent),
  imagesHeardIn: (caption: string): HTMLElement[] =>
    within(within(practice()).getByRole('figure', {name: caption})).queryAllByRole('img'),
  link: (name: string | RegExp): HTMLElement => within(practice()).getByRole('link', {name})
};
