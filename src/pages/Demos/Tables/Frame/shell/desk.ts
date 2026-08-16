import {has} from '@ryandur/sand';
import {Shares, neighborOf, traded} from '@components/Table/shares';
import {Rule} from '@components/DragSortableTable/sorting';
import {array} from '@components/arrays';

export type Desk = {
  readonly order: readonly string[];
  readonly seats: readonly number[];
  readonly seated: readonly number[];
  readonly shares: Shares | undefined;
  readonly rule: Rule | undefined;
};

export type Shell = {
  document: Document;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: readonly HTMLTableRowElement[];
  desk: () => Desk;
  commit: (transition: (desk: Desk) => Desk) => void;
};

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
