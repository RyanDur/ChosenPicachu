import {FC} from 'react';
import {useEnv} from '@components/Env';
import {frameDocument} from './assemble';
import './TableFrame.css';

export const TableFrame: FC = () => {
  const {tradeFeed, tradeHistory, tradeProduct} = useEnv();
  return <iframe className="table-frame"
                 title="the living table, in html"
                 srcDoc={frameDocument({tradeFeed, tradeHistory, tradeProduct})}/>;
};
