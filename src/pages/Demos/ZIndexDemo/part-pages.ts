import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';
import {partHeadings} from './part-headings';

export type ZIndexPart = keyof typeof names['z-index'];

const bookOrder = ['third-on-top', 'still-loses', 'what-else-forms', 'popover-wins', 'fixed-banner-loses', 'build-this-feature'] as const;

export type BookPart = typeof bookOrder[number];

const titles: Record<BookPart, string> = {
  'third-on-top': 'Why Third is on top',
  'still-loses': 'Why 9999 still loses',
  'what-else-forms': 'What else forms a stacking context',
  'popover-wins': 'Why the popover wins',
  'fixed-banner-loses': 'Why a fixed banner still loses',
  'build-this-feature': 'Let’s build this feature'
};

const tabHeadings: Record<BookPart, string> = {
  'third-on-top': partHeadings.thirdOnTop,
  'still-loses': partHeadings.stillLoses,
  'what-else-forms': partHeadings.whatElseForms,
  'popover-wins': partHeadings.popoverWins,
  'fixed-banner-loses': partHeadings.fixedBannerLoses,
  'build-this-feature': partHeadings.buildThisFeature
};

type Listing = {book: BookPart; minutes: number};

type Told = {heading: string; name: string; minutes: number; ordinal: number; says: string};

type ZIndexParts = {
  told: (part: ZIndexPart) => Told;
  addressOf: (part: ZIndexPart) => string;
  shownAt: (pathname: string) => Maybe<ZIndexPart>;
  titleOf: (book: BookPart) => string;
  numbered: (book: BookPart) => string;
  tabHeadingOf: (book: BookPart) => string;
  pageOf: (book: BookPart) => Maybe<ZIndexPart>;
  previousOf: (part: ZIndexPart) => Maybe<BookPart>;
  nextOf: (part: ZIndexPart) => Maybe<BookPart>;
  inTheBook: number;
};

const listings: Record<ZIndexPart, Listing> = {
  'why-third-is-on-top': {book: 'third-on-top', minutes: 2},
  'why-9999-still-loses': {book: 'still-loses', minutes: 2}
};

const tabAddress = demoTab.address(DemoTopics.zIndex);

const addressOf = (part: ZIndexPart): string => `${tabAddress}${part}/`;

const placeOf = (book: BookPart): number => bookOrder.indexOf(book);

const besidePart = (part: ZIndexPart, step: number): Maybe<BookPart> =>
  maybe(bookOrder[placeOf(listings[part].book) + step]);

const isPart = (name: string): name is ZIndexPart => Object.keys(listings).includes(name);

const parts = Object.keys(listings).filter(isPart);

const partAt = (pathname: string): Maybe<ZIndexPart> => {
  const named = pathname.slice(tabAddress.length, -1);
  return maybe(isPart(named) && pathname === addressOf(named) ? named : undefined);
};

export const zIndexParts: ZIndexParts = {
  told: part => {
    const {book, minutes} = listings[part];
    return {
      heading: tabHeadings[book],
      name: titles[book],
      minutes,
      ordinal: placeOf(book) + 1,
      says: names['z-index'][part].description
    };
  },
  addressOf,
  shownAt: partAt,
  titleOf: book => titles[book],
  numbered: book => `${placeOf(book) + 1}. ${titles[book]}`,
  tabHeadingOf: book => tabHeadings[book],
  pageOf: book => maybe(parts.find(part => listings[part].book === book)),
  previousOf: part => besidePart(part, -1),
  nextOf: part => besidePart(part, 1),
  inTheBook: bookOrder.length
};
