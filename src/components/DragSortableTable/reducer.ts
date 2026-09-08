import {Reducer, combined} from '@components/store';
import {Foreign, TableAction, isTableAction} from './actions';
import {displacedBetween, interior, spanCrossed} from './survey';
import {
  TableState, awaken, bake, carriedOffset, carry, drift, ground, landColumn, landRow, lift, measure, nudge, orderOf,
  release, reorder, reseat, rule, seat, settle, shoveColumns, shoveRows, standingOf, trade, unsettle
} from './table-state';
import {still} from './travel';

export type TableReducer<C> = Reducer<TableState<C>, Foreign>;

const columnDestination = <C>(state: TableState<C>, action: TableAction): number | undefined => {
  switch (action.type) {
    case 'orderedTo': return action.to;
    case 'columnMovedTo':
    case 'columnWalkedTo': return action.to;
    case 'columnMovedBeside': return interior(orderOf(state).indexOf(action.neighbour), state.columns.length);
    default: return undefined;
  }
};

const rowDestination = <C>(state: TableState<C>, action: TableAction): number | undefined => {
  switch (action.type) {
    case 'nudgedTo':
    case 'rowNudgedTo':
    case 'rowWalkedTo': return action.to;
    case 'seatedTo': return standingOf(state).indexOf(action.struck);
    case 'rowMovedBeside': return standingOf(state).indexOf(action.neighbour);
    default: return undefined;
  }
};

const motion = <C>(state: TableState<C>, action: TableAction): TableState<C> => {
  switch (action.type) {
    case 'dropped': return unsettle(state, action.carry, carriedOffset(state) ?? still);
    case 'unsettled': return unsettle(state, action.target, action.from);
    case 'settled': return settle(state, action.target);
    case 'shovedColumns': return shoveColumns(state, action.names, action.shove);
    case 'shovedRows': return shoveRows(state, action.seats, action.shove);
    case 'columnMovedTo':
    case 'columnMovedBeside':
    case 'columnWalkedTo': {
      const order = orderOf(state);
      const from = order.indexOf(action.name);
      const to = columnDestination(state, action) ?? from;
      const shoved = shoveColumns(state, displacedBetween(order, from, to), {toward: to > from ? 'start' : 'end', by: action.widths[action.name] ?? 0});
      if (action.type !== 'columnWalkedTo') {
        return shoved;
      }
      const over = spanCrossed(order, action.widths, from, to);
      return unsettle(shoved, {axis: 'column', held: action.name}, {x: to > from ? -over : over, y: 0});
    }
    case 'rowMovedBeside':
    case 'rowWalkedTo': {
      const standing = standingOf(state);
      const from = standing.indexOf(action.seat);
      const to = rowDestination(state, action) ?? from;
      const shoved = shoveRows(state, displacedBetween(standing, from, to), {toward: to > from ? 'up' : 'down', by: action.heights[action.seat] ?? 0});
      if (action.type !== 'rowWalkedTo') {
        return shoved;
      }
      const over = spanCrossed(standing, action.heights, from, to);
      return unsettle(shoved, {axis: 'row', held: action.seat}, {x: 0, y: to > from ? -over : over});
    }
    default: return state;
  }
};

const holding = <C>(state: TableState<C>, action: TableAction): TableState<C> => {
  switch (action.type) {
    case 'carrying': return carry(state, action.carry);
    case 'rowLifted': return carry(state, {axis: 'row', held: action.seat});
    case 'released':
    case 'dropped': return release(state);
    default: return state;
  }
};

const sorting = <C>(state: TableState<C>, action: TableAction): TableState<C> => {
  switch (action.type) {
    case 'ruledBy': return rule(state, action.name, action.direction);
    case 'reset': return bake(state, action.arrival);
    case 'seated': return seat(state, action.arrival);
    case 'baked':
    case 'rowLifted':
    case 'rowNudgedTo':
    case 'rowWalkedTo': return bake(state, action.standing);
    default: return state;
  }
};

const ordering = <C>(state: TableState<C>, action: TableAction): TableState<C> => {
  switch (action.type) {
    case 'orderedTo': return reorder(state, action.from, action.to);
    case 'columnMovedTo':
    case 'columnMovedBeside':
    case 'columnWalkedTo': return reorder(state, orderOf(state).indexOf(action.name), columnDestination(state, action) ?? 0);
    case 'seatedTo': return reseat(state, action.held, action.struck);
    case 'rowMovedBeside': return reseat(state, action.seat, action.neighbour);
    case 'nudgedTo': return nudge(state, action.held, action.to);
    case 'rowNudgedTo':
    case 'rowWalkedTo': return nudge(state, action.seat, action.to);
    default: return state;
  }
};

const dragging = <C>(state: TableState<C>, action: TableAction): TableState<C> => {
  switch (action.type) {
    case 'carrying': return lift(state, action.carry, action.grab);
    case 'rowLifted': return lift(state, {axis: 'row', held: action.seat}, action.grab);
    case 'drifted': return drift(state, action.moving);
    case 'columnLandingAt': return landColumn(state, action.neighbour);
    case 'rowLandingAt': return landRow(state, action.neighbour);
    case 'released':
    case 'dropped': return ground(state);
    default: return state;
  }
};

const widths = <C>(state: TableState<C>, action: TableAction): TableState<C> => {
  switch (action.type) {
    case 'measured': return measure(state, action.widths);
    case 'awoken': return awaken(state, action.widths);
    case 'tradedBy': return trade(state, action.column, action.delta);
    default: return state;
  }
};

const answering: <C>(state: TableState<C>, action: TableAction) => TableState<C> =
  combined(motion, holding, sorting, ordering, widths, dragging);

export const tableReducer = <C>(state: TableState<C>, action: Foreign): TableState<C> =>
  isTableAction(action) ? answering(state, action) : state;
