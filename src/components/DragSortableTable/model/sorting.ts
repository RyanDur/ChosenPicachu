import {Maybe, maybe, nothing, some} from '@ryandur/sand';

export type Direction = 'ascending' | 'descending';

export type SortKey = number | string;

export type Choice = Direction | 'reset';

const choices: readonly Choice[] = ['ascending', 'descending', 'reset'];

const choiceOf = (named: string): Maybe<Choice> => maybe(choices.find(choice => choice === named));

const directionOf = (choice: Choice): Maybe<Direction> => choice === 'reset' ? nothing() : some(choice);

const ranked = <Seat>(
  seats: readonly Seat[],
  sortKeyOf: (seat: Seat) => Maybe<SortKey>,
  direction: Direction
): Seat[] =>
  [...seats].sort((left, right) => {
    const first = sortKeyOf(left);
    const second = sortKeyOf(right);
    const difference = worded(first) || worded(second)
      ? wordOf(first).localeCompare(wordOf(second))
      : numberOf(first) - numberOf(second);
    return direction === 'ascending' ? difference : -difference;
  });

const worded = (key: Maybe<SortKey>): boolean => key.map(value => typeof value === 'string').orElse(false);
const wordOf = (key: Maybe<SortKey>): string => key.map(String).orElse('');
const numberOf = (key: Maybe<SortKey>): number => key.map(Number).orElse(Number.NEGATIVE_INFINITY);

export const sorting = {
  choices,
  choiceOf,
  directionOf,
  ranked
};
