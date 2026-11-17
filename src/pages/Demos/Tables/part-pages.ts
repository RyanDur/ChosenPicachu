import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';
import {designHeading, featuresHeading, needHeading, stations, storiesHeading} from '@pages/Demos/headings';
import type {Place} from '@pages/Demos/useCarriedAddress';
import {livingStories} from './living-stories';

export type TablePart = keyof typeof names.tableParts;

type Told = {
  name: string;
  says: string;
  minutes: number;
  ordinal: number;
};

const book = [
  'the-need-and-its-clues',
  'the-sketch',
  'the-slices',
  'the-still-table',
  'the-live-table-and-the-store'
] as const satisfies readonly TablePart[];

type BookPart = typeof book[number];

const titles: Record<BookPart, string> = {
  'the-need-and-its-clues': needHeading.title,
  'the-sketch': designHeading.title,
  'the-slices': storiesHeading.title,
  'the-still-table': 'Build the still table',
  'the-live-table-and-the-store': 'Make the table live'
};

const minutes: Record<BookPart, number> = {
  'the-need-and-its-clues': 1,
  'the-sketch': 1,
  'the-slices': 2,
  'the-still-table': 5,
  'the-live-table-and-the-store': 12
};

const opens: Partial<Record<TablePart, string[]>> = {
  'the-still-table': [livingStories.ids.still],
  'the-live-table-and-the-store': [livingStories.ids.flow, livingStories.ids.store]
};

export type PartPlace = Place & {
  title: string;
};

const tabAddress = demoTab.address(DemoTopics.tables);

const addressOf = (part: TablePart): string => `${tabAddress}${part}/`;

const ordinalOf = (part: TablePart): number => book.indexOf(part) + 1;

const whereIs = (station: number): Place =>
  maybe(book[station - 1]).either(
    part => ({to: addressOf(part), ...maybe(opens[part]).map(ids => ({search: {[livingStories.param]: ids.join(',')}})).orElse({})}),
    () => ({to: tabAddress, heading: stations.idOf(station)}));

const neighborOf = (part: TablePart): PartPlace =>
  ({title: `${ordinalOf(part)}. ${titles[part]}`, ...whereIs(ordinalOf(part))});

const featuresStation = book.length + 1;

const theFeatures: PartPlace = {title: featuresHeading.title, ...whereIs(featuresStation)};

const besides = (part: TablePart, step: number): Maybe<PartPlace> =>
  maybe(book[ordinalOf(part) - 1 + step]).map(neighborOf);

export const tableParts = {
  told: (part: TablePart): Told => ({
    name: titles[part],
    minutes: minutes[part],
    ordinal: ordinalOf(part),
    says: names.tableParts[part].description
  }),
  previousOf: (part: TablePart): Maybe<PartPlace> => besides(part, -1),
  nextOf: (part: TablePart): Maybe<PartPlace> => maybe(besides(part, 1).orElse(theFeatures)),
  addressOf,
  whereIs,
  shownAt: (pathname: string): Maybe<TablePart> => maybe(book.find(part => pathname === addressOf(part))),
  inOrder: book,
  featuresStation,
  inTheBook: book.length
};
