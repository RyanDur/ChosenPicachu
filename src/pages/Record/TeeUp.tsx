import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics, demoAddress} from '@pages/Demos/types';

export const TeeUp: FC<PropsWithChildren> = ({children}) =>
  <footer className="tee-up">
    <p className="sub-title">
      The Record ends here, and the practice begins. Each feature on this site starts from what someone needs. The clues
      in that need point at an element the platform already has. The design is built around that element and cut into
      thin slices, each something a reader can use, and the feature grows one slice at a time. How each concern is
      organized, and why, is on <Link className="signpost" to={Paths.practice}>the Practice page</Link>, one tab for each.
    </p>
    <p className="sub-title">
      <Link className="signpost" to={Paths.demos}>The Demos</Link> run from simple to expert, <Link className="signpost" to={demoAddress(DemoTopics.accordions)}>the accordions</Link> first.
      A reader new to HTML, CSS and JavaScript starts there; a reader who came with a bug goes to its tab. Every tab opens
      by saying what the thing is, the bug most of us have met with it, and the page’s view, before anything is built. The
      accordions and z-index compare the trick used before the platform could do the job with what it does now. Drag
      sort, charts and tables show what the platform does with no library for the job, and the tables are built twice, in
      plain HTML, CSS and JavaScript and again in React, so the line between the platform and a framework stays visible.
      Every claim comes with a working example beside it, so a reader can check it with a keyboard or a screen reader
      instead of taking the page’s word for it. The detail on every tab waits in a fold below the point, and the code
      shown is the site’s own, linked to its source. Each demo asks the question the Record answers: which language the
      job belonged to.
    </p>
    {children}
  </footer>;
