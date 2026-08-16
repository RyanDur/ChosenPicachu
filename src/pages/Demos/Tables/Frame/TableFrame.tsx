import {FC, SyntheticEvent, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {useEnv} from '@components/Env';
import {Motion, Origin, Pace} from '../../Controls';
import {frameDocument} from './assemble';
import './TableFrame.css';

type Props = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
};

export const TableFrame: FC<Props> = ({pace, origin, motion}) => {
  const {tradeFeed, tradeHistory, tradeProduct} = useEnv();
  const [height, setHeight] = useState<number>();
  const measured = (event: SyntheticEvent<HTMLIFrameElement>): void => {
    maybe(event.currentTarget.contentDocument).map(document => {
      const grown = document.documentElement.scrollHeight;
      if (grown > 0) {
        setHeight(grown);
      }
    });
  };
  return <iframe className="table-frame"
                 title="the living table, in vanilla"
                 style={has(height) ? {blockSize: `${height}px`} : undefined}
                 onLoad={measured}
                 srcDoc={frameDocument({tradeFeed, tradeHistory, tradeProduct}, {pace, origin, motion})}/>;
};
