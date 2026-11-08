import {FC, useEffect, useReducer} from 'react';
import {asyncResult, has, maybe} from '@ryandur/sand';
import {classNames} from '@components';
import {useEnvironment} from '@environment';
import {bannerChange, useBannerDispatch} from '@banners';
import {Dials} from '../../Controls';
import {tableFrame} from './table-frame';
import {tableFrameChange} from './table-frame-change';
import './TableFrame.css';

type Props = Dials & {
  concealed?: boolean;
  onStood?: () => void;
};

const measured = (frame: HTMLIFrameElement, grown: (height: number) => void): void => {
  maybe(frame.contentDocument).map(inner => {
    const height = Math.ceil(inner.body.getBoundingClientRect().height);
    if (height > 0) {
      grown(height);
    }
  });
};

export const TableFrame: FC<Props> = ({pace, origin, motion, concealed = false, onStood = () => undefined}) => {
  const {tradeFeed, tradeHistory, tradeProduct} = useEnvironment();
  const dispatchBanner = useBannerDispatch();
  const [{frameMarkup, frame, height}, dispatch] = useReducer(tableFrame.reduce, tableFrame.initial);

  useEffect(() => asyncResult(import('./assemble'))
    .onSuccess(({frameAssembly}) =>
      dispatch(tableFrameChange.assembled(
        frameAssembly.document({tradeFeed, tradeHistory, tradeProduct}, {pace, origin, motion}))))
    .onFailure(() => dispatchBanner(bannerChange.raised('the table could not be assembled')))
    .cancel, [pace, origin, motion, tradeFeed, tradeHistory, tradeProduct, dispatchBanner]);

  useEffect(() => {
    if (frame) {
      const watcher = new ResizeObserver(() => measured(frame, to => dispatch(tableFrameChange.grown(to))));
      watcher.observe(frame);
      return () => watcher.disconnect();
    }
  }, [frame]);

  return has(frameMarkup)
    ? <iframe className={classNames('table-frame', concealed && 'concealed')}
      title="the living table, in vanilla"
      style={has(height) ? {'--stage-block-size': `${height}px`} : undefined}
      onLoad={event => {
        dispatch(tableFrameChange.loaded(event.currentTarget));
        measured(event.currentTarget, to => dispatch(tableFrameChange.grown(to)));
        onStood();
      }}
      srcDoc={frameMarkup}/>
    : null;
};
