import {FC} from 'react';
import {useArrival} from '@components/OpeningFragment';
import {Quotation} from '@components/Quotation';
import {Timeline} from './Timeline';
import {Stories} from './Stories';
import {Concert} from './Concert';
import {Bibliography} from './Bibliography';
import {TeeUp} from './TeeUp';
import './Record.css';

export const RecordPage: FC = () => {
  useArrival();
  return <article className="record-page">
    <Quotation voice="sub-title" source={<>Tim Berners-Lee and Robert Cailliau,{' '}
      <a className="signpost" href="https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html">proposing
        the WorldWideWeb, 1990</a></>}>
      HyperText is a way to link and access information of various kinds as a web of nodes
      in which the user can browse at will.
    </Quotation>
    <p className="lede sub-title">
      Someone needed something: several thousand people at CERN, spread across institutes and experiments, who had to
      share what they knew. The record tells how the web answered, in four parts. Three stories first, one for each
      language, each ending with the moments it rests on. Then every moment in order, each opening on a need of the same
      kind. Then the concert, which reads the three stories as one method. Then the research they stand on.
    </p>
    <Stories/>
    <Timeline/>
    <Concert/>
    <TeeUp>
      <Bibliography/>
    </TeeUp>
  </article>;
};
