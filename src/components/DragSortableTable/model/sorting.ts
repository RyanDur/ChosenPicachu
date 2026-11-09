import {Maybe, maybe} from '@ryandur/sand';

export type Direction = 'ascending' | 'descending';

export type Value = number | string;

export type Choice = Direction | 'reset';

const choices: readonly Choice[] = ['ascending', 'descending', 'reset'];

const choiceOf = (value: string): Maybe<Choice> => maybe(choices.find(choice => choice === value));

const directionOf = (choice: Choice): Direction | undefined => choice === 'reset' ? undefined : choice;

const ranked = <Seat>(
  seats: readonly Seat[],
  valueOf: (seat: Seat) => Value | undefined,
  direction: Direction
): Seat[] =>
  [...seats].sort((left, right) => {
    const first = valueOf(left);
    const second = valueOf(right);
    const difference = typeof first === 'string' || typeof second === 'string'
      ? String(first ?? '').localeCompare(String(second ?? ''))
      : (first ?? Number.NEGATIVE_INFINITY) - (second ?? Number.NEGATIVE_INFINITY);
    return direction === 'ascending' ? difference : -difference;
  });

export const sorting = {
  choices,
  choiceOf,
  directionOf,
  ranked
};
