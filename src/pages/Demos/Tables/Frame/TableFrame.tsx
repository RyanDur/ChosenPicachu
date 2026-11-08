import {FC, useEffect, useState} from 'react';
import {asyncResult, has, maybe} from '@ryandur/sand';
import {classNames} from '@components';
import {useEnv} from '@frame/state';
import {bannerChange, useBannerDispatch} from '@frame/notices/Banners';
import {Dials} from '../../Controls';
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
  const {tradeFeed, tradeHistory, tradeProduct} = useEnv();
  const dispatchBanner = useBannerDispatch();
  const [document, setDocument] = useState<string>();
  const [frame, setFrame] = useState<HTMLIFrameElement>();
  const [height, setHeight] = useState<number>();

  useEffect(() => asyncResult(import('./assemble'))
    .onSuccess(({frameAssembly}) =>
      setDocument(frameAssembly.document({tradeFeed, tradeHistory, tradeProduct}, {pace, origin, motion})))
    .onFailure(() => dispatchBanner(bannerChange.raised('the table could not be assembled')))
    .cancel, [pace, origin, motion, tradeFeed, tradeHistory, tradeProduct, dispatchBanner]);

  useEffect(() => {
    if (!has(frame)) {
      return;
    }
    const watcher = new ResizeObserver(() => measured(frame, setHeight));
    watcher.observe(frame);
    return () => watcher.disconnect();
  }, [frame]);

  return has(document)
    ? <iframe className={classNames('table-frame', concealed && 'concealed')}
      title="the living table, in vanilla"
      style={has(height) ? {'--stage-block-size': `${height}px`} : undefined}
      onLoad={event => {
        setFrame(event.currentTarget);
        measured(event.currentTarget, setHeight);
        onStood();
      }}
      srcDoc={document}/>
    : null;
};
