import {Maybe, maybe} from '@ryandur/sand';
import names from '@navigation/names.json';
import {demoTab, DemoTopics} from '@pages/Demos';
import {designHeading, needHeading, storiesHeading} from '@pages/Demos/headings';
import type {Place} from '@pages/Demos/useCarriedAddress';

export type TablePart = keyof typeof names.tableParts;

type Told = {
  name: string;
  says: string;
  minutes: number;
  ordinal: number;
};

const buildParts = [
  'the-need-and-its-clues',
  'the-sketch',
  'the-slices',
  'the-still-table',
  'the-live-table-and-the-store'
] as const satisfies readonly TablePart[];

type BuildPart = typeof buildParts[number];

const titles: Record<BuildPart, string> = {
  'the-need-and-its-clues': needHeading.title,
  'the-sketch': designHeading.title,
  'the-slices': storiesHeading.title,
  'the-still-table': 'Build the still table',
  'the-live-table-and-the-store': 'Make the table live'
};

const minutes: Record<BuildPart, number> = {
  'the-need-and-its-clues': 1,
  'the-sketch': 1,
  'the-slices': 2,
  'the-still-table': 5,
  'the-live-table-and-the-store': 12
};

export type PartPlace = Place & {
  title: string;
};

const tabAddress = demoTab.address(DemoTopics.tables);

const addressOf = (part: TablePart): string => `${tabAddress}${part}/`;

const ordinalOf = (part: TablePart): number => buildParts.indexOf(part) + 1;

const numbered = (ordinal: number, title: string): string => `${ordinal}. ${title}`;

const placeOf = (part: TablePart): PartPlace =>
  ({title: numbered(ordinalOf(part), titles[part]), to: addressOf(part)});

export const tableParts = {
  told: (part: TablePart): Told => ({
    name: titles[part],
    minutes: minutes[part],
    ordinal: ordinalOf(part),
    says: names.tableParts[part].description
  }),
  addressOf,
  placeOf,
  numbered,
  shownAt: (pathname: string): Maybe<TablePart> => maybe(buildParts.find(part => pathname === addressOf(part))),
  inOrder: buildParts,
  count: buildParts.length
};
