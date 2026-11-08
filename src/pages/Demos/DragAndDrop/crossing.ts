import {DragEvent} from 'react';
import {Maybe} from '@ryandur/sand';
import {Held} from './drag-sort';

type Struck = (homeward: boolean) => void;

const passedAQuarter = (event: DragEvent<HTMLElement>, homeward: boolean): boolean => {
  const space = event.currentTarget.getBoundingClientRect();
  const quarter = space.width / 4;
  return homeward
    ? event.clientX < space.right - quarter
    : event.clientX > space.left + quarter;
};

const strayed = (pageY: number, anchor: number, strayDistance: number, upward: boolean): boolean =>
  upward
    ? pageY < anchor - strayDistance
    : pageY > anchor + strayDistance;

const strayedTo = (pageY: number, anchor: number, strayDistance: number, at: number): number =>
  strayed(pageY, anchor, strayDistance, false) ? at + 1
    : strayed(pageY, anchor, strayDistance, true) ? at - 1
      : at;

const over = (held: Maybe<Held>, order: readonly string[]) =>
  (item: string, index: number, struck: Struck) =>
    (event: DragEvent<HTMLElement>): void => {
      held.map(lifted => {
        if (lifted.item === item) {
          return;
        }
        const homeward = index < order.indexOf(lifted.item);
        if (passedAQuarter(event, homeward)) {
          struck(homeward);
        }
      });
    };

type Crossing = {
  strayedTo: (pageY: number, anchor: number, strayDistance: number, at: number) => number;
  over: (held: Maybe<Held>, order: readonly string[]) =>
  (item: string, index: number, struck: Struck) => (event: DragEvent<HTMLElement>) => void;
};

export const crossing: Crossing = {strayedTo, over};
