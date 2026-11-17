import {FC, PropsWithChildren, useEffect, useReducer} from 'react';
import {asyncResult, has, is, Maybe, maybe, not} from '@ryandur/sand';
import {classNames} from '@components';
import {useEnvironment} from '@environment';
import {bannerChange, useBannerDispatch} from '@banners';
import {useControls} from '../../Controls';
import {measured, useMeasuredOnResize} from '../../Stage';
import {tableFrame} from './table-frame';
import {tableFrameChange} from './table-frame-change';
import './TableFrame.css';

const bodyOf = (frame: HTMLIFrameElement): Maybe<HTMLElement> =>
  maybe(frame.contentDocument).mBind(({body}) => maybe(body));

export const TableFrame: FC<PropsWithChildren> = ({children}) => {
  const {pace, origin, motion} = useControls();
  const {tradeFeed, tradeHistory, tradeProduct} = useEnvironment();
  const dispatchBanner = useBannerDispatch();
  const [{frameMarkup, frame, height}, dispatch] = useReducer(tableFrame.reduce, tableFrame.initial);

  useEffect(() => asyncResult(import('./assemble'))
    .onSuccess(({frameAssembly}) =>
      dispatch(tableFrameChange.assembled(
        frameAssembly.document({tradeFeed, tradeHistory, tradeProduct}, {pace, origin, motion}))))
    .onFailure(() => dispatchBanner(bannerChange.raised('the table could not be assembled')))
    .cancel, [pace, origin, motion, tradeFeed, tradeHistory, tradeProduct, dispatchBanner]);

  useMeasuredOnResize(bodyOf, dispatch, tableFrameChange.grown, frame);

  const stood = is(frame);

  return <>
    {has(frameMarkup) && <iframe className={classNames('table-frame', not(stood) && 'concealed')}
      title="the living table, in vanilla"
      style={has(height) ? {'--stage-block-size': `${height}px`} : undefined}
      onLoad={event => {
        dispatch(tableFrameChange.loaded(event.currentTarget));
        measured(bodyOf(event.currentTarget), dispatch, tableFrameChange.grown);
      }}
      srcDoc={frameMarkup}/>}
    {not(stood) && children}
  </>;
};
