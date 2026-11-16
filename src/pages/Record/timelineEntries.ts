import {maybe} from '@ryandur/sand';
import {SharedYear} from './calendar';

type Dated = {readonly date: {readonly year: string}};

type Entry<Key extends string> = {readonly kind: 'moment'; readonly key: Key}
  | {
    readonly kind: 'shared year';
    readonly year: string;
    readonly momentsInTheYear: readonly Key[];
    readonly sharedYear: SharedYear;
  };

const of = <Key extends string>(
  inOrder: readonly Key[],
  headings: Record<Key, Dated>,
  sharedYears: Partial<Record<string, SharedYear>>
): readonly Entry<Key>[] => inOrder.reduce<readonly Entry<Key>[]>((entriesSoFar, key) => {
  const {year} = headings[key].date;
  return maybe(sharedYears[year]).either(
    (sharedYear): readonly Entry<Key>[] => entriesSoFar.some(entry => entry.kind === 'shared year' && entry.year === year)
      ? entriesSoFar
      : [...entriesSoFar, {
        kind: 'shared year',
        year,
        momentsInTheYear: inOrder.filter(other => headings[other].date.year === year),
        sharedYear
      }],
    (): readonly Entry<Key>[] => [...entriesSoFar, {kind: 'moment', key}]);
}, []);

export const timelineEntries = {of};
