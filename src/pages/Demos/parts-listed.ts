import {maybe} from '@ryandur/sand';

export type PartsEntry = {
  readonly to: string;
  readonly heading?: string;
  readonly name: string;
  readonly minutes: number;
  readonly says: string;
};

export type PartsGroup = {
  readonly label?: string;
  readonly entries: readonly PartsEntry[];
};

const entriesIn = (groups: readonly PartsGroup[]): readonly PartsEntry[] => groups.flatMap(({entries}) => entries);

const countWords = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

const countOf = (count: number): string => maybe(countWords[count]).orElse(`${count}`);

const partsOf = (count: number): string => `${countOf(count)} ${count === 1 ? 'part' : 'parts'}`;

const minutesOf = (minutes: number): string => `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;

const minutesIn = (entries: readonly PartsEntry[]): number => entries.reduce((sum, entry) => sum + entry.minutes, 0);

const counted = (groups: readonly PartsGroup[]): string => {
  const entries = entriesIn(groups);
  return `${partsOf(entries.length)}, about ${minutesOf(minutesIn(entries))}.`;
};

const countedBriefly = (groups: readonly PartsGroup[]): string => {
  const entries = entriesIn(groups);
  return `${entries.length} ${entries.length === 1 ? 'part' : 'parts'}, ${minutesIn(entries)} min.`;
};

const startOf = (groups: readonly PartsGroup[], at: number): number => entriesIn(groups.slice(0, at)).length + 1;

type PartsListed = {
  counted: (groups: readonly PartsGroup[]) => string;
  countedBriefly: (groups: readonly PartsGroup[]) => string;
  startOf: (groups: readonly PartsGroup[], at: number) => number;
};

export const partsListed: PartsListed = {counted, countedBriefly, startOf};
