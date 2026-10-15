import {FC} from 'react';
import {useArrival} from '@components/OpeningFragment';
import {Timeline} from './Timeline';
import {Concert} from './Concert';
import {Bibliography} from './Bibliography';
import {TeeUp} from './TeeUp';
import './Record.css';

export const RecordPage: FC = () => {
  useArrival();
  return <article className="record-page">
    <Timeline/>
    <Concert/>
    <TeeUp>
      <Bibliography/>
    </TeeUp>
  </article>;
};
