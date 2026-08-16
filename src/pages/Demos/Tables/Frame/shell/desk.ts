import {has} from '@ryandur/sand';
import {Drift, Flight as FlightBox, Grab, carried, still} from '@components/DragSortableTable/travel';
import {Survey} from '@components/DragSortableTable/survey';
import {Shares, neighborOf, traded} from '@components/Table/shares';
import {Rule} from '@components/DragSortableTable/sorting';
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

export type Shell = {
  document: Document;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: readonly HTMLTableRowElement[];
  desk: () => Desk;
  commit: (transition: (desk: Desk) => Desk) => void;
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
