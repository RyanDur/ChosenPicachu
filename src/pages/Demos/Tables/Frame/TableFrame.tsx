import {FC, useEffect, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {useEnv} from '@components/Env';
import {Motion, Origin, Pace} from '../../Controls';
import './TableFrame.css';

type Props = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  veiled?: boolean;
  onStand?: () => void;
};

export const warmed = (): void => {
  void import('./assemble');
};

const measured = (frame: HTMLIFrameElement, grown: (height: number) => void): void => {
  maybe(frame.contentDocument).map(inner => {
    const height = Math.ceil(inner.body.getBoundingClientRect().height);
    if (height > 0) {
      grown(height);
    }
  });
};

export const TableFrame: FC<Props> = ({pace, origin, motion, veiled = false, onStand = () => undefined}) => {
  const {tradeFeed, tradeHistory, tradeProduct} = useEnv();
  const [document, setDocument] = useState<string>();
  const [frame, setFrame] = useState<HTMLIFrameElement>();
  const [height, setHeight] = useState<number>();
  const stood = (grown: number): void => {
    setHeight(grown);
    onStand();
  };
  useEffect(() => {
    let standing = true;
    void import('./assemble').then(({frameDocument}) => {
      if (standing) {
        setDocument(frameDocument({tradeFeed, tradeHistory, tradeProduct}, {pace, origin, motion}));
      }
    });
    return () => {
      standing = false;
    };
  }, [pace, origin, motion, tradeFeed, tradeHistory, tradeProduct]);
  useEffect(() => {
    if (!has(frame)) {
      return;
    }
    const watcher = new ResizeObserver(() => measured(frame, setHeight));
    watcher.observe(frame);
    return () => watcher.disconnect();
  }, [frame]);
  return has(document)
    ? <iframe className={classNames('table-frame', veiled && 'veiled')}
              title="the living table, in vanilla"
              style={has(height) ? {blockSize: `${height}px`} : undefined}
              onLoad={event => {
                setFrame(event.currentTarget);
                measured(event.currentTarget, stood);
              }}
              srcDoc={document}/>
    : null;
};
