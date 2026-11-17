import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {DemoTopics, demoTab} from '@pages/Demos';

export type AccordionPart = keyof typeof names.accordions;

type Told = {name: string; says: string; minutes: number; ordinal: number};

type AccordionParts = {
  told: (part: AccordionPart) => Told;
  addressOf: (part: AccordionPart) => string;
  at: (pathname: string) => Maybe<AccordionPart>;
  inTheBook: number;
};

const told: Record<AccordionPart, Told> = {
  'the-measured-height': {
    name: 'The measured height',
    says: 'A script measures the text, and the style sheet slides the panel to that height.',
    minutes: 9,
    ordinal: 4
  }
};

const parts = Object.keys(told).filter((key): key is AccordionPart => key in told);

const addressOf = (part: AccordionPart): string => `${demoTab.address(DemoTopics.accordions)}${part}/`;

export const accordionParts: AccordionParts = {
  told: part => told[part],
  addressOf,
  at: pathname => maybe(parts.find(part => pathname === addressOf(part))),
  inTheBook: 6
};
