import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {DemoTopics, demoTab} from '@pages/Demos';
import {PartPlace, TablePart, tableParts} from './part-pages';

export type Tutorial = keyof typeof names.tables;

type TableTutorials = {
  all: () => readonly Tutorial[];
  nameOf: (tutorial: Tutorial) => string;
  minutesOf: (tutorial: Tutorial) => number;
  saysOf: (tutorial: Tutorial) => string;
  addressOf: (tutorial: Tutorial) => string;
  ordinalOf: (tutorial: Tutorial) => number;
  placeOf: (tutorial: Tutorial) => PartPlace;
  at: (pathname: string) => Maybe<Tutorial>;
  startingPart: TablePart;
};

const places: Record<Tutorial, number> = {sort: 1, menu: 2, resize: 3};

const inOrder: readonly Tutorial[] = Object.keys(places)
  .filter((key): key is Tutorial => key in places)
  .sort((one, other) => places[one] - places[other]);

const named: Record<Tutorial, string> = {
  sort: 'Drag sort',
  menu: 'Sort menu',
  resize: 'Drag resize'
};

const minutes: Record<Tutorial, number> = {sort: 18, menu: 7, resize: 7};

const addressOf = (tutorial: Tutorial): string => `${demoTab.address(DemoTopics.tables)}${tutorial}/`;

const ordinalOf = (tutorial: Tutorial): number => tableParts.count + inOrder.indexOf(tutorial) + 1;

export const tableTutorials: TableTutorials = {
  all: () => inOrder,
  nameOf: tutorial => named[tutorial],
  minutesOf: tutorial => minutes[tutorial],
  saysOf: tutorial => names.tables[tutorial].description,
  addressOf,
  ordinalOf,
  placeOf: tutorial => ({
    title: tableParts.numbered(ordinalOf(tutorial), named[tutorial]),
    to: addressOf(tutorial)
  }),
  at: pathname => maybe(inOrder.find(tutorial => pathname === addressOf(tutorial))),
  startingPart: 'the-live-table-and-the-store'
};
