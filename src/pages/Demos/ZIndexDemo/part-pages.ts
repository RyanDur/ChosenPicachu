import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';

export type ZIndexPart = keyof typeof names['z-index'];

const titles = {
  'third-on-top': 'Why Third is on top',
  'still-loses': 'Why 9999 still loses',
  'what-else-forms': 'What else forms a stacking context',
  'popover-wins': 'Why the popover wins',
  'fixed-banner-loses': 'Why a fixed banner still loses',
  'build-this-feature': 'Let’s build this feature'
};

export type BookPart = keyof typeof titles;

type Listing = {book: BookPart; minutes: number};

type Told = {name: string; minutes: number; ordinal: number; says: string};

type ZIndexParts = {
  told: (part: ZIndexPart) => Told;
  addressOf: (part: ZIndexPart) => string;
  shownAt: (pathname: string) => Maybe<ZIndexPart>;
  titleOf: (book: BookPart) => string;
  inTheBook: number;
};

const listings: Record<ZIndexPart, Listing> = {
  'why-third-is-on-top': {book: 'third-on-top', minutes: 3}
};

const bookOrder = Object.keys(titles);

const tabAddress = demoTab.address(DemoTopics.zIndex);

const addressOf = (part: ZIndexPart): string => `${tabAddress}${part}/`;

const isPart = (name: string): name is ZIndexPart => Object.keys(listings).includes(name);

const partAt = (pathname: string): Maybe<ZIndexPart> => {
  const named = pathname.slice(tabAddress.length, -1);
  return maybe(isPart(named) && pathname === addressOf(named) ? named : undefined);
};

export const zIndexParts: ZIndexParts = {
  told: part => {
    const {book, minutes} = listings[part];
    return {
      name: titles[book],
      minutes,
      ordinal: bookOrder.indexOf(book) + 1,
      says: names['z-index'][part].description
    };
  },
  addressOf,
  shownAt: partAt,
  titleOf: book => titles[book],
  inTheBook: bookOrder.length
};
