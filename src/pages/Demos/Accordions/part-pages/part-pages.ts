import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';
import type {Place} from '@pages/Demos/useCarriedAddress';

export type AccordionPart = keyof typeof names.accordions;

const bookParts = [
  'html-alone-heading',
  'remembers-heading',
  'max-height-guess-heading',
  'measured-heading',
  'platform-way-heading',
  'motion-heading'
] as const;

export type BookPart = typeof bookParts[number];

const titles: Record<BookPart, string> = {
  'html-alone-heading': 'An accordion in HTML alone',
  'remembers-heading': 'A box remembers the fold, and a rule reads it',
  'max-height-guess-heading': 'The max-height guess',
  'measured-heading': 'The measured height',
  'platform-way-heading': 'What the platform gives now',
  'motion-heading': 'How a sliding fold moves'
};

type Listing = {heading: BookPart; minutes: number};

type Told = {heading: BookPart; name: string; minutes: number; ordinal: number; says: string};

type AccordionParts = {
  told: (part: AccordionPart) => Told;
  addressOf: (part: AccordionPart) => string;
  shownAt: (pathname: string) => Maybe<AccordionPart>;
  whereIs: (heading: BookPart) => Place;
  titleOf: (heading: BookPart) => string;
  numbered: (heading: BookPart) => string;
  previousOf: (part: AccordionPart) => Maybe<BookPart>;
  nextOf: (part: AccordionPart) => Maybe<BookPart>;
  inTheBook: number;
};

const listings: Record<AccordionPart, Listing> = {
  'a-box-remembers-the-fold': {heading: 'remembers-heading', minutes: 8},
  'the-max-height-guess': {heading: 'max-height-guess-heading', minutes: 1},
  'the-measured-height': {heading: 'measured-heading', minutes: 5}
};

const tabAddress = demoTab.address(DemoTopics.accordions);

const addressOf = (part: AccordionPart): string => `${tabAddress}${part}/`;

const placeOf = (heading: BookPart): number => bookParts.indexOf(heading);

const besidePart = (part: AccordionPart, step: number): Maybe<BookPart> =>
  maybe(bookParts[placeOf(listings[part].heading) + step]);

const isPart = (name: string): name is AccordionPart => Object.keys(listings).includes(name);

const parts = Object.keys(listings).filter(isPart);

const whereIs = (heading: BookPart): Place =>
  maybe(parts.find(part => listings[part].heading === heading)).either(
    part => ({to: addressOf(part)}),
    () => ({to: tabAddress, heading}));

const partAt = (pathname: string): Maybe<AccordionPart> => {
  const named = pathname.slice(tabAddress.length, -1);
  return maybe(isPart(named) && pathname === addressOf(named) ? named : undefined);
};

export const accordionParts: AccordionParts = {
  told: part => {
    const {heading, minutes} = listings[part];
    return {
      heading,
      name: titles[heading],
      minutes,
      ordinal: placeOf(heading) + 1,
      says: names.accordions[part].description
    };
  },
  addressOf,
  shownAt: partAt,
  whereIs,
  titleOf: heading => titles[heading],
  numbered: heading => `${placeOf(heading) + 1}. ${titles[heading]}`,
  previousOf: part => besidePart(part, -1),
  nextOf: part => besidePart(part, 1),
  inTheBook: bookParts.length
};
