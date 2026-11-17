import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';

export type AccordionPart = keyof typeof names.accordions;

const titles = {
  'html-alone-heading': 'An accordion in HTML alone',
  'remembers-heading': 'A box remembers the fold, and a rule reads it',
  'max-height-guess-heading': 'The max-height guess',
  'measured-heading': 'The measured height',
  'platform-way-heading': 'What the platform gives now',
  'motion-heading': 'How a sliding fold moves'
};

export type TabHeading = keyof typeof titles;

type Listing = {heading: TabHeading; minutes: number};

type Told = {name: string; minutes: number; ordinal: number; says: string};

type AccordionParts = {
  told: (part: AccordionPart) => Told;
  addressOf: (part: AccordionPart) => string;
  shownAt: (pathname: string) => Maybe<AccordionPart>;
  titleOf: (heading: TabHeading) => string;
  inTheBook: number;
};

const listings: Record<AccordionPart, Listing> = {
  'the-measured-height': {heading: 'measured-heading', minutes: 9}
};

const headings = Object.keys(titles);

const tabAddress = demoTab.address(DemoTopics.accordions);

const addressOf = (part: AccordionPart): string => `${tabAddress}${part}/`;

const isPart = (name: string): name is AccordionPart => Object.keys(listings).includes(name);

const partAt = (pathname: string): Maybe<AccordionPart> => {
  const named = pathname.slice(tabAddress.length, -1);
  return maybe(isPart(named) && pathname === addressOf(named) ? named : undefined);
};

export const accordionParts: AccordionParts = {
  told: part => {
    const {heading, minutes} = listings[part];
    return {
      name: titles[heading],
      minutes,
      ordinal: headings.indexOf(heading) + 1,
      says: names.accordions[part].description
    };
  },
  addressOf,
  shownAt: partAt,
  titleOf: heading => titles[heading],
  inTheBook: headings.length
};
