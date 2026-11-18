import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';
import {partHeadings} from '../part-headings';

export type ZIndexPart = keyof typeof names['z-index'];

type BookPart = 'third-on-top' | 'still-loses' | 'what-else-forms' | 'popover-wins' | 'fixed-banner-loses'
  | 'build-this-feature';

const bookOrder: readonly ZIndexPart[] = ['why-third-is-on-top', 'why-9999-still-loses',
  'what-else-forms-a-stacking-context', 'why-the-popover-wins', 'why-a-fixed-banner-still-loses',
  'lets-build-this-feature'];

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
  numbered: (part: ZIndexPart) => string;
  previousOf: (part: ZIndexPart) => Maybe<ZIndexPart>;
  nextOf: (part: ZIndexPart) => Maybe<ZIndexPart>;
  inTheBook: number;
};

const listings: Record<ZIndexPart, Listing> = {
  'why-third-is-on-top': {book: 'third-on-top', minutes: 2},
  'why-9999-still-loses': {book: 'still-loses', minutes: 2},
  'what-else-forms-a-stacking-context': {book: 'what-else-forms', minutes: 3},
  'why-the-popover-wins': {book: 'popover-wins', minutes: 4},
  'why-a-fixed-banner-still-loses': {book: 'fixed-banner-loses', minutes: 3},
  'lets-build-this-feature': {book: 'build-this-feature', minutes: 10}
};

const tabAddress = demoTab.address(DemoTopics.zIndex);

const addressOf = (part: ZIndexPart): string => `${tabAddress}${part}/`;

const placeOf = (part: ZIndexPart): number => bookOrder.indexOf(part);

const titleOf = (part: ZIndexPart): string => titles[listings[part].book];

const besidePart = (part: ZIndexPart, step: number): Maybe<ZIndexPart> => maybe(bookOrder[placeOf(part) + step]);

const isPart = (name: string): name is ZIndexPart => Object.keys(listings).includes(name);

const partAt = (pathname: string): Maybe<ZIndexPart> => {
  const named = pathname.slice(tabAddress.length, -1);
  return maybe(isPart(named) && pathname === addressOf(named) ? named : undefined);
};

export const zIndexParts: ZIndexParts = {
  told: part => {
    const {book, minutes} = listings[part];
    return {
      heading: tabHeadings[book],
      name: titleOf(part),
      minutes,
      ordinal: placeOf(part) + 1,
      says: names['z-index'][part].description
    };
  },
  addressOf,
  shownAt: partAt,
  numbered: part => `${placeOf(part) + 1}. ${titleOf(part)}`,
  previousOf: part => besidePart(part, -1),
  nextOf: part => besidePart(part, 1),
  inTheBook: bookOrder.length
};
