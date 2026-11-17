import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';
import {designHeading, needHeading, stations, storiesHeading} from '@pages/Demos/headings';
import type {Place} from '@pages/Demos/useCarriedAddress';
import {stillStory} from './still-story';

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
] as const;

type BookPart = typeof book[number];

const titles: Record<BookPart, string> = {
  'the-need-and-its-clues': needHeading.title,
  'the-sketch': designHeading.title,
  'the-slices': storiesHeading.title,
  'the-still-table': 'Build the still table',
  'the-live-table-and-the-store': 'Make the table live'
};

const minutes: Record<TablePart, number> = {
  'the-need-and-its-clues': 1,
  'the-sketch': 1,
  'the-slices': 2,
  'the-still-table': 5
};

const opens: Partial<Record<TablePart, typeof stillStory>> = {
  'the-still-table': stillStory
};

export type PartPlace = Place & {
  numbered: string;
};

const tabAddress = demoTab.address(DemoTopics.tables);

const addressOf = (part: TablePart): string => `${tabAddress}${part}/`;

const ordinalOf = (part: BookPart): number => book.indexOf(part) + 1;

const isListed = (part: BookPart): part is TablePart => Object.keys(minutes).includes(part);

const all: readonly TablePart[] = book.filter(isListed);

const whereIs = (station: number): Place =>
  maybe(book[station - 1]).mBind(part => maybe(isListed(part) ? part : undefined)).either(
    part => ({to: addressOf(part), ...maybe(opens[part]).map(({param, id}) => ({search: {[param]: id}})).orElse({})}),
    () => ({to: tabAddress, heading: stations.idOf(station)}));

const neighborOf = (part: BookPart): PartPlace =>
  ({numbered: `${ordinalOf(part)}. ${titles[part]}`, ...whereIs(ordinalOf(part))});

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
  nextOf: (part: TablePart): Maybe<PartPlace> => besides(part, 1),
  addressOf,
  whereIs,
  shownAt: (pathname: string): Maybe<TablePart> => maybe(all.find(part => pathname === addressOf(part))),
  inTheBook: book.length
};
