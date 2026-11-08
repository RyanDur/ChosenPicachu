import {TableColumn} from '@components/DragSortableTable/table-state';
import {Trade} from '../Charts/coinbase';
import {LiveTradesState} from '../Charts/live-trades';
import {Period} from '../Charts/period';
import {PeriodHistory, loading} from '../Charts/period-history';
import {Measured, Measures, cells} from '../Tables/Aggregations/cells';
import {windowedAggregates} from '../Tables/Aggregations/fold';
import {hydrated} from '../Tables/Aggregations/recent-trades';
import {arrangedView} from './arrangedView';
import {MarketState, TradesState} from './marketSlice';

const folded = ({history, trades}: TradesState): Measures[] =>
  windowedAggregates(hydrated(history, trades)).map(cells);

type MarketSelectors = {
  columns: (state: MarketState) => readonly TableColumn<Measured>[];
  rows: (state: MarketState) => readonly Measures[];
  liveTrades: (state: MarketState) => readonly Trade[];
  feedStatus: (state: MarketState) => LiveTradesState['status'];
  periodHistoryOf: (period: Period) => (state: MarketState) => PeriodHistory;
};

export const marketSelectors: MarketSelectors = {
  columns: ({arrangement}) => arrangedView.columnsOf(arrangement),
  rows: ({arrangement, trades}) => arrangedView.rowsOf(arrangement, folded(trades)),
  liveTrades: ({trades}) => trades.trades,
  feedStatus: ({trades}) => trades.status,
  periodHistoryOf: period => ({candles}) => candles[period] ?? loading
};
