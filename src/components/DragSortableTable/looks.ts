import {has} from '@ryandur/sand';
import {ColumnShove, RowShove, Settling, shovedClass} from './table-state';

export const rowHeaderCell = ['cell', 'row-header'] as const;

export const headerCell = ['cell', 'header-cell'] as const;

export const headerStates = (travels: boolean, width?: number): readonly (string | false)[] => [
  travels && 'grabbable',
  has(width) && 'shared'
];

export const cellLooks = ['muted-rule-after', 'muted-rule-below'] as const;

export const headerLooks = ['muted-rule-after', 'muted-bar-below', 'focus-ringed'] as const;

export const motionLooks = (carried: boolean, settlingFrom?: Settling, shove?: ColumnShove | RowShove): readonly (string | false)[] => [
  (carried || has(settlingFrom) || has(shove)) && 'paper-in-motion',
  carried && 'carried',
  has(settlingFrom) && 'settling',
  shovedClass(shove)
];
