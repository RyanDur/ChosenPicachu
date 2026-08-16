import {FC, SyntheticEvent, useEffect, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {useEnv} from '@components/Env';
import {Motion, Origin, Pace} from '../../Controls';
import './TableFrame.css';

type Props = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
};

export const TableFrame: FC<Props> = ({pace, origin, motion}) => {
  const {tradeFeed, tradeHistory, tradeProduct} = useEnv();
  const [document, setDocument] = useState<string>();
  const [height, setHeight] = useState<number>();
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
  const measured = (event: SyntheticEvent<HTMLIFrameElement>): void => {
    maybe(event.currentTarget.contentDocument).map(inner => {
      const grown = inner.documentElement.scrollHeight;
      if (grown > 0) {
        setHeight(grown);
      }
    });
  };
  return has(document)
    ? <iframe className="table-frame"
              title="the living table, in vanilla"
              style={has(height) ? {blockSize: `${height}px`} : undefined}
              onLoad={measured}
              srcDoc={document}/>
    : null;
};
