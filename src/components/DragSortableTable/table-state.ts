import {Maybe, has, maybe} from '@ryandur/sand';
import {ColumnWidths, neighborOf, traded} from '@components/Table/shares';
import {Direction, Value} from './sorting';
import {Drift, Moving, carried, still} from './travel';
import {Flight, Grab} from './lift';
import {Survey, columnLeft, rowTop} from './survey';
import {array} from '@components/arrays';

export type ColumnShove = {
  readonly toward: 'start' | 'end';
  readonly by: number;
};

export type RowShove = {
  readonly toward: 'up' | 'down';
  readonly by: number;
};

export type Labelled = {
  readonly label: string;
};

export type Column<C> = {
  readonly name: string;
  readonly width?: number;
  readonly sorted?: Direction;
  readonly carried: boolean;
  readonly settlingFrom?: Drift;
  readonly shoved?: ColumnShove;
  readonly data: C;
};

export type Seat = {
  readonly key: string;
  readonly carried: boolean;
  readonly settlingFrom?: Drift;
  readonly shoved?: RowShove;
};

export type Rule = {
  readonly name: string;
  readonly direction: Direction;
};

// what the page hands the table about each row: its key, and its value under each column
export type Seated = {
  readonly key: string;
  readonly values: Readonly<Record<string, Value | undefined>>;
};

export type Carry =
  | {readonly axis: 'column'; readonly held: string}
  | {readonly axis: 'row'; readonly held: string};

type Flying = {
  readonly survey: Survey;
  readonly box: Flight;
  readonly origin?: Drift;
  readonly drift: Drift;
};

export type Drag = Flying & (
  | {readonly axis: 'column'; readonly held: string; readonly landing?: string}
  | {readonly axis: 'row'; readonly held: string; readonly landing?: string}
);

export type ColumnDrag = Extract<Drag, {axis: 'column'}>;
export type RowDrag = Extract<Drag, {axis: 'row'}>;

export type TableState<C> = {
  readonly columns: readonly Column<C>[];
  readonly seats: readonly Seat[];
  readonly rule?: Rule;
  readonly drag?: Drag;
};

export const tableOf = <C>(columns: readonly {name: string; data: C}[], keys: readonly string[] = []): TableState<C> => ({
  columns: columns.map(({name, data}) => ({name, carried: false, data})),
  seats: keys.map(key => ({key, carried: false}))
});

export const orderOf = <C>({columns}: TableState<C>): readonly string[] => columns.map(({name}) => name);
export const standingOf = <C>({seats}: TableState<C>): readonly string[] => seats.map(({key}) => key);

// the seats as they stand, keeping every key still seated, seating new keys at the end in arrival order
export const seatingOf = (standing: readonly string[], arrival: readonly string[]): readonly string[] =>
  [...standing.filter(key => arrival.includes(key)), ...arrival.filter(key => !standing.includes(key))];

export const columnOf = <C>(state: TableState<C>, cell: Element): string =>
  orderOf(state).find(name => cell.classList.contains(name)) ?? '';

export const carriedColumn = <C>({columns}: TableState<C>): Maybe<string> =>
  maybe(columns.find(({carried}) => carried)).map(({name}) => name);

export const carriedRow = <C>({seats}: TableState<C>): Maybe<string> =>
  maybe(seats.find(({carried}) => carried)).map(({key}) => key);

const seatOf = (seats: readonly Seat[], key: string): number => seats.findIndex(seat => seat.key === key);

export const reorder = <C>(state: TableState<C>, from: number, to: number): TableState<C> =>
  ({...state, columns: array.moveToIndex(to, state.columns[from], state.columns)});

export const reseat = <C>(state: TableState<C>, held: string, struck: string): TableState<C> =>
  ({...state, seats: array.moveToIndex(seatOf(state.seats, struck), state.seats[seatOf(state.seats, held)], state.seats)});

export const nudge = <C>(state: TableState<C>, held: string, to: number): TableState<C> =>
  ({...state, seats: array.moveToIndex(to, state.seats[seatOf(state.seats, held)], state.seats)});

const unruled = <C>({rule: _rule, ...state}: TableState<C>): TableState<C> =>
  ({...state, columns: state.columns.map(({sorted: _sorted, ...column}) => column)});

// the seats take the order given and the rule lets go; the hand decides from here
export const bake = <C>(state: TableState<C>, standing: readonly string[]): TableState<C> =>
  ({...unruled(state), seats: seated(state.seats, standing)});

export const rule = <C>(state: TableState<C>, name: string, direction?: Direction): TableState<C> => {
  const columns = unruled(state).columns.map(column =>
    column.name === name && has(direction) ? {...column, sorted: direction} : column);
  return has(direction) ? {...state, columns, rule: {name, direction}} : {...unruled(state), columns};
};

const seated = (seats: readonly Seat[], standing: readonly string[]): readonly Seat[] =>
  standing.map(key => seats[seatOf(seats, key)] ?? {key, carried: false});

// the keys the page seats: known seats keep their marks and order, new keys sit at the end, gone keys leave
export const seat = <C>(state: TableState<C>, arrival: readonly string[]): TableState<C> =>
  ({...state, seats: seated(state.seats, seatingOf(standingOf(state), arrival))});

export const measure = <C>(state: TableState<C>, widths: ColumnWidths): TableState<C> =>
  ({...state, columns: state.columns.map(column => ({...column, width: widths[column.name]}))});

export const awaken = <C>(state: TableState<C>, widths: ColumnWidths): TableState<C> =>
  has(widthsOf(state)) ? state : measure(state, widths);

export const widthsOf = <C>({columns}: TableState<C>): ColumnWidths | undefined =>
  columns.every(({width}) => has(width))
    ? Object.fromEntries(columns.map(({name, width}) => [name, width ?? 0]))
    : undefined;

export const trade = <C>(state: TableState<C>, column: string, delta: number): TableState<C> =>
  maybe(widthsOf(state))
    .map(previous => measure(state, traded(column, neighborOf(orderOf(state), column), delta)(previous)))
    .orElse(state);

const unmarked = <C>(state: TableState<C>): TableState<C> => ({
  ...state,
  columns: state.columns.map(({settlingFrom: _from, shoved: _shoved, ...column}) => column),
  seats: state.seats.map(({settlingFrom: _from, shoved: _shoved, ...seat}) => seat)
});

export const carry = <C>(state: TableState<C>, carried: Carry): TableState<C> => {
  const {columns, seats} = unmarked(state);
  return {
    ...state,
    columns: columns.map(column => ({...column, carried: carried.axis === 'column' && carried.held === column.name})),
    seats: seats.map(seat => ({...seat, carried: carried.axis === 'row' && carried.held === seat.key}))
  };
};

export const release = <C>(state: TableState<C>): TableState<C> => ({
  ...state,
  columns: state.columns.map(column => column.carried ? {...column, carried: false} : column),
  seats: state.seats.map(seat => seat.carried ? {...seat, carried: false} : seat)
});

export const unsettle = <C>(state: TableState<C>, target: Carry, from: Drift): TableState<C> => ({
  ...state,
  columns: state.columns.map(column => target.axis === 'column' && target.held === column.name ? {...column, settlingFrom: from} : column),
  seats: state.seats.map(seat => target.axis === 'row' && target.held === seat.key ? {...seat, settlingFrom: from} : seat)
});

export const settle = <C>(state: TableState<C>, target: Carry): TableState<C> => ({
  ...state,
  columns: state.columns.map(({settlingFrom, shoved, ...column}) =>
    target.axis === 'column' && target.held === column.name ? column : {...column, settlingFrom, shoved}),
  seats: state.seats.map(({settlingFrom, shoved, ...seat}) =>
    target.axis === 'row' && target.held === seat.key ? seat : {...seat, settlingFrom, shoved})
});

export const shoveColumns = <C>(state: TableState<C>, names: readonly string[], shove: ColumnShove): TableState<C> =>
  ({...state, columns: state.columns.map(column => names.includes(column.name) ? {...column, shoved: shove} : column)});

export const shoveRows = <C>(state: TableState<C>, keys: readonly string[], shove: RowShove): TableState<C> =>
  ({...state, seats: state.seats.map(seat => keys.includes(seat.key) ? {...seat, shoved: shove} : seat)});

export const translation = (offset?: Drift): string | undefined =>
  has(offset) ? `${offset.x}px ${offset.y}px` : undefined;

const flying = (grab: Grab): Flying =>
  ({survey: grab.survey, box: grab.box, drift: still});

export const lifted = (carry: Carry, grab: Grab): Drag =>
  ({...carry, ...flying(grab)});

export const lift = <C>(state: TableState<C>, carry: Carry, grab: Grab): TableState<C> =>
  ({...state, drag: lifted(carry, grab)});

export const drift = <C>(state: TableState<C>, moving: Moving): TableState<C> =>
  has(state.drag) ? {...state, drag: {...state.drag, ...carried(state.drag.origin, moving)}} : state;

export const landColumn = <C>(state: TableState<C>, landing?: string): TableState<C> =>
  state.drag?.axis === 'column' ? {...state, drag: {...state.drag, landing}} : state;

export const landRow = <C>(state: TableState<C>, landing?: string): TableState<C> =>
  state.drag?.axis === 'row' ? {...state, drag: {...state.drag, landing}} : state;

export const ground = <C>({drag: _drag, ...state}: TableState<C>): TableState<C> => state;

export const carriedOffset = <C>(state: TableState<C>): Drift | undefined => {
  const {drag} = state;
  if (!has(drag)) {
    return undefined;
  }
  const {box, drift: moved} = drag;
  return drag.axis === 'column'
    ? {x: box.x + moved.x - columnLeft(orderOf(state), drag.survey)(drag.held), y: moved.y}
    : {x: moved.x, y: box.y + moved.y - rowTop(standingOf(state), drag.survey)(drag.held)};
};

export const shoveDistance = (shove?: ColumnShove | RowShove): string | undefined =>
  has(shove) ? `${shove.by}px` : undefined;

export const shovedClass = (shove?: ColumnShove | RowShove): string | false =>
  has(shove) && `shoved-${shove.toward}`;
