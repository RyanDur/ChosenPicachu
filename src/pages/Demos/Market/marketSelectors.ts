import {TableColumn} from '@components/DragSortableTable/model';
import {Trade} from './coinbase';
import {LiveTradesState} from './live-trades';
import {Period} from './Period';
import {PeriodHistory, periodHistory} from './period-history';
import {Measured, Measures, cells} from './cells';
import {fold} from './fold';
import {recentTrades} from './recent-trades';
import {arrangedView} from './arrangedView';
import {MarketState, TradesState} from './marketSlice';

const folded = ({history, trades}: TradesState): Measures[] =>
  fold.aggregatesOf(recentTrades.hydrated(history, trades)).map(cells.from);

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
  periodHistoryOf: period => ({candles}) => candles[period] ?? periodHistory.loading
};
