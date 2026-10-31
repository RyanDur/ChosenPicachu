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
    <p className="lede sub-title">The home page says what each language is for. This page tells how each one came to its job, from the sources. The Record argues three things from them. First, each language got its job from a need. Second, when one language did another’s job, the page worked from the start and the costs showed as it grew, and then the platform, the browsers and the standards they follow, gave the job to the language that fit it. The single-page application is a different kind of move: script makes the HTML in the browser instead of the server sending it, and both ways are still in use. Third, the standards were written after what shipped, each time the field ran ahead.</p>
    <p className="lede sub-title">The page supports that in four parts. Three stories, one for each language, told in order from their sources, each ending with the moments it rests on. Then every moment in order, from 1989 on, each opening on a need and each with its fuller story and its sources. Then the concert, which reads the moments together as one method. Then the research, the shelf every quotation on the page comes from. Start with a story, or go to a year.</p>
    <Stories/>
    <Timeline/>
    <Concert/>
    <TeeUp>
      <Bibliography/>
    </TeeUp>
  </article>;
};
