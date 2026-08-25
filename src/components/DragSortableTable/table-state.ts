import {Maybe, has, maybe, nothing} from '@ryandur/sand';
import {Drift, Flight as FlightBox, Grab, carried, still} from './travel';
import {Survey} from './survey';
import {Shares, neighborOf, traded} from '@components/Table/shares';
import {RowData} from '@components/Table';
import {Rule, ranked} from './sorting';
import {array} from '@components/arrays';

export type Aloft =
  | {readonly axis: 'column'; readonly held: string; readonly landing?: string}
  | {readonly axis: 'row'; readonly held: number; readonly landing?: number};

export type Landed =
  | {readonly axis: 'column'; readonly name: string; readonly position: number; readonly of: number}
  | {readonly axis: 'row'; readonly position: number; readonly of: number}
  | {readonly axis: 'share'; readonly name: string; readonly share: number};

export const moveReport = (landed: Landed): string => {
  switch (landed.axis) {
    case 'column':
      return `${landed.name} moved to column ${landed.position + 1} of ${landed.of}`;
    case 'row':
      return `row moved to ${landed.position + 1} of ${landed.of}`;
    case 'share':
      return `${landed.name} resized to ${Math.round(landed.share)}%`;
  }
};

export type Cell = {
  state: () => TableState;
  commit: (transition: (state: TableState) => TableState) => void;
};

export type TableState = {
  readonly order: readonly string[];
  readonly seats: readonly number[];
  readonly seated: readonly number[];
  readonly shares: Shares | undefined;
  readonly rule: Rule | undefined;
  readonly aloft: Aloft | undefined;
  readonly bounds: Survey | undefined;
  readonly flight: FlightBox | undefined;
  readonly origin: Drift | undefined;
  readonly drift: Drift;
  readonly landed: Landed | undefined;
};

export const lifted = (aloft: Aloft, grab: Grab) => (state: TableState): TableState =>
  ({...state, aloft, bounds: grab.survey, flight: grab.box, origin: undefined, drift: still});

export const drifting = (moving: {clientX: number; clientY: number}) => (state: TableState): TableState =>
  ({...state, ...carried(state.origin, moving)});

export const columnLanding = (landing: string | undefined) => (state: TableState): TableState =>
  has(state.aloft) && state.aloft.axis === 'column' ? {...state, aloft: {...state.aloft, landing}} : state;

export const rowLanding = (landing: number | undefined) => (state: TableState): TableState =>
  has(state.aloft) && state.aloft.axis === 'row' ? {...state, aloft: {...state.aloft, landing}} : state;

export const dropped = (state: TableState): TableState =>
  ({...state, aloft: undefined, bounds: undefined, flight: undefined, origin: undefined, drift: still});

export const columnAloft = ({aloft}: TableState): Maybe<string> =>
  has(aloft) && aloft.axis === 'column' ? maybe(aloft.held) : nothing();

export const rowAloft = ({aloft}: TableState): Maybe<number> =>
  has(aloft) && aloft.axis === 'row' ? maybe(aloft.held) : nothing();

export const landedColumn = ({aloft}: TableState): Maybe<string> =>
  has(aloft) && aloft.axis === 'column' ? maybe(aloft.landing) : nothing();

export const landedRow = ({aloft}: TableState): Maybe<number> =>
  has(aloft) && aloft.axis === 'row' ? maybe(aloft.landing) : nothing();

export const baked = (state: TableState): TableState =>
  ({...state, seats: state.seated, rule: undefined});

export const ruledBy = (rule?: Rule) => (state: TableState): TableState =>
  ({...state, rule});

export const orderedTo = (from: number, to: number) => (state: TableState): TableState =>
  ({
    ...state,
    order: array.moveToIndex(to, state.order[from], state.order),
    landed: {axis: 'column', name: state.order[from], position: to, of: state.order.length}
  });

export const seatedTo = (held: number, struck: number) => (state: TableState): TableState =>
  ({
    ...state,
    seats: array.moveToIndex(state.seats.indexOf(struck), held, state.seats),
    landed: {axis: 'row', position: state.seats.indexOf(struck), of: state.seats.length}
  });

export const nudgedTo = (held: number, to: number) => (state: TableState): TableState =>
  ({
    ...state,
    seats: array.moveToIndex(to, held, state.seats),
    landed: {axis: 'row', position: to, of: state.seats.length}
  });

export const sharedAs = (shares: Shares) => (state: TableState): TableState =>
  ({...state, shares});

export const tradedBy = (column: string, delta: number) => (state: TableState): TableState =>
  maybe(state.shares).map<TableState>(previous => {
    const shares = traded(column, neighborOf(state.order, column), delta)(previous);
    return {...state, shares, landed: {axis: 'share', name: column, share: shares[column]}};
  }).orElse(state);

export const columnOf = (state: TableState, cell: Element): string =>
  state.order.find(name => cell.classList.contains(name)) ?? '';

export const dealtTableState = (order: readonly string[], lanes: number): TableState => {
  const dealt = Array.from({length: lanes}, (_, at) => at);
  return {
    order, seats: dealt, seated: dealt, shares: undefined, rule: undefined,
    aloft: undefined, bounds: undefined, flight: undefined, origin: undefined, drift: still,
    landed: undefined
  };
};

export const standingOf = (rows: RowData[], state: TableState): readonly number[] =>
  has(state.rule) ? ranked(rows, state.seats, state.rule) : state.seats;
