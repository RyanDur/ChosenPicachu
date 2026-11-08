import {DragEvent} from 'react';
import {Maybe, has} from '@ryandur/sand';
import {crossing} from './crossing';

type Struck = (homeward: boolean) => void;

const crossingOver = (held: Maybe<string>, order: readonly string[]) =>
  (item: string, index: number, struck: Struck) =>
    (event: DragEvent<HTMLElement>): void => {
      const lane = event.currentTarget.closest('li');
      if (has(lane) && lane.getAnimations().length > 0) {
        return;
      }
      held.map(lifted => {
        if (lifted === item) {
          return;
        }
        const homeward = index < order.indexOf(lifted);
        if (crossing.crossed(event, homeward)) {
          struck(homeward);
        }
      });
    };

type Session = {
  crossingOver: (held: Maybe<string>, order: readonly string[]) =>
  (item: string, index: number, struck: Struck) => (event: DragEvent<HTMLElement>) => void;
};

export const session: Session = {crossingOver};
