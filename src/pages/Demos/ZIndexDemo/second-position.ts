import {inOrder, ParentPosition, Position} from '../ReaderSettings';

const all = inOrder.positions;

export type {ParentPosition, Position};

export type MeasuredFrom = 'nowhere' | 'own-place' | 'parent' | 'little-page' | 'view' | 'scroll-edge';

const measuredFrom = (position: Position, parentPosition: ParentPosition): MeasuredFrom => {
  switch (position) {
    case 'static':
      return 'nowhere';
    case 'relative':
      return 'own-place';
    case 'absolute':
      return parentPosition === 'positioned' ? 'parent' : 'little-page';
    case 'fixed':
      return 'view';
    case 'sticky':
      return 'scroll-edge';
  }
};

type SecondPosition = {
  all: readonly Position[];
  measuredFrom: (position: Position, parentPosition: ParentPosition) => MeasuredFrom;
};

export const secondPosition: SecondPosition = {all, measuredFrom};
