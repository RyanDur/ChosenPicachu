import {CSSProperties} from 'react';
import {has, maybe, Maybe} from '@ryandur/sand';
import {ColumnShove, RowShove, Settling} from './table-state';
import {Drift} from './travel';

const pixels = (length?: number): `${number}px` | undefined => has(length) ? `${length}px` : undefined;

const offset = (drift: Maybe<Drift>, axis: keyof Drift): `${number}px` | undefined =>
  drift.map(at => pixels(at[axis])).orElse(undefined);

const shoveDistance = (shove?: ColumnShove | RowShove): `${number}px` | undefined =>
  has(shove) ? `${shove.by}px` : undefined;

const shoved = (shove?: ColumnShove | RowShove): string | false =>
  has(shove) && `shoved-${shove.toward}`;

type Placement = {seat?: Drift; drift?: Drift; settlingFrom?: Settling; shove?: ColumnShove | RowShove};

const placement = ({seat, drift, settlingFrom, shove}: Placement): CSSProperties => {
  const settling = maybe(settlingFrom);
  return {
    '--seat-x': offset(maybe(seat), 'x'),
    '--seat-y': offset(maybe(seat), 'y'),
    '--drift-x': offset(maybe(drift), 'x'),
    '--drift-y': offset(maybe(drift), 'y'),
    '--settle-x': offset(settling.map(settled => settled.seat), 'x'),
    '--settle-y': offset(settling.map(settled => settled.seat), 'y'),
    '--settle-drift-x': offset(settling.map(settled => settled.drift), 'x'),
    '--settle-drift-y': offset(settling.map(settled => settled.drift), 'y'),
    '--shoved-by': shoveDistance(shove)
  };
};

const rowHeaderCell = ['cell', 'row-header'] as const;

const headerCell = ['cell', 'header-cell'] as const;

const headerNeeds = (travels: boolean, width?: number): readonly (string | false)[] => [
  'muted-rule-after',
  'muted-bar-below',
  'focus-ringed',
  travels && 'grabbable',
  has(width) && 'shared'
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
