import {slices} from '@components/store';
import {Arrangement, arrangements} from '@components/DragSortableTable/model';
import {Trade} from '../Charts/coinbase';
import {LATEST_TRADES_CAP, LiveTradesState, opening} from '../Charts/live-trades';
import {Period} from '../Charts/period';
import {PeriodHistory, loading, unavailable} from '../Charts/period-history';
import {measures} from './cells';
import {windows} from './fold';
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

const noTrades: TradesState = {...opening, history: []};

const tradesReducer = (trades: TradesState, action: MarketAction): TradesState => {
  switch (action.type) {
    case 'feedOpened': return {...trades, status: 'streaming'};
    case 'feedFailed': return {...trades, status: 'failed'};
    case 'tradeArrived': return {...trades, trades: [...trades.trades, action.trade].slice(-LATEST_TRADES_CAP)};
    case 'historyArrived': return {...trades, history: action.trades};
    default: return trades;
  }
};

const candlesReducer = (candles: CandlesState, action: MarketAction): CandlesState => {
  switch (action.type) {
    case 'candlesAsked': return candles[action.period]?.state === 'arrived' ? candles : {...candles, [action.period]: loading};
    case 'candlesArrived': return {...candles, [action.period]: {state: 'arrived', candles: action.candles}};
    case 'candlesRefused': return {...candles, [action.period]: unavailable};
    default: return candles;
  }
};

const arranged = arrangements.of(measures.map(({name}) => name), windows.map(({label}) => label));

export const marketSlice = slices.combined<MarketState, MarketAction>({
  trades: {initial: noTrades, reduce: tradesReducer},
  candles: {initial: {}, reduce: candlesReducer},
  arrangement: {initial: arranged, reduce: arrangements.reducer}
});
