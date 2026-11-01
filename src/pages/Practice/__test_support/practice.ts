import {isInaccessible, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {maybe, not} from '@ryandur/sand';
import {Paths} from '@pages/Paths';
import {moments} from '@pages/Record/moments/moments';
import {paragraphOpening, paragraphOpeningIn} from '@__test_support/paragraph';

const practice = (): HTMLElement => screen.getByRole('region', {name: 'how I organize it'});
const tabs = (): HTMLElement => screen.getByRole('navigation', {name: 'practice'});

const openingParagraphs = (): HTMLElement[] => within(screen.getByRole('main')).getAllByRole('paragraph')
  .filter(paragraph => Boolean(paragraph.compareDocumentPosition(tabs()) & Node.DOCUMENT_POSITION_FOLLOWING));

const practiceParagraphs = (): HTMLElement[] => within(practice()).getAllByRole('paragraph');

const onlyParagraph = (opening: RegExp): HTMLElement => paragraphOpeningIn(practice())(opening);

const paragraphs = (): string[] => practiceParagraphs().map(paragraph => paragraph.textContent ?? '');

const momentAddresses = Object.values(moments).map(({id}) => `${Paths.record}#${id}`);

const opensAMoment = (link: HTMLElement): boolean => momentAddresses.includes(link.getAttribute('href') ?? '');

const leadsToThisSitesCode = (link: HTMLElement): boolean => (link.getAttribute('href') ?? '').startsWith(Paths.repo);

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
  linksInItem: (opening: RegExp): (string | null)[][] => {
    const items = within(practice()).getAllByRole('listitem').filter(item => opening.test(item.textContent));
    if (items.length !== 1) {
      throw new Error(`${items.length} items opening ${opening}, not one`);
    }
    return within(items[0]).getAllByRole('link').map(link => [link.textContent, link.getAttribute('href')]);
  },
  codesIn: (opening: RegExp): string[] => within(paragraphOpening(opening)).getAllByRole('code').map(code => code.textContent),
  linksIn: (opening: RegExp): (string | null)[][] => within(paragraphOpening(opening)).getAllByRole('link')
    .map(link => [link.textContent, link.getAttribute('href')]),
  beforeTheTabs: (): string[] => openingParagraphs().map(paragraph => paragraph.textContent),
  openingSources: (): string[] => openingParagraphs()
    .flatMap(paragraph => within(paragraph).queryAllByRole('link'))
    .map(link => link.getAttribute('href') ?? '')
    .filter(source => new URL(source, window.location.href).origin !== window.location.origin),
  heading: (): HTMLElement => within(practice()).getByRole('heading', {name: 'how I organize it', level: 2}),
  bareSheets: (): string[] => [...(practice().textContent ?? '').replace(/“[^”]*”/g, '').matchAll(/(?<!style )\bsheets?\b/gi)]
    .map(([found]) => found),
  paragraph: onlyParagraph,
  itemsListedAfter: (opening: RegExp): string[] => {
    const list = onlyParagraph(opening).nextElementSibling;
    if (list instanceof HTMLElement) {
      return within(list).getAllByRole('listitem').map(item => item.textContent ?? '');
    }
    throw new Error(`no list after the paragraph opening ${opening}`);
  },
  linksInDefinitionOf: (term: string): (string | null)[][] => {
    const definition = within(practice()).getAllByRole('term').find(found => found.textContent === term)?.nextElementSibling;
    if (definition instanceof HTMLElement) {
      return within(definition).queryAllByRole('link').map(link => [link.textContent, link.getAttribute('href')]);
    }
    throw new Error(`no definition of ${term}`);
  },
  quotedIn: (opening: RegExp): {words: string; address: string | null} => {
    const holders = within(practice()).getAllByRole('listitem').concat(within(practice()).getAllByRole('paragraph'))
      .filter(holder => opening.test(holder.textContent));
    if (holders.length !== 1) {
      throw new Error(`${holders.length} places opening ${opening}, not one`);
    }
    const quotation = within(holders[0]).getAllByRole('link').find(link => link.textContent.startsWith('“'));
    if (!quotation) {
      throw new Error(`no quotation in the place opening ${opening}`);
    }
    return {words: quotation.textContent.slice(1, -1), address: quotation.getAttribute('href')};
  },
  codesListedAfter: (opening: RegExp): string[] => {
    const list = onlyParagraph(opening).nextElementSibling;
    if (list instanceof HTMLElement) {
      return within(list).getAllByRole('code').map(code => code.textContent);
    }
    throw new Error(`no list after the paragraph opening ${opening}`);
  },
  paragraphs,
  terms: (): string[] => within(practice()).getAllByRole('term').map(term => term.textContent ?? ''),
  definitions: (): string[] => within(practice()).getAllByRole('definition').map(definition => definition.textContent ?? ''),
  paragraphAfter: (opening: RegExp): string | undefined => {
    const found = practiceParagraphs().indexOf(onlyParagraph(opening));
    return paragraphs()[found + 1];
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
  sourcesLinked: (): string[] => within(practice()).getAllByRole('link')
    .filter(link => not(leadsToThisSitesCode(link)))
    .map(link => link.getAttribute('href') ?? '')
    .filter(source => new URL(source, window.location.href).origin !== window.location.origin),
  figure: (name: string): HTMLElement => within(practice()).getByRole('figure', {name}),
  carvedFrom: (source: string): HTMLElement[] => within(practice()).getAllByRole('figure', {name: `${source} on GitHub`}),
  codeOf: (carve: HTMLElement): string => within(carve).getByRole('code').textContent,
  tagIn: (figure: string): string => within(within(practice()).getByRole('figure', {name: figure})).getByRole('code').textContent,
  drawingsSeenIn: (figure: string): string[] => drawnTexts(figure)
    .filter(text => !isInaccessible(text))
    .map(text => text.textContent),
  drawnIn: (figure: string): string[] => drawnTexts(figure).map(text => text.textContent),
  link: (name: string | RegExp): HTMLElement => within(practice()).getByRole('link', {name}),
  citations: (): (string | null | undefined)[][] => within(practice()).getAllByRole('link')
    .filter(opensAMoment)
    .map(link => [/\d{4}/.exec(link.textContent ?? '')?.[0], link.getAttribute('href')]),
  followMoment: async (name: string): Promise<void> => {
    await screen.findByRole('region', {name: 'how I organize it'});
    await userEvent.click(within(practice()).getAllByRole('link', {name})[0]);
  }
};
