import {ArrangementAction} from '@components/DragSortableTable/model';
import {Trade} from './coinbase';
import {Candle} from './candles';
import {Period} from './Period';

export type MarketAction =
  | ArrangementAction
  | {readonly type: 'feedRequested'}
  | {readonly type: 'feedReleased'}
  | {readonly type: 'feedOpened'}
  | {readonly type: 'feedFailed'}
  | {readonly type: 'tradeArrived'; readonly trade: Trade}
  | {readonly type: 'historyArrived'; readonly trades: readonly Trade[]}
  | {readonly type: 'candlesAsked'; readonly period: Period}
  | {readonly type: 'candlesArrived'; readonly period: Period; readonly candles: readonly Candle[]}
  | {readonly type: 'candlesRefused'; readonly period: Period};

type MarketActions = {
  feedRequested: () => MarketAction;
  feedReleased: () => MarketAction;
  feedOpened: () => MarketAction;
  feedFailed: () => MarketAction;
  tradeArrived: (trade: Trade) => MarketAction;
  historyArrived: (trades: readonly Trade[]) => MarketAction;
  candlesAsked: (period: Period) => MarketAction;
  candlesArrived: (period: Period, candles: readonly Candle[]) => MarketAction;
  candlesRefused: (period: Period) => MarketAction;
};

export const marketActions: MarketActions = {
  feedRequested: () => ({type: 'feedRequested'}),
  feedReleased: () => ({type: 'feedReleased'}),
  feedOpened: () => ({type: 'feedOpened'}),
  feedFailed: () => ({type: 'feedFailed'}),
  tradeArrived: trade => ({type: 'tradeArrived', trade}),
  historyArrived: trades => ({type: 'historyArrived', trades}),
  candlesAsked: period => ({type: 'candlesAsked', period}),
  candlesArrived: (period, candles) => ({type: 'candlesArrived', period, candles}),
  candlesRefused: period => ({type: 'candlesRefused', period})
};
