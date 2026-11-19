import {CSSProperties} from 'react';
import {has, maybe, Maybe, not} from '@ryandur/sand';
import {ColumnShove, RowShove, Settling} from './table-state';
import {Drift} from './travel';

const pixels = (length: number): `${number}px` => `${length}px`;

const pixelsAlong = (place: Maybe<Drift>, axis: keyof Drift): Maybe<`${number}px`> =>
  place.map(at => pixels(at[axis]));

const shoveDistance = (shove?: ColumnShove | RowShove): Maybe<`${number}px`> =>
  maybe(shove).map(({by}) => pixels(by));

const shoved = (shove?: ColumnShove | RowShove): string | false =>
  has(shove) && `shoved-${shove.toward}`;

type Placement = {seat: Maybe<Drift>; drift: Maybe<Drift>; settlingFrom?: Settling; shove?: ColumnShove | RowShove};

const placement = ({seat, drift, settlingFrom, shove}: Placement): CSSProperties => {
  const settling = maybe(settlingFrom);
  return {
    '--seat-x': pixelsAlong(seat, 'x').orElse(undefined),
    '--seat-y': pixelsAlong(seat, 'y').orElse(undefined),
    '--drift-x': pixelsAlong(drift, 'x').orElse(undefined),
    '--drift-y': pixelsAlong(drift, 'y').orElse(undefined),
    '--settle-x': pixelsAlong(settling.map(settled => settled.seat), 'x').orElse(undefined),
    '--settle-y': pixelsAlong(settling.map(settled => settled.seat), 'y').orElse(undefined),
    '--settle-drift-x': pixelsAlong(settling.map(settled => settled.drift), 'x').orElse(undefined),
    '--settle-drift-y': pixelsAlong(settling.map(settled => settled.drift), 'y').orElse(undefined),
    '--shoved-by': shoveDistance(shove).orElse(undefined)
  };
};

const rowHeaderCell = ['cell', 'row-header'] as const;

const headerCell = ['cell', 'header-cell'] as const;

const headerNeeds = (movable: boolean, width: Maybe<number>): readonly (string | false)[] => [
  'muted-rule-after',
  'muted-bar-below',
  'focus-ringed',
  movable && 'grabbable',
  not(width.isNothing) && 'shared'
];

const cellNeeds = ['muted-rule-after', 'muted-rule-below'] as const;

const motionStates = (
  carried: boolean,
  settlingFrom?: Settling,
  shove?: ColumnShove | RowShove
): readonly (string | false)[] => [
  (carried || has(settlingFrom) || has(shove)) && 'paper-in-motion',
  carried && 'carried',
  has(settlingFrom) && 'settling',
  shoved(shove)
];

export const looks = {
  placement,
  rowHeaderCell,
  headerCell,
  headerNeeds,
  cellNeeds,
  motionStates
};
