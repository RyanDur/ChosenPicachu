import {FC} from 'react';
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
  return <iframe className="table-frame"
                 title="the living table, in html"
                 srcDoc={frameDocument({tradeFeed, tradeHistory, tradeProduct}, {pace, origin, motion})}/>;
};
