import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {DemoTopics, demoTab} from '@pages/Demos';
import {TablePart} from './part-pages';

export type Tutorial = keyof typeof names.tables;

type Place = {ordinal: number; outOf: number};

type TableTutorials = {
  all: () => readonly Tutorial[];
  nameOf: (tutorial: Tutorial) => string;
  minutesOf: (tutorial: Tutorial) => number;
  addressOf: (tutorial: Tutorial) => string;
  placeOf: (tutorial: Tutorial) => Place;
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

const minutes: Record<Tutorial, number> = {sort: 20, menu: 9, resize: 9};

const addressOf = (tutorial: Tutorial): string => `${demoTab.address(DemoTopics.tables)}${tutorial}/`;

export const tableTutorials: TableTutorials = {
  all: () => inOrder,
  nameOf: tutorial => named[tutorial],
  minutesOf: tutorial => minutes[tutorial],
  addressOf,
  placeOf: tutorial => ({ordinal: inOrder.indexOf(tutorial) + 1, outOf: inOrder.length}),
  at: pathname => maybe(inOrder.find(tutorial => pathname === addressOf(tutorial))),
  startingPart: 'the-live-table-and-the-store'
};
