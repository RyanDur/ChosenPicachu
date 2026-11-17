import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';
import {designHeading, needHeading} from '@pages/Demos/headings';

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

type Listing = {
  name: string;
  minutes: number;
};

const listings: Record<TablePart, Listing> = {
  'the-need-and-its-clues': {
    name: needHeading.title,
    minutes: 2
  }
};

const ordinalOf = (part: BookPart): number => book.indexOf(part) + 1;

type TabHeading = {
  id: string;
  title: string;
};

type OnwardPart = {
  part: BookPart;
  heading: TabHeading;
};

const onward: Record<TablePart, OnwardPart> = {
  'the-need-and-its-clues': {part: 'the-sketch', heading: designHeading}
};

type Onward = {
  numbered: string;
  heading: TabHeading;
};

const isListed = (part: BookPart): part is TablePart => Object.keys(listings).includes(part);

const all: readonly TablePart[] = book.filter(isListed);

const addressOf = (part: TablePart): string => `${demoTab.address(DemoTopics.tables)}${part}/`;

export const tableParts = {
  told: (part: TablePart): Told => {
    const {name, minutes} = listings[part];
    return {name, minutes, ordinal: ordinalOf(part), says: names.tableParts[part].description};
  },
  onwardOf: (part: TablePart): Onward => {
    const {part: next, heading} = onward[part];
    return {numbered: `${ordinalOf(next)}. ${heading.title}`, heading};
  },
  addressOf,
  shownAt: (pathname: string): Maybe<TablePart> => maybe(all.find(part => pathname === addressOf(part))),
  inTheBook: book.length
};
