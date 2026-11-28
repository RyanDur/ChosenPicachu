import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';

export type ZIndexPart = keyof typeof names['z-index'];

const headings = [
  'The order HTML gives', 'How we used to raise things', 'What the platform gives now', 'Apply it'
] as const;

type Heading = typeof headings[number];

type Part = {title: string; minutes: number; heading: Heading};

const book = {
  'why-third-is-on-top': {title: 'Why Third is on top', minutes: 2, heading: 'The order HTML gives'},
  'how-position-places-a-box': {title: 'How position places a box', minutes: 3, heading: 'The order HTML gives'},
  'why-9999-still-loses': {title: 'Why 9999 still loses', minutes: 2, heading: 'The order HTML gives'},
  'what-else-forms-a-stacking-context': {
    title: 'What else forms a stacking context', minutes: 3, heading: 'The order HTML gives'
  },
  'why-a-fixed-banner-still-loses': {
    title: 'Why a fixed banner still loses', minutes: 3, heading: 'How we used to raise things'
  },
  'why-the-popover-wins': {title: 'Why the popover wins', minutes: 4, heading: 'What the platform gives now'},
  'lets-build-this-feature': {title: 'Let’s build this feature', minutes: 10, heading: 'Apply it'}
} satisfies Record<ZIndexPart, Part>;

type Group = {label: Heading; parts: readonly ZIndexPart[]};

type Told = {name: string; minutes: number; ordinal: number; says: string};

type ZIndexParts = {
  told: (part: ZIndexPart) => Told;
  addressOf: (part: ZIndexPart) => string;
  shownAt: (pathname: string) => Maybe<ZIndexPart>;
  numbered: (part: ZIndexPart) => string;
  previousOf: (part: ZIndexPart) => Maybe<ZIndexPart>;
  nextOf: (part: ZIndexPart) => Maybe<ZIndexPart>;
  inTheBook: number;
  groups: readonly Group[];
};

const isPart = (name: string): name is ZIndexPart => Object.keys(book).includes(name);

const groups: readonly Group[] = headings.map(label =>
  ({label, parts: Object.keys(book).filter(isPart).filter(part => book[part].heading === label)}));

const bookOrder: readonly ZIndexPart[] = groups.flatMap(({parts}) => parts);

const tabAddress = demoTab.address(DemoTopics.zIndex);

const addressOf = (part: ZIndexPart): string => `${tabAddress}${part}/`;

const placeOf = (part: ZIndexPart): number => bookOrder.indexOf(part);

const besidePart = (part: ZIndexPart, step: number): Maybe<ZIndexPart> => maybe(bookOrder[placeOf(part) + step]);

const partAt = (pathname: string): Maybe<ZIndexPart> => {
  const named = pathname.slice(tabAddress.length, -1);
  return maybe(isPart(named) && pathname === addressOf(named) ? named : undefined);
};

export const zIndexParts: ZIndexParts = {
  told: part => {
    const {title, minutes} = book[part];
    return {name: title, minutes, ordinal: placeOf(part) + 1, says: names['z-index'][part].description};
  },
  addressOf,
  shownAt: partAt,
  numbered: part => `${placeOf(part) + 1}. ${book[part].title}`,
  previousOf: part => besidePart(part, -1),
  nextOf: part => besidePart(part, 1),
  inTheBook: bookOrder.length,
  groups
};
