import {Maybe, has, maybe, nothing} from '@ryandur/sand';
import {Drift, Flight as FlightBox, Grab, carried, still} from './travel';
import {Survey} from './survey';
import {Shares, neighborOf, traded} from '@components/Table/shares';
import {TableProps} from '@components/Table';
import {Rule, ranked} from './sorting';
import {array} from '@components/arrays';

export type Aloft =
  | {readonly axis: 'column'; readonly held: string; readonly landing?: string}
  | {readonly axis: 'row'; readonly held: number; readonly landing?: number};

export type Desk = {
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
};

export const lifted = (aloft: Aloft, grab: Grab) => (desk: Desk): Desk =>
  ({...desk, aloft, bounds: grab.survey, flight: grab.box, origin: undefined, drift: still});

export const drifting = (moving: {clientX: number; clientY: number}) => (desk: Desk): Desk =>
  ({...desk, ...carried(desk.origin, moving)});

export const columnLanding = (landing: string | undefined) => (desk: Desk): Desk =>
  has(desk.aloft) && desk.aloft.axis === 'column' ? {...desk, aloft: {...desk.aloft, landing}} : desk;

export const rowLanding = (landing: number | undefined) => (desk: Desk): Desk =>
  has(desk.aloft) && desk.aloft.axis === 'row' ? {...desk, aloft: {...desk.aloft, landing}} : desk;

export const dropped = (desk: Desk): Desk =>
  ({...desk, aloft: undefined, bounds: undefined, flight: undefined, origin: undefined, drift: still});

export const columnAloft = ({aloft}: Desk): Maybe<string> =>
  has(aloft) && aloft.axis === 'column' ? maybe(aloft.held) : nothing();

export const rowAloft = ({aloft}: Desk): Maybe<number> =>
  has(aloft) && aloft.axis === 'row' ? maybe(aloft.held) : nothing();

export const landedColumn = ({aloft}: Desk): Maybe<string> =>
  has(aloft) && aloft.axis === 'column' ? maybe(aloft.landing) : nothing();

export const landedRow = ({aloft}: Desk): Maybe<number> =>
  has(aloft) && aloft.axis === 'row' ? maybe(aloft.landing) : nothing();

export const baked = (desk: Desk): Desk =>
  ({...desk, seats: desk.seated, rule: undefined});

export const ruledBy = (rule?: Rule) => (desk: Desk): Desk =>
  ({...desk, rule});

export const orderedTo = (from: number, to: number) => (desk: Desk): Desk =>
  ({...desk, order: array.moveToIndex(to, desk.order[from], desk.order)});

export const seatedTo = (held: number, struck: number) => (desk: Desk): Desk =>
  ({...desk, seats: array.moveToIndex(desk.seats.indexOf(struck), held, desk.seats)});

export const nudgedTo = (held: number, to: number) => (desk: Desk): Desk =>
  ({...desk, seats: array.moveToIndex(to, held, desk.seats)});

export const sharedAs = (shares: Shares) => (desk: Desk): Desk =>
  ({...desk, shares});

export const tradedBy = (column: string, delta: number) => (desk: Desk): Desk =>
  has(desk.shares)
    ? {...desk, shares: traded(column, neighborOf(desk.order, column), delta)(desk.shares)}
    : desk;

export const columnOf = (desk: Desk, cell: Element): string =>
  desk.order.find(name => cell.classList.contains(name)) ?? '';

export const dealtDesk = (order: readonly string[], lanes: number): Desk => {
  const dealt = Array.from({length: lanes}, (_, at) => at);
  return {
    order, seats: dealt, seated: dealt, shares: undefined, rule: undefined,
    aloft: undefined, bounds: undefined, flight: undefined, origin: undefined, drift: still
  };
};

export const standingOf = (rows: TableProps['rows'], desk: Desk): readonly number[] =>
  has(desk.rule) ? ranked(rows, desk.seats, desk.rule) : desk.seats;
