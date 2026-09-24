import {Reducer, combined} from '@components/store';
import {Foreign, TableAction, isTableAction} from './actions';
import {displacedBetween, interior, spanCrossed} from './survey';
import {
  TableState, awaken, dragHandle, drift, grip, ground, landColumn, landRow, lift, measure, settle, settlingFromSeat, shoveColumns, shoveRows, trade, ungrip, unsettle
} from './table-state';

export type TableReducer = Reducer<TableState, Foreign>;

const motion = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'dropped': return unsettle(state, action.carry, action.from);
    case 'unsettled': return unsettle(state, action.target, action.from);
    case 'settled': return settle(state, action.target);
    case 'shovedColumns': return shoveColumns(state, action.names, action.shove);
    case 'shovedRows': return shoveRows(state, action.keys, action.shove);
    case 'columnMovedBeside':
    case 'columnWalkedTo': {
      const {order} = action;
      const from = order.indexOf(action.name);
      const to = action.type === 'columnWalkedTo' ? action.to : interior(order.indexOf(action.neighbour), order.length);
      const shoved = shoveColumns(state, displacedBetween(order, from, to), {toward: to > from ? 'start' : 'end', by: action.widths[action.name] ?? 0});
      if (action.type !== 'columnWalkedTo') {
        return shoved;
      }
      const over = spanCrossed(order, action.widths, from, to);
      return unsettle(shoved, {axis: 'column', held: action.name}, settlingFromSeat({x: to > from ? -over : over, y: 0}));
    }
    case 'rowMovedBeside':
    case 'rowWalkedTo': {
      const {standing} = action;
      const from = standing.indexOf(action.row);
      const to = action.type === 'rowWalkedTo' ? action.to : standing.indexOf(action.neighbour);
      const shoved = shoveRows(state, displacedBetween(standing, from, to), {toward: to > from ? 'up' : 'down', by: action.heights[action.row] ?? 0});
      if (action.type !== 'rowWalkedTo') {
        return shoved;
      }
      const over = spanCrossed(standing, action.heights, from, to);
      return unsettle(shoved, {axis: 'row', held: action.row}, settlingFromSeat({x: 0, y: to > from ? -over : over}));
    }
    default: return state;
  }
};

const dragging = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'lifted': return lift(state, action.carry, action.grab);
    case 'drifted': return drift(state, action.moving);
    case 'columnLandingFound': return landColumn(state, action.neighbour);
    case 'rowLandingFound': return landRow(state, action.neighbour);
    case 'released':
    case 'dropped': return ground(state);
    default: return state;
  }
};

const widths = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'measured': return measure(state, action.widths);
    case 'awoken': return awaken(state, action.widths);
    case 'tradedBy': return trade(state, action.column, action.neighbour, action.delta);
    case 'reported': return {...state, report: action.report};
    case 'gripped': return grip(state, action.column, action.grip);
    case 'handleDragged': return dragHandle(state, action.neighbour, action.clientX);
    case 'released': return ungrip(state);
    default: return state;
  }
};

const answering: (state: TableState, action: TableAction) => TableState = combined(motion, widths, dragging);

export const tableReducer = (state: TableState, action: Foreign): TableState =>
  isTableAction(action) ? answering(state, action) : state;
