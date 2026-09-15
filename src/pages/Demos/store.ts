import {Middleware, Store, sliced, store} from '@components/store';
import {Arrangement, ArrangementAction, arrangementOf, arrangementReducer, standingOf} from '@components/DragSortableTable/arrangement';
import {TableColumn} from '@components/DragSortableTable/table-state';
import {Trade} from './Charts/coinbase';
import {LiveTradesState, opening} from './Charts/live-trades';
import {Measured, Measures, cells, measures, seated} from './Tables/Aggregations/cells';
import {windowedAggregates, windows} from './Tables/Aggregations/fold';
import {hydrated} from './Tables/Aggregations/recent-trades';

export type TradesState = LiveTradesState & {
  readonly history: readonly Trade[];
};

export type DemosState = {
  readonly trades: TradesState;
  readonly arrangement: Arrangement;
};

export type DemosAction =
  | ArrangementAction
  | {readonly type: 'feedRequested'}
  | {readonly type: 'feedReleased'}
  | {readonly type: 'feedOpened'}
  | {readonly type: 'feedFailed'}
  | {readonly type: 'tradeArrived'; readonly trade: Trade}
  | {readonly type: 'historyArrived'; readonly trades: readonly Trade[]};

export type DemosStore = Store<DemosState, DemosAction>;
export type DemosMiddleware = Middleware<DemosState, DemosAction>;

export const feedRequested = (): DemosAction => ({type: 'feedRequested'});
export const feedReleased = (): DemosAction => ({type: 'feedReleased'});
export const feedOpened = (): DemosAction => ({type: 'feedOpened'});
export const feedFailed = (): DemosAction => ({type: 'feedFailed'});
export const tradeArrived = (trade: Trade): DemosAction => ({type: 'tradeArrived', trade});
export const historyArrived = (trades: readonly Trade[]): DemosAction => ({type: 'historyArrived', trades});

const LATEST_TRADES_CAP = 1500;

export const folded = ({history, trades}: TradesState): Measures[] =>
  windowedAggregates(hydrated(history, trades)).map(cells);

const noTrades: TradesState = {...opening, history: []};

const tradesReducer = (trades: TradesState, action: DemosAction): TradesState => {
  switch (action.type) {
    case 'feedOpened': return {...trades, status: 'streaming'};
    case 'feedFailed': return {...trades, status: 'failed'};
    case 'tradeArrived': return {...trades, trades: [...trades.trades, action.trade].slice(-LATEST_TRADES_CAP)};
    case 'historyArrived': return {...trades, history: action.trades};
    default: return trades;
  }
};

const arranged = arrangementOf(measures.map(({name}) => name), windows.map(({label}) => label));

export const demosSlice = sliced<DemosState, DemosAction>({
  trades: {initial: noTrades, reduce: tradesReducer},
  arrangement: {initial: arranged, reduce: arrangementReducer}
});

export const demosStore = (...middleware: DemosMiddleware[]): DemosStore =>
  store({slice: demosSlice, middleware});

export const selectMeasures = ({trades}: DemosState): readonly Measures[] => folded(trades);

export const selectColumns = ({arrangement}: DemosState): readonly TableColumn<Measured>[] =>
  arrangement.columns.map(name => ({
    name,
    data: {label: name},
    sorted: arrangement.sort?.column === name ? arrangement.sort.direction : undefined
  }));

export const selectRows = (state: DemosState): readonly Measures[] => {
  const folded = selectMeasures(state);
  const shown = seated(folded);
  const valueOf = (row: string, column: string) => shown.find(({key}) => key === row)?.values[column];
  const byWindow = new Map(folded.map(row => [row.window.display, row]));
  return standingOf(state.arrangement, valueOf).flatMap(key => {
    const row = byWindow.get(key);
    return row ? [row] : [];
  });
};

export const selectTrades = ({trades}: DemosState): readonly Trade[] => hydrated(trades.history, trades.trades);
export const selectLiveTrades = ({trades}: DemosState): readonly Trade[] => trades.trades;
export const selectFeedStatus = ({trades}: DemosState): LiveTradesState['status'] => trades.status;
