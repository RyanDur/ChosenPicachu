import {Maybe, has, maybe, streaming} from '@ryandur/sand';
import {HTTPError} from '@transport';
import {coinbase} from './coinbase';
import {coinbaseHistory} from './coinbase-history';
import {Period} from './Period';
import {recentTrades} from './recent-trades';
import {MarketAction, marketActions} from './marketActions';
import {MarketMiddleware} from './marketStore';

export type Exchange = {
  tradeFeed: string;
  tradeHistory: string;
  tradeProduct: string;
};

type Closer = () => void;

type Configured = {
  feed: Maybe<string>;
  history: Maybe<string>;
  product: string;
};

const configured = ({tradeFeed, tradeHistory, tradeProduct}: Exchange): Configured =>
  ({feed: maybe(tradeFeed, has), history: maybe(tradeHistory, has), product: tradeProduct});

export type FeedTrouble =
  | {type: 'handshakeRefused'}
  | {type: 'hungUp'}
  | {type: 'historyRefused'; cause: HTTPError}
  | {type: 'candlesRefused'; cause: HTTPError};

type Dispatch = (action: MarketAction) => void;
type Trouble = (trouble: FeedTrouble) => void;

const historyOf = (base: string, product: string, dispatch: Dispatch, onTrouble: Trouble): Closer => {
  const fetching = recentTrades.load(base, product)
    .onSuccess(trades => dispatch(marketActions.historyArrived(trades)))
    .onFailure(cause => onTrouble({type: 'historyRefused', cause}));
  return () => fetching.cancel();
};

const candlesFor = (
  {history, product}: Configured,
  period: Period,
  dispatch: Dispatch,
  onTrouble: Trouble
): Closer => history.either(
  base => {
    const fetching = coinbaseHistory.periodCandles(base, product, coinbaseHistory.periodQuery(period, new Date()))
      .onSuccess(candles => dispatch(marketActions.candlesArrived(period, candles)))
      .onFailure(cause => {
        dispatch(marketActions.candlesRefused(period));
        onTrouble({type: 'candlesRefused', cause});
      });
    return () => fetching.cancel();
  },
  () => {
    dispatch(marketActions.candlesRefused(period));
    return () => undefined;
  });

const streamOf = (address: string, product: string, dispatch: Dispatch, onTrouble: Trouble): Closer => {
  const stream = streaming(address, (): FeedTrouble => ({type: 'handshakeRefused'}))
    .onOpen(socket => {
      socket.send(coinbase.subscribeTo(product));
      dispatch(marketActions.feedOpened());
    })
    .onMessage(event => coinbase.decodeTrade(event.data).map(trade => dispatch(marketActions.tradeArrived(trade))))
    .onClose(() => {
      dispatch(marketActions.feedFailed());
      onTrouble({type: 'hungUp'});
    })
    .onFailure(trouble => {
      dispatch(marketActions.feedFailed());
      onTrouble(trouble);
    });
  return () => stream.close();
};

const opened = ({feed, history, product}: Configured, dispatch: Dispatch, onTrouble: Trouble): readonly Closer[] => [
  ...history.either(base => [historyOf(base, product, dispatch, onTrouble)], () => []),
  ...feed.either(address => [streamOf(address, product, dispatch, onTrouble)], () => [])
];

export const exchange = (environment: Exchange, onTrouble: Trouble): MarketMiddleware => api => {
  const market = configured(environment);
  let closers: readonly Closer[] = [];
  const asked = new Map<Period, Closer>();
  return next => action => {
    next(action);
    switch (action.type) {
      case 'feedRequested':
        closers = opened(market, api.dispatch, onTrouble);
        break;
      case 'feedReleased':
        [...closers, ...asked.values()].forEach(close => close());
        closers = [];
        asked.clear();
        break;
      case 'candlesAsked':
        asked.get(action.period)?.();
        asked.set(action.period, candlesFor(market, action.period, api.dispatch, onTrouble));
        break;
      default:
        break;
    }
  };
};
