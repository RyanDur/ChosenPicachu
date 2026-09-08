import {streaming} from '@ryandur/sand';
import {decodeTrade, subscribeTo} from './Charts/coinbase';
import {recentTrades} from './Tables/Aggregations/recent-trades';
import {DemosAction, DemosMiddleware, feedFailed, feedOpened, historyArrived, tradeArrived} from './store';

export type Exchange = {
  tradeFeed: string;
  tradeHistory: string;
  tradeProduct: string;
};

type Closer = () => void;

const opened = (
  {tradeFeed, tradeHistory, tradeProduct}: Exchange,
  dispatch: (action: DemosAction) => void,
  onTrouble: (trouble: string) => void
): readonly Closer[] => {
  const history = tradeHistory
    ? [recentTrades(tradeHistory, tradeProduct, trades => dispatch(historyArrived(trades))).cancel]
    : [];
  if (!tradeFeed) {
    return history;
  }
  const stream = streaming(tradeFeed, () => 'the live feed refused the handshake')
    .onOpen(socket => {
      socket.send(subscribeTo(tradeProduct));
      dispatch(feedOpened());
    })
    .onMessage(event => decodeTrade(event.data).map(trade => dispatch(tradeArrived(trade))))
    .onClose(() => {
      dispatch(feedFailed());
      onTrouble('the live feed hung up mid-stream');
    })
    .onFailure(trouble => {
      dispatch(feedFailed());
      onTrouble(trouble);
    });
  return [...history, () => stream.close()];
};

export const exchange = (env: Exchange, onTrouble: (trouble: string) => void): DemosMiddleware => api => {
  let closers: readonly Closer[] = [];
  return next => action => {
    switch (action.type) {
      case 'feedRequested':
        closers = opened(env, api.dispatch, onTrouble);
        break;
      case 'feedReleased':
        closers.forEach(close => close());
        closers = [];
        break;
      default:
        break;
    }
    next(action);
  };
};
