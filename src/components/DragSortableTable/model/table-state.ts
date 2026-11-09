import {Report} from './report';
import {has, maybe} from '@ryandur/sand';
import {ColumnWidths, Grip, shares} from './shares';
import {Direction, Value} from './sorting';
import {Drift, Moving, travel} from './travel';
import {Flight, Grab} from './lift';
import {Survey, survey} from './survey';

export type ColumnShove = {
  readonly toward: 'start' | 'end';
  readonly by: number;
};

export type RowShove = {
  readonly toward: 'up' | 'down';
  readonly by: number;
};

export type Labeled = {
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

const resting: TableState = {columnMarks: {}, rowMarks: {}, floors: {}};

const columnOf = (order: readonly string[], cell: Element): string =>
  order.find(name => cell.classList.contains(name)) ?? '';

const measure = (state: TableState, widths: ColumnWidths, floors: ColumnWidths): TableState =>
  ({...state, widths, floors});

const awaken = (state: TableState, widths: ColumnWidths, floors: ColumnWidths): TableState =>
  has(state.widths) ? {...state, floors} : measure(state, widths, floors);

const widthsOf = ({widths}: TableState): ColumnWidths | undefined => widths;

const trade = (state: TableState, column: string, neighbor: string, delta: number): TableState =>
  maybe(state.widths)
    .map(previous => measure(state, shares.traded(column, neighbor, delta, state.floors)(previous), state.floors))
    .orElse(state);

const endSizing = ({sizing, ...state}: TableState): TableState =>
  maybe(sizing)
    .mBind(({column, from}) => maybe(state.widths?.[column])
      .map((share): TableState => shares.wholePercent(share) === shares.wholePercent(from) ? state : {...state, report: {about: 'share', name: column, share}}))
    .orElse(state);

const sizingOf = (state: TableState, column: string): TableState =>
  state.sizing?.column === column ? state : endSizing(state);

const startedAt = (state: TableState, column: string): number | undefined =>
  state.sizing?.column === column ? state.sizing.from : state.widths?.[column];

const tradeBy = (state: TableState, column: string, neighbor: string, delta: number): TableState => {
  const ours = sizingOf(state, column);
  return maybe(startedAt(ours, column))
    .map((from): TableState => trade({...ours, sizing: ours.sizing ?? {stage: 'keyed', column, from}}, column, neighbor, delta))
    .orElse(ours);
};

const grip = (state: TableState, column: string, at: Grip): TableState => {
  const ours = sizingOf(state, column);
  return maybe(startedAt(ours, column))
    .map((from): TableState => ({...ours, sizing: {stage: 'gripped', column, from, grip: at}}))
    .orElse(ours);
};

const pointerSizing = (sizing?: Sizing): PointerSizing | undefined =>
  sizing?.stage === 'keyed' ? undefined : sizing;

const gripOf = (state: TableState, column: string): PointerSizing | undefined =>
  state.sizing?.column === column ? pointerSizing(state.sizing) : undefined;

const pointerHolds = (state: TableState, column: string): boolean =>
  maybe(gripOf(state, column)).map(() => true).orElse(false);

const dragHandle = (state: TableState, column: string, neighbor: string, clientX: number): TableState =>
  maybe(gripOf(state, column))
    .map((sizing): TableState => {
      const sought = shares.soughtTrade(sizing.grip, clientX, sizing.stage === 'dragging' ? sizing.carried : 0);
      return {...trade(state, column, neighbor, sought.delta), sizing: {...sizing, stage: 'dragging', carried: sought.carried}};
    })
    .orElse(state);

const ungripOf = (state: TableState, column: string): TableState =>
  maybe(gripOf(state, column)).map(() => endSizing(state)).orElse(state);

const endKeyedSizingOf = (state: TableState, column: string): TableState =>
  state.sizing?.column === column && state.sizing.stage === 'keyed' ? endSizing(state) : state;

const endSizingOf = (state: TableState, column: string): TableState =>
  state.sizing?.column === column ? endSizing(state) : state;

const namedShare = (state: TableState, column: string): number | undefined => startedAt(state, column);

const unmarked = (state: TableState): TableState => ({...state, columnMarks: {}, rowMarks: {}});

const marked = <Shove>(
  marks: Readonly<Record<string, Marks<Shove>>>,
  key: string,
  mark: Marks<Shove>
): Readonly<Record<string, Marks<Shove>>> =>
  ({...marks, [key]: {...marks[key], ...mark}});

const unsettledMark = <Shove>(
  marks: Readonly<Record<string, Marks<Shove>>>,
  key: string
): Readonly<Record<string, Marks<Shove>>> =>
  Object.fromEntries(Object.entries(marks).filter(([marked]) => marked !== key));

const unsettle = (state: TableState, carry: Carry, from: Settling): TableState =>
  carry.axis === 'column'
    ? {...state, columnMarks: marked(state.columnMarks, carry.held, {settlingFrom: from})}
    : {...state, rowMarks: marked(state.rowMarks, carry.held, {settlingFrom: from})};

const settlingFromSeat = (seat: Drift): Settling => ({seat, drift: travel.still});

const settle = (state: TableState, carry: Carry): TableState =>
  carry.axis === 'column'
    ? {...state, columnMarks: unsettledMark(state.columnMarks, carry.held)}
    : {...state, rowMarks: unsettledMark(state.rowMarks, carry.held)};

const shoveColumns = (state: TableState, names: readonly string[], shove: ColumnShove): TableState =>
  ({...state, columnMarks: names.reduce((marks, name) => marked(marks, name, {shoved: shove}), state.columnMarks)});

const shoveRows = (state: TableState, keys: readonly string[], shove: RowShove): TableState =>
  ({...state, rowMarks: keys.reduce((marks, key) => marked(marks, key, {shoved: shove}), state.rowMarks)});

const flying = (grab: Grab): Flying =>
  ({survey: grab.survey, box: grab.box, origin: grab.at, drift: travel.still});

const dragOf = (carry: Carry, grab: Grab): Drag =>
  ({...carry, ...flying(grab)});

const lift = (state: TableState, carry: Carry, grab: Grab): TableState =>
  ({...unmarked(state), drag: dragOf(carry, grab)});

const drift = (state: TableState, moving: Moving): TableState =>
  has(state.drag) ? {...state, drag: {...state.drag, drift: travel.drifted(moving, state.drag.origin)}} : state;

const landColumn = (state: TableState, landing?: string): TableState =>
  state.drag?.axis === 'column' ? {...state, drag: {...state.drag, landing}} : state;

const landRow = (state: TableState, landing?: string): TableState =>
  state.drag?.axis === 'row' ? {...state, drag: {...state.drag, landing}} : state;

const orderAtLift = (drag: Drag): readonly string[] =>
  Object.keys(drag.axis === 'column' ? drag.survey.columnWidths : drag.survey.rowHeights);

const ground = ({drag: _drag, ...state}: TableState): TableState => state;

const seatOffset = (
  state: TableState,
  order: readonly string[],
  standing: readonly string[]
): Drift | undefined => {
  const {drag} = state;
  if (has(drag)) {
    return drag.axis === 'column'
      ? {x: drag.box.x - survey.columnLeft(order, drag.survey)(drag.held), y: 0}
      : {x: 0, y: drag.box.y - survey.rowTop(standing, drag.survey)(drag.held)};
  }
  return undefined;
};

const settlingAt = (state: TableState, order: readonly string[], standing: readonly string[]): Settling =>
  ({seat: seatOffset(state, order, standing) ?? travel.still, drift: state.drag?.drift ?? travel.still});

export type TableView = {
  readonly state: TableState;
  readonly columns: readonly TableColumn<Labeled>[];
  readonly rows: readonly Seated[];
};

export const tableState = {
  resting,
  columnOf,
  measure,
  awaken,
  widthsOf,
  tradeBy,
  grip,
  pointerHolds,
  dragHandle,
  ungripOf,
  endKeyedSizingOf,
  endSizingOf,
  namedShare,
  unsettle,
  settlingFromSeat,
  settle,
  shoveColumns,
  shoveRows,
  dragOf,
  lift,
  drift,
  landColumn,
  landRow,
  orderAtLift,
  ground,
  seatOffset,
  settlingAt
};
