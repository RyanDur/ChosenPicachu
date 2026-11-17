import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';
import {designHeading, needHeading, storiesHeading} from '@pages/Demos/headings';
import {stations} from '@pages/Demos/Recipe';

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

type StationHeading = {
  id: string;
  title: string;
};

const headings = {
  'the-need-and-its-clues': needHeading,
  'the-sketch': designHeading,
  'the-slices': storiesHeading,
  'the-still-table': {id: stations.idOf(4), title: 'Build the still table'}
} satisfies Partial<Record<BookPart, StationHeading>>;

type HeadedPart = keyof typeof headings;

const minutes: Record<TablePart, number> = {
  'the-need-and-its-clues': 2,
  'the-sketch': 1,
  'the-slices': 2
};

type PartPlace = {
  numbered: string;
  to: string;
  heading?: string;
};

const tabAddress = demoTab.address(DemoTopics.tables);

const addressOf = (part: TablePart): string => `${tabAddress}${part}/`;

const ordinalOf = (part: BookPart): number => book.indexOf(part) + 1;

const isListed = (part: BookPart): part is TablePart => Object.keys(minutes).includes(part);

const isHeaded = (part: BookPart): part is HeadedPart => Object.keys(headings).includes(part);

const all: readonly TablePart[] = book.filter(isListed);

const neighborOf = (part: HeadedPart): PartPlace => {
  const {id, title} = headings[part];
  const numbered = `${ordinalOf(part)}. ${title}`;
  return isListed(part) ? {numbered, to: addressOf(part)} : {numbered, to: tabAddress, heading: id};
};

const besides = (part: TablePart, step: number): Maybe<PartPlace> =>
  maybe(book[ordinalOf(part) - 1 + step]).mBind(beside => maybe(isHeaded(beside) ? neighborOf(beside) : undefined));

export const tableParts = {
  told: (part: TablePart): Told => ({
    name: headings[part].title,
    minutes: minutes[part],
    ordinal: ordinalOf(part),
    says: names.tableParts[part].description
  }),
  previousOf: (part: TablePart): Maybe<PartPlace> => besides(part, -1),
  nextOf: (part: TablePart): Maybe<PartPlace> => besides(part, 1),
  addressOf,
  shownAt: (pathname: string): Maybe<TablePart> => maybe(all.find(part => pathname === addressOf(part))),
  inTheBook: book.length
};
