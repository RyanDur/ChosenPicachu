import {has} from '@ryandur/sand';

export type Direction = 'ascending' | 'descending';

export type Value = number | string;

type Choice = {
  display: string;
  direction?: Direction;
};

const choices: readonly Choice[] = [
  {display: 'ascending', direction: 'ascending'},
  {display: 'descending', direction: 'descending'},
  {display: 'reset'}
];

const directionOf = (label: string): Direction | undefined => {
  const choice = choices.find(({display}) => display === label);
  return has(choice) ? choice.direction : undefined;
};

const ranked = <Seat>(
  seats: readonly Seat[],
  valueOf: (seat: Seat) => Value | undefined,
  direction: Direction
): Seat[] =>
  [...seats].sort((left, right) => {
    const first = valueOf(left);
    const second = valueOf(right);
    const gap = typeof first === 'string' || typeof second === 'string'
      ? String(first ?? '').localeCompare(String(second ?? ''))
      : (first ?? Number.NEGATIVE_INFINITY) - (second ?? Number.NEGATIVE_INFINITY);
    return direction === 'ascending' ? gap : -gap;
  });

export const sorting = {
  choices,
  directionOf,
  ranked
};
