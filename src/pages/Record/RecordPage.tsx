import {FC} from 'react';
import {Timeline} from './Timeline';
import {Bibliography} from './Bibliography';
import {TeeUp} from './TeeUp';
import './Record.css';

export const RecordPage: FC = () =>
  <article className="record-page">
    <Timeline/>
    <TeeUp>
      <Bibliography/>
    </TeeUp>
  </article>;
