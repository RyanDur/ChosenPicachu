import {has, not} from '@ryandur/sand';
import {ColumnWidths, neighborOf} from '@components/Table/shares';
import {Column, ColumnDrag, Drag, RowDrag, Seat, Seated, TableState, carriedOffset, orderOf, seatingOf, standingOf, widthsOf} from './table-state';
import {anchored} from './survey';
import {ranked} from './sorting';
import {Drift} from './travel';

export const selectOrder = orderOf;
export const selectWidths: <C>(state: TableState<C>) => ColumnWidths | undefined = widthsOf;
export const selectColumns = <C>({columns}: TableState<C>): readonly Column<C>[] => columns;
export const selectSeats = <C>({seats}: TableState<C>): readonly Seat[] => seats;

// the seats as they stand on screen: every seated key, ranked by the rule while one holds, as the hand left them otherwise
export const selectStanding = <C>(state: TableState<C>, seated: readonly Seated[]): readonly string[] => {
  const standing = seatingOf(standingOf(state), seated.map(({key}) => key));
  const {rule} = state;
  if (!has(rule)) {
    return standing;
  }
  const valueOf = (key: string) => seated.find(seat => seat.key === key)?.values[rule.name];
  return ranked(standing, valueOf, rule.direction);
};

export const selectArrival = <C>(_state: TableState<C>, seated: readonly Seated[]): readonly string[] => seated.map(({key}) => key);

export const columnNamed = <C>(name: string) => ({columns}: TableState<C>): Column<C> => {
  const found = columns.find(column => column.name === name);
  if (found === undefined) {
    throw new Error(`no column named ${name}`);
  }
  return found;
};

export const rowAt = (key: string) => <C>({seats}: TableState<C>): Seat =>
  seats.find(seat => seat.key === key) ?? {key, carried: false};

export const positionOfColumn = (name: string) => <C>(state: TableState<C>): number => orderOf(state).indexOf(name);

export const positionOfRow = (key: string) => <C>(state: TableState<C>, seated: readonly Seated[]): number =>
  selectStanding(state, seated).indexOf(key);

export const selectColumnCount = <C>({columns}: TableState<C>): number => columns.length;
export const selectRowCount = <C>(_state: TableState<C>, seated: readonly Seated[]): number => seated.length;

export const columnTravels = (name: string) => <C>(state: TableState<C>): boolean =>
  not(anchored(positionOfColumn(name)(state), selectColumnCount(state)));

export const neighbourOfColumn = (name: string) => <C>(state: TableState<C>): string => neighborOf(orderOf(state), name);

export const selectDrag = <C>({drag}: TableState<C>): Drag | undefined => drag;

export const columnDrag = (name: string) => <C>({drag}: TableState<C>): ColumnDrag | undefined =>
  drag?.axis === 'column' && drag.held === name ? drag : undefined;

export const rowDrag = (key: string) => <C>({drag}: TableState<C>): RowDrag | undefined =>
  drag?.axis === 'row' && drag.held === key ? drag : undefined;

export const offsetOfColumn = (name: string) => <C>(state: TableState<C>): Drift | undefined =>
  has(columnDrag(name)(state)) ? carriedOffset(state) : undefined;

export const offsetOfRow = (key: string) => <C>(state: TableState<C>): Drift | undefined =>
  has(rowDrag(key)(state)) ? carriedOffset(state) : undefined;
