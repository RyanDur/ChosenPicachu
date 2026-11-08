import {has} from '@ryandur/sand';
import {ColumnShove, RowShove, Settling} from './table-state';

const pixels = (length?: number): `${number}px` | undefined => has(length) ? `${length}px` : undefined;

const shoveDistance = (shove?: ColumnShove | RowShove): `${number}px` | undefined =>
  has(shove) ? `${shove.by}px` : undefined;

const shoved = (shove?: ColumnShove | RowShove): string | false =>
  has(shove) && `shoved-${shove.toward}`;

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
  pixels,
  shoveDistance,
  shoved,
  rowHeaderCell,
  headerCell,
  headerNeeds,
  cellNeeds,
  motionStates
};
