import {has} from '@ryandur/sand';
import {ColumnShove, RowShove, Settling, tableState} from './table-state';

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
  tableState.shovedClass(shove)
];

export const looks = {
  rowHeaderCell,
  headerCell,
  headerNeeds,
  cellNeeds,
  motionStates
};
