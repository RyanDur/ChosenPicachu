import {has} from '@ryandur/sand';
import {ColumnShove, RowShove, Settling, shovedClass} from './table-state';

export const rowHeaderCell = ['cell', 'row-header'] as const;

export const headerCell = ['cell', 'header-cell'] as const;

export const headerNeeds = (travels: boolean, width?: number): readonly (string | false)[] => [
  'muted-rule-after',
  'muted-bar-below',
  'focus-ringed',
  travels && 'grabbable',
  has(width) && 'shared'
];

export const cellNeeds = ['muted-rule-after', 'muted-rule-below'] as const;

export const motionStates = (carried: boolean, settlingFrom?: Settling, shove?: ColumnShove | RowShove): readonly (string | false)[] => [
  (carried || has(settlingFrom) || has(shove)) && 'paper-in-motion',
  carried && 'carried',
  has(settlingFrom) && 'settling',
  shovedClass(shove)
];
