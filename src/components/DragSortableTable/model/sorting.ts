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
    const worded = [first, second].some(key => key.map(value => typeof value === 'string').orElse(false));
    const difference = worded
      ? first.map(String).orElse('').localeCompare(second.map(String).orElse(''))
      : first.map(Number).orElse(Number.NEGATIVE_INFINITY) - second.map(Number).orElse(Number.NEGATIVE_INFINITY);
    return direction === 'ascending' ? difference : -difference;
  });

export const sorting = {
  choices,
  choiceOf,
  directionOf,
  ranked
};
