import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Direction, Value, ranked} from './sorting';
import {Sort} from './table-state';

export type Arrangement = {
  readonly columns: readonly string[];
  readonly rows: readonly string[];
  readonly sort?: Sort;
};

export type ArrangementAction =
  | {readonly type: 'columnMoved'; readonly column: string; readonly to: number}
  | {readonly type: 'rowMoved'; readonly row: string; readonly to: number; readonly standing: readonly string[]}
  | {readonly type: 'sorted'; readonly column: string; readonly direction?: Direction}
  | {readonly type: 'arrived'; readonly keys: readonly string[]};

export const columnMoved = (column: string, to: number): ArrangementAction => ({type: 'columnMoved', column, to});
export const rowMoved = (row: string, to: number, standing: readonly string[]): ArrangementAction => ({type: 'rowMoved', row, to, standing});
export const sorted = (column: string, direction?: Direction): ArrangementAction => ({type: 'sorted', column, direction});
export const arrived = (keys: readonly string[]): ArrangementAction => ({type: 'arrived', keys});

export const arrangementOf = (columns: readonly string[], rows: readonly string[] = []): Arrangement => ({columns, rows});

const seatingOf = (standing: readonly string[], arrival: readonly string[]): readonly string[] =>
  [...standing.filter(key => arrival.includes(key)), ...arrival.filter(key => !standing.includes(key))];

export const movedTo = (list: readonly string[], item: string, to: number): readonly string[] =>
  list.includes(item) ? array.moveToIndex(to, item, list) : list;

export const standingOf = (
  {rows, sort}: Arrangement,
  valueOf: (row: string, column: string) => Value | undefined
): readonly string[] =>
  has(sort) ? ranked(rows, row => valueOf(row, sort.column), sort.direction) : rows;

const unsorted = ({sort: _sort, ...arrangement}: Arrangement): Arrangement => arrangement;

export const sortEnded = (arrangement: Arrangement, standing: readonly string[]): Arrangement =>
  ({...unsorted(arrangement), rows: seatingOf(standing, arrangement.rows)});

const arrangementActions: Record<ArrangementAction['type'], true> = {
  columnMoved: true,
  rowMoved: true,
  sorted: true,
  arrived: true
};

const isArrangementAction = (action: {readonly type: string}): action is ArrangementAction => action.type in arrangementActions;

const answering = (arrangement: Arrangement, action: ArrangementAction): Arrangement => {
  switch (action.type) {
    case 'columnMoved': return {...arrangement, columns: movedTo(arrangement.columns, action.column, action.to)};
    case 'rowMoved': return {...sortEnded(arrangement, action.standing), rows: movedTo(action.standing, action.row, action.to)};
    case 'sorted': return has(action.direction) ? {...arrangement, sort: {column: action.column, direction: action.direction}} : unsorted(arrangement);
    case 'arrived': return {...arrangement, rows: seatingOf(arrangement.rows, action.keys)};
    default: return arrangement;
  }
};

export const arrangementReducer = (arrangement: Arrangement, action: {readonly type: string}): Arrangement =>
  isArrangementAction(action) ? answering(arrangement, action) : arrangement;
