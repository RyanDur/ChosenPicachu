import {Report} from './report';
import {has, maybe} from '@ryandur/sand';
import {ColumnWidths, Grip, soughtTrade, traded, wholePercent} from '@components/Table/shares';
import {Direction, Value} from './sorting';
import {Drift, Moving, drifted, still} from './travel';
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
  readonly values: Readonly<Partial<Record<string, Value>>>;
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
  readonly origin: Drift;
  readonly drift: Drift;
};

export type Drag = Flying & (
  | {readonly axis: 'column'; readonly held: string; readonly landing?: string}
  | {readonly axis: 'row'; readonly held: string; readonly landing?: string}
);

export type ColumnDrag = Extract<Drag, {axis: 'column'}>;
export type RowDrag = Extract<Drag, {axis: 'row'}>;

export type Settling = {
  readonly seat: Drift;
  readonly drift: Drift;
};

type Sizing =
  | {readonly stage: 'keyed'; readonly column: string; readonly from: number}
  | {readonly stage: 'gripped'; readonly column: string; readonly from: number; readonly grip: Grip}
  | {readonly stage: 'dragging'; readonly column: string; readonly from: number; readonly grip: Grip; readonly carried: number};

type PointerSizing = Exclude<Sizing, {stage: 'keyed'}>;

export type Marks<Shove> = {
  readonly settlingFrom?: Settling;
  readonly shoved?: Shove;
};

export type TableState = {
  readonly widths?: ColumnWidths;
  readonly floors: ColumnWidths;
  readonly columnMarks: Readonly<Record<string, Marks<ColumnShove>>>;
  readonly rowMarks: Readonly<Record<string, Marks<RowShove>>>;
  readonly drag?: Drag;
  readonly sizing?: Sizing;
  readonly report?: Report;
};

export const resting: TableState = {columnMarks: {}, rowMarks: {}, floors: {}};

export const columnOf = (order: readonly string[], cell: Element): string =>
  order.find(name => cell.classList.contains(name)) ?? '';

export const measure = (state: TableState, widths: ColumnWidths, floors: ColumnWidths): TableState => ({...state, widths, floors});

export const awaken = (state: TableState, widths: ColumnWidths, floors: ColumnWidths): TableState =>
  has(state.widths) ? {...state, floors} : measure(state, widths, floors);

export const widthsOf = ({widths}: TableState): ColumnWidths | undefined => widths;

const trade = (state: TableState, column: string, neighbour: string, delta: number): TableState =>
  maybe(state.widths)
    .map(previous => measure(state, traded(column, neighbour, delta, state.floors)(previous), state.floors))
    .orElse(state);

const endSizing = ({sizing, ...state}: TableState): TableState =>
  maybe(sizing)
    .mBind(({column, from}) => maybe(state.widths?.[column])
      .map((share): TableState => wholePercent(share) === wholePercent(from) ? state : {...state, report: {about: 'share', name: column, share}}))
    .orElse(state);

const sizingOf = (state: TableState, column: string): TableState =>
  state.sizing?.column === column ? state : endSizing(state);

const startedAt = (state: TableState, column: string): number | undefined =>
  state.sizing?.column === column ? state.sizing.from : state.widths?.[column];

export const tradeBy = (state: TableState, column: string, neighbour: string, delta: number): TableState => {
  const ours = sizingOf(state, column);
  return maybe(startedAt(ours, column))
    .map((from): TableState => trade({...ours, sizing: ours.sizing ?? {stage: 'keyed', column, from}}, column, neighbour, delta))
    .orElse(ours);
};

export const grip = (state: TableState, column: string, at: Grip): TableState => {
  const ours = sizingOf(state, column);
  return maybe(startedAt(ours, column))
    .map((from): TableState => ({...ours, sizing: {stage: 'gripped', column, from, grip: at}}))
    .orElse(ours);
};

const pointerSizing = (sizing?: Sizing): PointerSizing | undefined =>
  sizing?.stage === 'keyed' ? undefined : sizing;

const gripOf = (state: TableState, column: string): PointerSizing | undefined =>
  state.sizing?.column === column ? pointerSizing(state.sizing) : undefined;

export const pointerHolds = (state: TableState, column: string): boolean =>
  maybe(gripOf(state, column)).map(() => true).orElse(false);

export const dragHandle = (state: TableState, column: string, neighbour: string, clientX: number): TableState =>
  maybe(gripOf(state, column))
    .map((sizing): TableState => {
      const sought = soughtTrade(sizing.grip, clientX, sizing.stage === 'dragging' ? sizing.carried : 0);
      return {...trade(state, column, neighbour, sought.delta), sizing: {...sizing, stage: 'dragging', carried: sought.carried}};
    })
    .orElse(state);

export const ungripOf = (state: TableState, column: string): TableState =>
  maybe(gripOf(state, column)).map(() => endSizing(state)).orElse(state);

export const endKeyedSizingOf = (state: TableState, column: string): TableState =>
  state.sizing?.column === column && state.sizing.stage === 'keyed' ? endSizing(state) : state;

export const endSizingOf = (state: TableState, column: string): TableState =>
  state.sizing?.column === column ? endSizing(state) : state;

export const namedShare = (state: TableState, column: string): number | undefined => startedAt(state, column);

const unmarked = (state: TableState): TableState => ({...state, columnMarks: {}, rowMarks: {}});

const marked = <Shove>(marks: Readonly<Record<string, Marks<Shove>>>, key: string, mark: Marks<Shove>): Readonly<Record<string, Marks<Shove>>> =>
  ({...marks, [key]: {...marks[key], ...mark}});

const unsettledMark = <Shove>(marks: Readonly<Record<string, Marks<Shove>>>, key: string): Readonly<Record<string, Marks<Shove>>> =>
  Object.fromEntries(Object.entries(marks).filter(([marked]) => marked !== key));

export const unsettle = (state: TableState, target: Carry, from: Settling): TableState =>
  target.axis === 'column'
    ? {...state, columnMarks: marked(state.columnMarks, target.held, {settlingFrom: from})}
    : {...state, rowMarks: marked(state.rowMarks, target.held, {settlingFrom: from})};

export const settlingFromSeat = (seat: Drift): Settling => ({seat, drift: still});

export const settle = (state: TableState, target: Carry): TableState =>
  target.axis === 'column'
    ? {...state, columnMarks: unsettledMark(state.columnMarks, target.held)}
    : {...state, rowMarks: unsettledMark(state.rowMarks, target.held)};

export const shoveColumns = (state: TableState, names: readonly string[], shove: ColumnShove): TableState =>
  ({...state, columnMarks: names.reduce((marks, name) => marked(marks, name, {shoved: shove}), state.columnMarks)});

export const shoveRows = (state: TableState, keys: readonly string[], shove: RowShove): TableState =>
  ({...state, rowMarks: keys.reduce((marks, key) => marked(marks, key, {shoved: shove}), state.rowMarks)});

export const pixels = (length?: number): string | undefined => has(length) ? `${length}px` : undefined;

const flying = (grab: Grab): Flying =>
  ({survey: grab.survey, box: grab.box, origin: grab.at, drift: still});

export const dragOf = (carry: Carry, grab: Grab): Drag =>
  ({...carry, ...flying(grab)});

export const lift = (state: TableState, carry: Carry, grab: Grab): TableState =>
  ({...unmarked(state), drag: dragOf(carry, grab)});

export const drift = (state: TableState, moving: Moving): TableState =>
  has(state.drag) ? {...state, drag: {...state.drag, drift: drifted(moving, state.drag.origin)}} : state;

export const landColumn = (state: TableState, landing?: string): TableState =>
  state.drag?.axis === 'column' ? {...state, drag: {...state.drag, landing}} : state;

export const landRow = (state: TableState, landing?: string): TableState =>
  state.drag?.axis === 'row' ? {...state, drag: {...state.drag, landing}} : state;

export const orderAtLift = (drag: Drag): readonly string[] =>
  Object.keys(drag.axis === 'column' ? drag.survey.columnWidths : drag.survey.rowHeights);

export const ground = ({drag: _drag, ...state}: TableState): TableState => state;

export const seatOffset = (state: TableState, order: readonly string[], standing: readonly string[]): Drift | undefined => {
  const {drag} = state;
  if (!has(drag)) {
    return undefined;
  }
  return drag.axis === 'column'
    ? {x: drag.box.x - columnLeft(order, drag.survey)(drag.held), y: 0}
    : {x: 0, y: drag.box.y - rowTop(standing, drag.survey)(drag.held)};
};

export const settlingAt = (state: TableState, order: readonly string[], standing: readonly string[]): Settling =>
  ({seat: seatOffset(state, order, standing) ?? still, drift: state.drag?.drift ?? still});

export const shoveDistance = (shove?: ColumnShove | RowShove): string | undefined =>
  has(shove) ? `${shove.by}px` : undefined;

export const shovedClass = (shove?: ColumnShove | RowShove): string | false =>
  has(shove) && `shoved-${shove.toward}`;
