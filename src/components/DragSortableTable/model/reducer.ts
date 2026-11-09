import {maybe} from '@ryandur/sand';
import {Reducer, reducers} from '@components/store';
import {Foreign, TableAction, tableActions} from './actions';
import {Landing, tableReports} from './report';
import {survey} from './survey';
import {
  Carry,
  TableState,
  tableState
} from './table-state';

export type TableReducer = Reducer<TableState, Foreign>;

const landed = (state: TableState, carry: Carry, landing: Landing): TableState =>
  maybe(state.drag)
    .mBind(drag => tableReports.landing(carry.axis, tableState.orderAtLift(drag), carry.held, landing))
    .map(report => ({...state, report}))
    .orElse(state);

const motion = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'dropped': return tableState.unsettle(landed(state, action.carry, action.landing), action.carry, action.from);
    case 'unsettled': return tableState.unsettle(state, action.target, action.from);
    case 'settled': return tableState.settle(state, action.target);
    case 'shovedColumns': return tableState.shoveColumns(state, action.names, action.shove);
    case 'shovedRows': return tableState.shoveRows(state, action.keys, action.shove);
    case 'columnMovedBeside':
    case 'columnWalkedTo': {
      const {order} = action;
      const from = order.indexOf(action.name);
      const to = action.type === 'columnWalkedTo' ? action.to : survey.interior(order.indexOf(action.neighbor), order.length);
      const told = action.type !== 'columnWalkedTo' || to === from ? state : {...state, report: {about: 'column' as const, name: action.name, position: to, of: order.length}};
      const shoved = tableState.shoveColumns(told, survey.displacedBetween(order, from, to), {toward: to > from ? 'start' : 'end', by: action.widths[action.name] ?? 0});
      if (action.type !== 'columnWalkedTo') {
        return shoved;
      }
      const over = survey.spanCrossed(order, action.widths, from, to);
      return tableState.unsettle(shoved, {axis: 'column', held: action.name}, tableState.settlingFromSeat({x: to > from ? -over : over, y: 0}));
    }
    case 'rowMovedBeside':
    case 'rowWalkedTo': {
      const {standing} = action;
      const from = standing.indexOf(action.row);
      const to = action.type === 'rowWalkedTo' ? action.to : standing.indexOf(action.neighbor);
      const told = action.type !== 'rowWalkedTo' || to === from ? state : {...state, report: {about: 'row' as const, name: action.label, position: to, of: standing.length}};
      const shoved = tableState.shoveRows(told, survey.displacedBetween(standing, from, to), {toward: to > from ? 'up' : 'down', by: action.heights[action.row] ?? 0});
      if (action.type !== 'rowWalkedTo') {
        return shoved;
      }
      const over = survey.spanCrossed(standing, action.heights, from, to);
      return tableState.unsettle(shoved, {axis: 'row', held: action.row}, tableState.settlingFromSeat({x: 0, y: to > from ? -over : over}));
    }
    default: return state;
  }
};

const dragging = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'lifted': return tableState.lift(state, action.carry, action.grab);
    case 'drifted': return tableState.drift(state, action.moving);
    case 'columnLandingFound': return tableState.landColumn(state, action.neighbor);
    case 'rowLandingFound': return tableState.landRow(state, action.neighbor);
    case 'released':
    case 'dropped': return tableState.ground(state);
    default: return state;
  }
};

const widths = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'measured': return tableState.measure(state, action.widths, action.floors);
    case 'awoken': return tableState.awaken(state, action.widths, action.floors);
    case 'tradedBy': return tableState.tradeBy(state, action.column, action.neighbor, action.delta);
    case 'arrowLifted': return tableState.endKeyedSizingOf(state, action.column);
    case 'handleLeft': return tableState.endSizingOf(state, action.column);
    case 'gripped': return tableState.grip(state, action.column, action.grip);
    case 'handleDragged': return tableState.dragHandle(state, action.column, action.neighbor, action.clientX);
    case 'handleReleased': return tableState.ungripOf(state, action.column);
    default: return state;
  }
};

const sorting = (state: TableState, action: TableAction): TableState =>
  action.type === 'sortChosen' ? {...state, report: {about: 'sort', name: action.column, direction: action.direction}} : state;

const answering: Reducer<TableState, TableAction> = reducers.combined(motion, widths, dragging, sorting);

export const tableReducer = (state: TableState, action: Foreign): TableState =>
  tableActions.recognizes(action) ? answering(state, action) : state;
