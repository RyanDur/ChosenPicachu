import {empty, streaming} from '@ryandur/sand';
import {HTTPError} from '@transport/types';
import {decodeTrade, subscribeTo} from '../Charts/coinbase';
import {periodCandles, periodQuery} from '../Charts/coinbase/history';
import {Period} from '../Charts/period';
import {recentTrades} from '../Tables/Aggregations/recent-trades';
import {MarketAction, marketActions} from './marketActions';
import {MarketMiddleware} from './marketStore';

export type Exchange = {
  tradeFeed: string;
  tradeHistory: string;
  tradeProduct: string;
};

type Closer = () => void;

export type FeedTrouble =
  | {type: 'handshakeRefused'}
  | {type: 'hungUp'}
  | {type: 'historyRefused'; cause: HTTPError}
  | {type: 'candlesRefused'; cause: HTTPError};

type Dispatch = (action: MarketAction) => void;
type Trouble = (trouble: FeedTrouble) => void;

const historyOf = (base: string, product: string, dispatch: Dispatch, onTrouble: Trouble): Closer => {
  const fetching = recentTrades(base, product)
    .onSuccess(trades => dispatch(marketActions.historyArrived(trades)))
    .onFailure(cause => onTrouble({type: 'historyRefused', cause}));
  return () => fetching.cancel();
};

const candlesFor = (
  {tradeHistory, tradeProduct}: Exchange,
  period: Period,
  dispatch: Dispatch,
  onTrouble: Trouble
): Closer => {
  if (empty(tradeHistory)) {
    dispatch(marketActions.candlesRefused(period));
    return () => undefined;
  }
  const fetching = periodCandles(tradeHistory, tradeProduct, periodQuery(period))
    .onSuccess(candles => dispatch(marketActions.candlesArrived(period, candles)))
    .onFailure(cause => {
      dispatch(marketActions.candlesRefused(period));
      onTrouble({type: 'candlesRefused', cause});
    });
  return () => fetching.cancel();
};

const opened = (
  {tradeFeed, tradeHistory, tradeProduct}: Exchange,
  dispatch: Dispatch,
  onTrouble: Trouble
): readonly Closer[] => {
  const history = tradeHistory ? [historyOf(tradeHistory, tradeProduct, dispatch, onTrouble)] : [];
  if (!tradeFeed) {
    return history;
  }
  const stream = streaming(tradeFeed, (): FeedTrouble => ({type: 'handshakeRefused'}))
    .onOpen(socket => {
      socket.send(subscribeTo(tradeProduct));
      dispatch(marketActions.feedOpened());
    })
    .onMessage(event => decodeTrade(event.data).map(trade => dispatch(marketActions.tradeArrived(trade))))
    .onClose(() => {
      dispatch(marketActions.feedFailed());
      onTrouble({type: 'hungUp'});
    })
    .onFailure(trouble => {
      dispatch(marketActions.feedFailed());
      onTrouble(trouble);
    });
  return [...history, () => stream.close()];
};

export const exchange = (env: Exchange, onTrouble: Trouble): MarketMiddleware => api => {
  let closers: readonly Closer[] = [];
  const asked = new Map<Period, Closer>();
  return next => action => {
    next(action);
    switch (action.type) {
      case 'feedRequested':
        closers = opened(env, api.dispatch, onTrouble);
        break;
      case 'feedReleased':
        [...closers, ...asked.values()].forEach(close => close());
        closers = [];
        asked.clear();
        break;
      case 'candlesAsked':
        asked.get(action.period)?.();
        asked.set(action.period, candlesFor(env, action.period, api.dispatch, onTrouble));
        break;
      default:
        break;
    }
  };
};
