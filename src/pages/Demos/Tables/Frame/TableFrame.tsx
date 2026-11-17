import {FC, PropsWithChildren, useEffect, useReducer} from 'react';
import {asyncResult, has, maybe, not} from '@ryandur/sand';
import {classNames} from '@components';
import {useEnvironment} from '@environment';
import {bannerChange, useBannerDispatch} from '@banners';
import {useControls} from '../../Controls';
import {tableFrame} from './table-frame';
import {tableFrameChange} from './table-frame-change';
import './TableFrame.css';

const measured = (frame: HTMLIFrameElement, grown: (height: number) => void): void => {
  maybe(frame.contentDocument).map(inner => {
    const height = Math.ceil(inner.body.getBoundingClientRect().height);
    if (height > 0) {
      grown(height);
    }
  });
};

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

  useEffect(() => maybe(frame).map(watched => {
    const watcher = new ResizeObserver(() => measured(watched, height => dispatch(tableFrameChange.grown(height))));
    watcher.observe(watched);
    return () => watcher.disconnect();
  }).orElse(() => undefined), [frame]);

  const stood = not(maybe(frame).isNothing);

  return <>
    {has(frameMarkup) && <iframe className={classNames('table-frame', not(stood) && 'concealed')}
      title="the living table, in vanilla"
      style={has(height) ? {'--stage-block-size': `${height}px`} : undefined}
      onLoad={event => {
        dispatch(tableFrameChange.loaded(event.currentTarget));
        measured(event.currentTarget, height => dispatch(tableFrameChange.grown(height)));
      }}
      srcDoc={frameMarkup}/>}
    {not(stood) && children}
  </>;
};
