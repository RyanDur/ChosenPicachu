import {DragEvent} from 'react';
import {Maybe} from '@ryandur/sand';
import {Held} from './drag-sort';

type Struck = (homeward: boolean) => void;

const crossed = (event: DragEvent<HTMLElement>, homeward: boolean): boolean => {
  const space = event.currentTarget.getBoundingClientRect();
  const quarter = space.width / 4;
  return homeward
    ? event.clientX < space.right - quarter
    : event.clientX > space.left + quarter;
};

const strayed = (clientY: number, anchor: number, strayDistance: number, upward: boolean): boolean =>
  upward
    ? clientY < anchor - strayDistance
    : clientY > anchor + strayDistance;

const strayedTo = (clientY: number, anchor: number, strayDistance: number, at: number): number =>
  strayed(clientY, anchor, strayDistance, false) ? at + 1
    : strayed(clientY, anchor, strayDistance, true) ? at - 1
      : at;

const crossingOver = (held: Maybe<Held>, order: readonly string[]) =>
  (item: string, index: number, struck: Struck) =>
    (event: DragEvent<HTMLElement>): void => {
      held.map(lifted => {
        if (lifted.item === item) {
          return;
        }
        const homeward = index < order.indexOf(lifted.item);
        if (crossed(event, homeward)) {
          struck(homeward);
        }
      });
    };

type Crossing = {
  crossed: (event: DragEvent<HTMLElement>, homeward: boolean) => boolean;
  strayedTo: (clientY: number, anchor: number, strayDistance: number, at: number) => number;
  crossingOver: (held: Maybe<Held>, order: readonly string[]) =>
  (item: string, index: number, struck: Struck) => (event: DragEvent<HTMLElement>) => void;
};

export const crossing: Crossing = {crossed, strayedTo, crossingOver};
