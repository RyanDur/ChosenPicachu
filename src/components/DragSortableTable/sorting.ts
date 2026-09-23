import {has} from '@ryandur/sand';

export type Direction = 'ascending' | 'descending';

export type Value = number | string;

type Choice = {
  display: string;
  direction?: Direction;
};

export const choices: readonly Choice[] = [
  {display: 'ascending', direction: 'ascending'},
  {display: 'descending', direction: 'descending'},
  {display: 'reset'}
];

export const directionOf = (label: string): Direction | undefined => {
  const choice = choices.find(({display}) => display === label);
  return has(choice) ? choice.direction : undefined;
};

export const ranked = <Seat>(seats: readonly Seat[], valueOf: (seat: Seat) => Value | undefined, direction: Direction): Seat[] =>
  [...seats].sort((left, right) => {
    const first = valueOf(left);
    const second = valueOf(right);
    const gap = typeof first === 'string' || typeof second === 'string'
      ? String(first ?? '').localeCompare(String(second ?? ''))
      : (first ?? Number.NEGATIVE_INFINITY) - (second ?? Number.NEGATIVE_INFINITY);
    return direction === 'ascending' ? gap : -gap;
  });
