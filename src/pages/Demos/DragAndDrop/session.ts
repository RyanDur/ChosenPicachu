import {DragEvent} from 'react';
import {Maybe, has, nothing, some} from '@ryandur/sand';
import {array} from '@components/arrays';
import {glide} from '@components/glide';
import {crossing} from './crossing';

export type Moved = {readonly item: string; readonly position: number; readonly of: number};

type Struck = (held: string, homeward: boolean) => void;

const crossingOver = (aloft: Maybe<string>, order: readonly string[]) =>
  (item: string, index: number, struck: Struck) =>
    (event: DragEvent<HTMLElement>): void => {
      const lane = event.currentTarget.closest('li');
      if (has(lane) && lane.getAnimations().length > 0) {
        return;
      }
      aloft.map(held => {
        if (held === item) {
          return;
        }
        const homeward = index < order.indexOf(held);
        if (crossing.crossed(event, homeward)) {
          struck(held, homeward);
        }
      });
    };

const landedOrder = (aloft: Maybe<string>, landing: Maybe<number>, order: readonly string[]): Maybe<string[]> =>
  aloft.and(landing).map(([held, at]) => array.moveToIndex(at, held, order));

const landedMove = (aloft: Maybe<string>, landing: Maybe<number>, order: readonly string[]): Maybe<Moved> =>
  aloft.and(landing).mBind(([item, position]) =>
    position === order.indexOf(item) ? nothing() : some({item, position, of: order.length}));

const glided = (apply: (settled: string[]) => void) => (settled: string[]): void => {
  setTimeout(() => glide(true)(() => apply(settled)));
};

type Session = {
  crossingOver: (aloft: Maybe<string>, order: readonly string[]) =>
  (item: string, index: number, struck: Struck) => (event: DragEvent<HTMLElement>) => void;
  landedOrder: (aloft: Maybe<string>, landing: Maybe<number>, order: readonly string[]) => Maybe<string[]>;
  landedMove: (aloft: Maybe<string>, landing: Maybe<number>, order: readonly string[]) => Maybe<Moved>;
  glided: (apply: (settled: string[]) => void) => (settled: string[]) => void;
};

export const session: Session = {crossingOver, landedOrder, landedMove, glided};
