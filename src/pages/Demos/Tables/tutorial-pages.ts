import {Maybe, maybe} from '@ryandur/sand';
import names from '@pages/names.json';
import {demoAddress, DemoTopics} from '../types';

export type Tutorial = keyof typeof names.tables;

type Place = {number: number; of: number};

type TableTutorials = {
  all: () => readonly Tutorial[];
  nameOf: (tutorial: Tutorial) => string;
  addressOf: (tutorial: Tutorial) => string;
  placeOf: (tutorial: Tutorial) => Place;
  at: (pathname: string) => Maybe<Tutorial>;
  startingStation: number;
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

const addressOf = (tutorial: Tutorial): string => `${demoAddress(DemoTopics.tables)}${tutorial}/`;

export const tableTutorials: TableTutorials = {
  all: () => inOrder,
  nameOf: tutorial => named[tutorial],
  addressOf,
  placeOf: tutorial => ({number: inOrder.indexOf(tutorial) + 1, of: inOrder.length}),
  at: pathname => maybe(inOrder.find(tutorial => pathname === addressOf(tutorial))),
  startingStation: 5
};
