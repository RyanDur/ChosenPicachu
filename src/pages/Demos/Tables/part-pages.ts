import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {DemoTopics, demoTab} from '@pages/Demos';

export type TablePart = keyof typeof names.tableParts;

type Told = {
  name: string;
  says: string;
  minutes: number;
  ordinal: number;
};

const told: Record<TablePart, Told> = {
  'the-need-and-its-clues': {
    name: 'Start with the need, and let it pick the element',
    says: 'A trader says what they need, and its clues show that a table is the element built for it.',
    minutes: 2,
    ordinal: 1
  }
};

const all: readonly TablePart[] = ['the-need-and-its-clues'];

const addressOf = (part: TablePart): string => `${demoTab.address(DemoTopics.tables)}${part}/`;

export const tableParts = {
  told: (part: TablePart): Told => told[part],
  addressOf,
  at: (pathname: string): Maybe<TablePart> => maybe(all.find(part => pathname === addressOf(part))),
  inTheBook: 5
};
