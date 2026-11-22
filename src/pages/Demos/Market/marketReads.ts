import {TableColumn} from '@components/DragSortableTable/model';
import {Trade} from './coinbase';
import {LiveTradesState} from './live-trades';
import {Period} from './Period';
import {PeriodHistory} from './period-history';
import {Measured, Measures, cells} from './cells';
import {tradeTotals} from './trade-totals';
import {recentTrades} from './recent-trades';
import {arrangedView} from './arrangedView';
import {MarketState, TradesState} from './marketSlice';

const folded = (history: readonly Trade[], streamed: readonly Trade[]): Measures[] =>
  tradeTotals.perLookback(recentTrades.hydrated(history, streamed)).map(cells.from);

const markedRows = ({history, trades, tradesBeforeTheNewest}: TradesState): Measures[] => {
  const was = folded(history, tradesBeforeTheNewest);
  return folded(history, trades).map((now, at) => cells.markedAgainst(was[at], now));
};

type MarketReads = {
  columns: (state: MarketState) => readonly TableColumn<Measured>[];
  rows: (state: MarketState) => readonly Measures[];
  liveTrades: (state: MarketState) => readonly Trade[];
  feedStatus: (state: MarketState) => LiveTradesState['status'];
  periodHistoryOf: (period: Period) => (state: MarketState) => PeriodHistory;
};

export const marketReads: MarketReads = {
  columns: ({arrangement}) => arrangedView.columnsOf(arrangement),
  rows: ({arrangement, trades}) => arrangedView.rowsOf(arrangement, markedRows(trades)),
  liveTrades: ({trades}) => trades.trades,
  feedStatus: ({trades}) => trades.status,
  periodHistoryOf: period => ({candles}) => candles[period]
};
