import {TableColumn} from '@components/DragSortableTable/model';
import {Trade} from './coinbase';
import {LiveTradesState} from './live-trades';
import {Period} from './Period';
import {PeriodHistory} from './period-history';
import {Measured, Measures, cells} from './cells';
import {arrangedView} from './arrangedView';
import {MarketState, TradesState} from './marketSlice';

const markedRows = ({rowsShown, rowsLastShown}: TradesState): Measures[] =>
  rowsShown.map((now, at) => cells.markedAgainst(rowsLastShown[at], now));

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
