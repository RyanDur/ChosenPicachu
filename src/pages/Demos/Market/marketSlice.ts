import {maybe, not} from '@ryandur/sand';
import {slices} from '@components/store';
import {Arrangement, arrangements} from '@components/DragSortableTable/model';
import {Trade} from './coinbase';
import {LiveTradesState, liveTrades} from './live-trades';
import {Period} from './Period';
import {PeriodHistory, periodHistory} from './period-history';
import {Measures, cells} from './cells';
import {Tally, tradeTotals} from './trade-totals';
import {recentTrades} from './recent-trades';
import {MarketAction} from './marketActions';

export type TradesState = LiveTradesState & {
  readonly history: readonly Trade[];
  readonly streamed: readonly Trade[];
  readonly agedOut: Tally;
  readonly rowsShown: readonly Measures[];
  readonly rowsLastShown: readonly Measures[];
};

export type CandlesState = Readonly<Record<Period, PeriodHistory>>;

export type MarketState = {
  readonly trades: TradesState;
  readonly candles: CandlesState;
  readonly arrangement: Arrangement;
};

const noRows = tradeTotals.perLookback([]).map(cells.from);

const noTrades: TradesState = {
  ...liveTrades.opening,
  history: [],
  streamed: [],
  agedOut: tradeTotals.noTally,
  rowsShown: noRows,
  rowsLastShown: noRows
};

const settled = (trades: TradesState, history: readonly Trade[], streamed: readonly Trade[]): TradesState => {
  const held = recentTrades.hydrated(history, streamed);
  const newest = maybe(held[held.length - 1]).map(({tradedAt}) => tradedAt).orElse(0);
  const fresh = (trade: Trade): boolean => newest - trade.tradedAt < tradeTotals.held;
  const agedOut = tradeTotals.joined(trades.agedOut, tradeTotals.tallied(held.filter(trade => not(fresh(trade)))));
  return {
    ...trades,
    history: history.filter(fresh),
    streamed: streamed.filter(fresh),
    agedOut,
    rowsLastShown: trades.rowsShown,
    rowsShown: tradeTotals.perLookback(held.filter(fresh), agedOut).map(cells.from)
  };
};

const tradesReducer = (trades: TradesState, action: MarketAction): TradesState => {
  switch (action.type) {
    case 'feedOpened': return {...trades, status: 'streaming'};
    case 'feedFailed': return {...trades, status: 'failed'};
    case 'tradesArrived': return settled(
      {...trades, trades: [...trades.trades, ...action.trades].slice(-liveTrades.cap)},
      trades.history,
      [...trades.streamed, ...action.trades]);
    case 'historyArrived': {
      const hydrated = settled(trades, action.trades, trades.streamed);
      return {...hydrated, rowsLastShown: hydrated.rowsShown};
    }
    default: return trades;
  }
};

const unaskedCandles: CandlesState = {
  [Period.hour]: periodHistory.unasked,
  [Period.day]: periodHistory.unasked,
  [Period.week]: periodHistory.unasked
};

const candlesReducer = (candles: CandlesState, action: MarketAction): CandlesState => {
  switch (action.type) {
    case 'candlesAsked': return candles[action.period].state === 'arrived'
      ? candles
      : {...candles, [action.period]: periodHistory.loading};
    case 'candlesArrived': return {...candles, [action.period]: {state: 'arrived', candles: action.candles}};
    case 'candlesRefused': return {...candles, [action.period]: periodHistory.unavailable};
    default: return candles;
  }
};

const arranged = arrangements.of(
  cells.measures.map(({name}) => name),
  tradeTotals.lookbacks.map(({lookback}) => lookback)
);

export const marketSlice = slices.combined<MarketState, MarketAction>({
  trades: {initial: noTrades, reduce: tradesReducer},
  candles: {initial: unaskedCandles, reduce: candlesReducer},
  arrangement: {initial: arranged, reduce: arrangements.reducer}
});
