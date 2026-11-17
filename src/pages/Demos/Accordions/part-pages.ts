import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';

export type AccordionPart = keyof typeof names.accordions;

const contents = {
  'html-alone-heading': 'An accordion in HTML alone',
  'remembers-heading': 'A box remembers the fold, and a rule reads it',
  'max-height-guess-heading': 'The max-height guess',
  'measured-heading': 'The measured height',
  'platform-way-heading': 'What the platform gives now',
  'motion-heading': 'How a sliding fold moves'
};

export type TabHeading = keyof typeof contents;

type Entry = {heading: TabHeading; minutes: number};

type Told = {name: string; minutes: number; ordinal: number; says: string};

type AccordionParts = {
  told: (part: AccordionPart) => Told;
  addressOf: (part: AccordionPart) => string;
  at: (pathname: string) => Maybe<AccordionPart>;
  titleOf: (heading: TabHeading) => string;
  inTheBook: number;
};

const entries: Record<AccordionPart, Entry> = {
  'the-measured-height': {heading: 'measured-heading', minutes: 9}
};

const parts = Object.keys(entries).filter((key): key is AccordionPart => key in entries);

const headings = Object.keys(contents);

const addressOf = (part: AccordionPart): string => `${demoTab.address(DemoTopics.accordions)}${part}/`;

export const accordionParts: AccordionParts = {
  told: part => {
    const {heading, minutes} = entries[part];
    return {
      name: contents[heading],
      minutes,
      ordinal: headings.indexOf(heading) + 1,
      says: names.accordions[part].description
    };
  },
  addressOf,
  at: pathname => maybe(parts.find(part => pathname === addressOf(part))),
  titleOf: heading => contents[heading],
  inTheBook: headings.length
};
