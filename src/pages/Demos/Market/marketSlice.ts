import {slices} from '@components/store';
import {Arrangement, arrangements} from '@components/DragSortableTable/model';
import {Trade} from './coinbase';
import {LiveTradesState, liveTrades} from './live-trades';
import {Period} from './Period';
import {PeriodHistory, periodHistory} from './period-history';
import {cells} from './cells';
import {fold} from './fold';
import {MarketAction} from './marketActions';

export type TradesState = LiveTradesState & {
  readonly history: readonly Trade[];
};

export type CandlesState = Readonly<Partial<Record<Period, PeriodHistory>>>;

export type MarketState = {
  readonly trades: TradesState;
  readonly candles: CandlesState;
  readonly arrangement: Arrangement;
};

const noTrades: TradesState = {...liveTrades.opening, history: []};

const tradesReducer = (trades: TradesState, action: MarketAction): TradesState => {
  switch (action.type) {
    case 'feedOpened': return {...trades, status: 'streaming'};
    case 'feedFailed': return {...trades, status: 'failed'};
    case 'tradeArrived': return {...trades, trades: [...trades.trades, action.trade].slice(-liveTrades.cap)};
    case 'historyArrived': return {...trades, history: action.trades};
    default: return trades;
  }
};

const candlesReducer = (candles: CandlesState, action: MarketAction): CandlesState => {
  switch (action.type) {
    case 'candlesAsked': return candles[action.period]?.state === 'arrived'
      ? candles
      : {...candles, [action.period]: periodHistory.loading};
    case 'candlesArrived': return {...candles, [action.period]: {state: 'arrived', candles: action.candles}};
    case 'candlesRefused': return {...candles, [action.period]: periodHistory.unavailable};
    default: return candles;
  }
};

const arranged = arrangements.of(cells.measures.map(({name}) => name), fold.windows.map(({label}) => label));

export const marketSlice = slices.combined<MarketState, MarketAction>({
  trades: {initial: noTrades, reduce: tradesReducer},
  candles: {initial: {}, reduce: candlesReducer},
  arrangement: {initial: arranged, reduce: arrangements.reducer}
});
