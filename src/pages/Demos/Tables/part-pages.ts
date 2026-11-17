import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';

export type TablePart = keyof typeof names.tableParts;

type Told = {
  name: string;
  says: string;
  minutes: number;
  ordinal: number;
};

const listings: Record<TablePart, Omit<Told, 'says'>> = {
  'the-need-and-its-clues': {
    name: 'Start with the need, and let it pick the element',
    minutes: 2,
    ordinal: 1
  }
};

const all: readonly TablePart[] = ['the-need-and-its-clues'];

const addressOf = (part: TablePart): string => `${demoTab.address(DemoTopics.tables)}${part}/`;

export const tableParts = {
  told: (part: TablePart): Told => ({...listings[part], says: names.tableParts[part].description}),
  addressOf,
  shownAt: (pathname: string): Maybe<TablePart> => maybe(all.find(part => pathname === addressOf(part))),
  inTheBook: 5
};
