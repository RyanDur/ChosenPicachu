import {empty, streaming} from '@ryandur/sand';
import {HTTPError} from '@transport/types';
import {decodeTrade, subscribeTo} from './Charts/coinbase';
import {periodCandles, periodQuery} from './Charts/coinbase/history';
import {Period} from './Charts/period';
import {recentTrades} from './Tables/Aggregations/recent-trades';
import {DemosAction, DemosMiddleware, candlesArrived, candlesRefused, feedFailed, feedOpened, historyArrived, tradeArrived} from './store';

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

type Dispatch = (action: DemosAction) => void;
type Trouble = (trouble: FeedTrouble) => void;

const historyOf = (base: string, product: string, dispatch: Dispatch, onTrouble: Trouble): Closer => {
  const fetching = recentTrades(base, product)
    .onSuccess(trades => dispatch(historyArrived(trades)))
    .onFailure(cause => onTrouble({type: 'historyRefused', cause}));
  return () => fetching.cancel();
};

const candlesFor = ({tradeHistory, tradeProduct}: Exchange, period: Period, dispatch: Dispatch, onTrouble: Trouble): Closer => {
  if (empty(tradeHistory)) {
    return () => undefined;
  }
  const fetching = periodCandles(tradeHistory, tradeProduct, periodQuery(period))
    .onSuccess(candles => dispatch(candlesArrived(period, candles)))
    .onFailure(cause => {
      dispatch(candlesRefused(period));
      onTrouble({type: 'candlesRefused', cause});
    });
  return () => fetching.cancel();
};

const opened = ({tradeFeed, tradeHistory, tradeProduct}: Exchange, dispatch: Dispatch, onTrouble: Trouble): readonly Closer[] => {
  const history = tradeHistory ? [historyOf(tradeHistory, tradeProduct, dispatch, onTrouble)] : [];
  if (!tradeFeed) {
    return history;
  }
  const stream = streaming(tradeFeed, (): FeedTrouble => ({type: 'handshakeRefused'}))
    .onOpen(socket => {
      socket.send(subscribeTo(tradeProduct));
      dispatch(feedOpened());
    })
    .onMessage(event => decodeTrade(event.data).map(trade => dispatch(tradeArrived(trade))))
    .onClose(() => {
      dispatch(feedFailed());
      onTrouble({type: 'hungUp'});
    })
    .onFailure(trouble => {
      dispatch(feedFailed());
      onTrouble(trouble);
    });
  return [...history, () => stream.close()];
};

export const exchange = (env: Exchange, onTrouble: Trouble): DemosMiddleware => api => {
  let closers: readonly Closer[] = [];
  const asked = new Map<Period, Closer>();
  return next => action => {
    switch (action.type) {
      case 'feedRequested':
        closers = opened(env, api.dispatch, onTrouble);
        break;
      case 'feedReleased':
        [...closers, ...asked.values()].forEach(close => close());
        closers = [];
        asked.clear();
        break;
      case 'historyAsked':
        asked.get(action.period)?.();
        asked.set(action.period, candlesFor(env, action.period, api.dispatch, onTrouble));
        break;
      default:
        break;
    }
    next(action);
  };
};
