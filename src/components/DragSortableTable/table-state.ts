import {has, maybe} from '@ryandur/sand';
import {ColumnWidths, traded} from '@components/Table/shares';
import {Direction, Value} from './sorting';
import {Drift, Moving, carried, still} from './travel';
import {Flight, Grab} from './lift';
import {Survey, columnLeft, rowTop} from './survey';

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

export type TableColumn<C> = {
  readonly name: string;
  readonly data: C;
  readonly sorted?: Direction;
};

export type Seated = {
  readonly key: string;
  readonly values: Readonly<Record<string, Value | undefined>>;
};

export type Sort = {
  readonly column: string;
  readonly direction: Direction;
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

export type Marks<Shove> = {
  readonly settlingFrom?: Drift;
  readonly shoved?: Shove;
};

export type TableState = {
  readonly widths?: ColumnWidths;
  readonly columnMarks: Readonly<Record<string, Marks<ColumnShove>>>;
  readonly rowMarks: Readonly<Record<string, Marks<RowShove>>>;
  readonly drag?: Drag;
};

export const resting: TableState = {columnMarks: {}, rowMarks: {}};

export const columnOf = (order: readonly string[], cell: Element): string =>
  order.find(name => cell.classList.contains(name)) ?? '';

export const measure = (state: TableState, widths: ColumnWidths): TableState => ({...state, widths});

export const awaken = (state: TableState, widths: ColumnWidths): TableState =>
  has(state.widths) ? state : measure(state, widths);

export const widthsOf = ({widths}: TableState): ColumnWidths | undefined => widths;

export const trade = (state: TableState, column: string, neighbour: string, delta: number): TableState =>
  maybe(state.widths)
    .map(previous => measure(state, traded(column, neighbour, delta)(previous)))
    .orElse(state);

const unmarked = (state: TableState): TableState => ({...state, columnMarks: {}, rowMarks: {}});

const marked = <Shove>(marks: Readonly<Record<string, Marks<Shove>>>, key: string, mark: Marks<Shove>): Readonly<Record<string, Marks<Shove>>> =>
  ({...marks, [key]: {...marks[key], ...mark}});

const unsettledMark = <Shove>(marks: Readonly<Record<string, Marks<Shove>>>, key: string): Readonly<Record<string, Marks<Shove>>> =>
  Object.fromEntries(Object.entries(marks).filter(([marked]) => marked !== key));

export const unsettle = (state: TableState, target: Carry, from: Drift): TableState =>
  target.axis === 'column'
    ? {...state, columnMarks: marked(state.columnMarks, target.held, {settlingFrom: from})}
    : {...state, rowMarks: marked(state.rowMarks, target.held, {settlingFrom: from})};

export const settle = (state: TableState, target: Carry): TableState =>
  target.axis === 'column'
    ? {...state, columnMarks: unsettledMark(state.columnMarks, target.held)}
    : {...state, rowMarks: unsettledMark(state.rowMarks, target.held)};

export const shoveColumns = (state: TableState, names: readonly string[], shove: ColumnShove): TableState =>
  ({...state, columnMarks: names.reduce((marks, name) => marked(marks, name, {shoved: shove}), state.columnMarks)});

export const shoveRows = (state: TableState, keys: readonly string[], shove: RowShove): TableState =>
  ({...state, rowMarks: keys.reduce((marks, key) => marked(marks, key, {shoved: shove}), state.rowMarks)});

export const translation = (offset?: Drift): string | undefined =>
  has(offset) ? `${offset.x}px ${offset.y}px` : undefined;

const flying = (grab: Grab): Flying =>
  ({survey: grab.survey, box: grab.box, drift: still});

export const lifted = (carry: Carry, grab: Grab): Drag =>
  ({...carry, ...flying(grab)});

export const lift = (state: TableState, carry: Carry, grab: Grab): TableState =>
  ({...unmarked(state), drag: lifted(carry, grab)});

export const drift = (state: TableState, moving: Moving): TableState =>
  has(state.drag) ? {...state, drag: {...state.drag, ...carried(state.drag.origin, moving)}} : state;

export const landColumn = (state: TableState, landing?: string): TableState =>
  state.drag?.axis === 'column' ? {...state, drag: {...state.drag, landing}} : state;

export const landRow = (state: TableState, landing?: string): TableState =>
  state.drag?.axis === 'row' ? {...state, drag: {...state.drag, landing}} : state;

export const ground = ({drag: _drag, ...state}: TableState): TableState => state;

export const carriedOffset = (state: TableState, order: readonly string[], standing: readonly string[]): Drift | undefined => {
  const {drag} = state;
  if (!has(drag)) {
    return undefined;
  }
  const {box, drift: moved} = drag;
  return drag.axis === 'column'
    ? {x: box.x + moved.x - columnLeft(order, drag.survey)(drag.held), y: moved.y}
    : {x: moved.x, y: box.y + moved.y - rowTop(standing, drag.survey)(drag.held)};
};

export const shoveDistance = (shove?: ColumnShove | RowShove): string | undefined =>
  has(shove) ? `${shove.by}px` : undefined;

export const shovedClass = (shove?: ColumnShove | RowShove): string | false =>
  has(shove) && `shoved-${shove.toward}`;
