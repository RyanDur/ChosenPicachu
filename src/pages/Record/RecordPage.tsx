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
    <p className="lede sub-title">A webpage is three languages, each designed to handle one concern: HTML says what things are, CSS says how they look, and JavaScript says how they respond. Each began because someone needed something the web could not yet do, starting with several thousand people at CERN, the European physics laboratory, who had to share what they knew. The Record argues three things from the sources. First, each language got its job from a need. Second, when one language was made to do another’s job, the page worked on the day, the cost came with the growth, and the platform, the browsers and the standards they follow, took the job back into the language it belonged to. Third, the standards were written after what shipped, each time the field ran ahead.</p>
    <p className="lede sub-title">The page supports that in four parts. Three stories, one for each language, told in order from their sources, each ending with the moments it rests on. Then every moment in order, from 1989 on, each opening on a need and each with its fuller story and its sources. Then the concert, which reads the moments together as one method. Then the research, the shelf every quotation on the page comes from. Start with a story, or go to a year.</p>
    <Stories/>
    <Timeline/>
    <Concert/>
    <TeeUp>
      <Bibliography/>
    </TeeUp>
  </article>;
};
