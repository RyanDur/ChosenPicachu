import {FC} from 'react';
import {useArrival} from '@components/OpeningFragment';
import {Timeline} from './Timeline';
import {Bibliography} from './Bibliography';
import {TeeUp} from './TeeUp';
import './Record.css';

export const RecordPage: FC = () => {
  useArrival();
  return <article className="record-page">
    <Timeline/>
    <TeeUp>
      <Bibliography/>
    </TeeUp>
  </article>;
};
