import {CSSProperties} from 'react';
import {has, maybe, Maybe, not} from '@ryandur/sand';
import {ColumnShove, RowShove, Settling} from './table-state';
import {Drift} from './travel';

const pixels = (length?: number): `${number}px` | undefined => has(length) ? `${length}px` : undefined;

const pixelsAlong = (place: Maybe<Drift>, axis: keyof Drift): `${number}px` | undefined =>
  place.map(at => pixels(at[axis])).orElse(undefined);

const shoveDistance = (shove?: ColumnShove | RowShove): `${number}px` | undefined =>
  has(shove) ? `${shove.by}px` : undefined;

const shoved = (shove?: ColumnShove | RowShove): string | false =>
  has(shove) && `shoved-${shove.toward}`;

type Placement = {seat?: Drift; drift?: Drift; settlingFrom?: Settling; shove?: ColumnShove | RowShove};

const placement = ({seat, drift, settlingFrom, shove}: Placement): CSSProperties => {
  const settling = maybe(settlingFrom);
  return {
    '--seat-x': pixelsAlong(maybe(seat), 'x'),
    '--seat-y': pixelsAlong(maybe(seat), 'y'),
    '--drift-x': pixelsAlong(maybe(drift), 'x'),
    '--drift-y': pixelsAlong(maybe(drift), 'y'),
    '--settle-x': pixelsAlong(settling.map(settled => settled.seat), 'x'),
    '--settle-y': pixelsAlong(settling.map(settled => settled.seat), 'y'),
    '--settle-drift-x': pixelsAlong(settling.map(settled => settled.drift), 'x'),
    '--settle-drift-y': pixelsAlong(settling.map(settled => settled.drift), 'y'),
    '--shoved-by': shoveDistance(shove)
  };
};

const rowHeaderCell = ['cell', 'row-header'] as const;

const headerCell = ['cell', 'header-cell'] as const;

const headerNeeds = (travels: boolean, width: Maybe<number>): readonly (string | false)[] => [
  'muted-rule-after',
  'muted-bar-below',
  'focus-ringed',
  travels && 'grabbable',
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
