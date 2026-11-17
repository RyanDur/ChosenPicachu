import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';

export type AccordionPart = keyof typeof names.accordions;

type Entry = {name: string; minutes: number; ordinal: number};

type Told = Entry & {says: string};

type AccordionParts = {
  told: (part: AccordionPart) => Told;
  addressOf: (part: AccordionPart) => string;
  at: (pathname: string) => Maybe<AccordionPart>;
  inTheBook: number;
};

const entries: Record<AccordionPart, Entry> = {
  'the-measured-height': {
    name: 'The measured height',
    minutes: 9,
    ordinal: 4
  }
};

const parts = Object.keys(entries).filter((key): key is AccordionPart => key in entries);

const addressOf = (part: AccordionPart): string => `${demoTab.address(DemoTopics.accordions)}${part}/`;

export const accordionParts: AccordionParts = {
  told: part => ({...entries[part], says: names.accordions[part].description}),
  addressOf,
  at: pathname => maybe(parts.find(part => pathname === addressOf(part))),
  inTheBook: 6
};
