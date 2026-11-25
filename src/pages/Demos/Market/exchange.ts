import {Maybe, has, maybe, nothing, notEmpty, some, streaming} from '@ryandur/sand';
import type {Paints} from '@page';
import {HTTPError} from '@transport';
import {coinbase, Trade} from './coinbase';
import {coinbaseHistory} from './coinbase-history';
import {liveTrades} from './live-trades';
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

type FrameBatch = {
  readonly hold: (trade: Trade) => void;
  readonly handOver: () => void;
  readonly drop: () => void;
};

// A socket can deliver several trades between two paints, and a hidden tab doesn't paint at all.
const batchedPerFrame = (paints: Paints, dispatch: Dispatch): FrameBatch => {
  let held: Trade[] = [];
  let pendingFrame: Maybe<number> = nothing();
  const deliver = (): void => {
    const trades = held;
    held = [];
    pendingFrame = nothing();
    dispatch(marketActions.tradesArrived(trades));
  };
  const askForAPaint = (): Maybe<number> => {
    const frame = paints.requestAnimationFrame(deliver);
    return notEmpty(held) ? some(frame) : nothing();
  };
  const cancelThePaint = (): void => {
    pendingFrame.map(frame => paints.cancelAnimationFrame(frame));
    pendingFrame = nothing();
  };
  const handOver = (): void => {
    pendingFrame.map(frame => {
      paints.cancelAnimationFrame(frame);
      deliver();
    });
  };
  return {
    hold: trade => {
      held.push(trade);
      if (held.length < liveTrades.cap) {
        pendingFrame = pendingFrame.or(askForAPaint);
      } else {
        handOver();
      }
    },
    handOver,
    drop: () => {
      cancelThePaint();
      held = [];
    }
  };
};

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

type Subscription = {
  address: string;
  product: string;
};

const streamOf = ({address, product}: Subscription, paints: Paints, dispatch: Dispatch, onTrouble: Trouble): Closer => {
  const arriving = batchedPerFrame(paints, dispatch);
  const stream = streaming(address, (): FeedTrouble => ({type: 'handshakeRefused'}))
    .onOpen(socket => {
      socket.send(coinbase.subscribeTo(product));
      dispatch(marketActions.feedOpened());
    })
    .onMessage(event => coinbase.decodeTrade(event.data).map(arriving.hold))
    .onClose(() => {
      arriving.handOver();
      dispatch(marketActions.feedFailed());
      onTrouble({type: 'hungUp'});
    })
    .onFailure(trouble => {
      dispatch(marketActions.feedFailed());
      onTrouble(trouble);
    });
  return () => {
    arriving.drop();
    stream.close();
  };
};

const opened = (
  {feed, history, product}: Configured,
  paints: Paints,
  dispatch: Dispatch,
  onTrouble: Trouble
): readonly Closer[] => [
  ...history.either(base => [historyOf(base, product, dispatch, onTrouble)], () => []),
  ...feed.either(address => [streamOf({address, product}, paints, dispatch, onTrouble)], () => [])
];

export const exchange = (environment: Exchange, paints: Paints, onTrouble: Trouble): MarketMiddleware => api => {
  const market = configured(environment);
  let closers: readonly Closer[] = [];
  const asked = new Map<Period, Closer>();
  return next => action => {
    next(action);
    switch (action.type) {
      case 'feedRequested':
        closers = opened(market, paints, api.dispatch, onTrouble);
        break;
      case 'feedReleased':
        [...closers, ...asked.values()].forEach(close => close());
        closers = [];
        asked.clear();
        break;
      case 'candlesAsked':
        maybe(asked.get(action.period)).map(close => close());
        asked.set(action.period, candlesFor(market, action.period, api.dispatch, onTrouble));
        break;
      default:
        break;
    }
  };
};
