import {FC} from 'react';
import {DemoTopics} from '@pages/Demos/types';
import {spelledOut} from '@pages/Record/moments/spelled-out';

export const Opener: FC = () =>
  <header className="opening">
    <p className="thesis paragraph">
      A webpage is three languages working in concert. HTML says what things are, CSS says how
      they look, and JavaScript says how they respond. Each was designed to handle one concern: structure,
      presentation and behavior. When one could not yet do a job, another covered for it until its standard caught up
      and adopted
      the workaround, which is what HTML’s own design principles ask: when a practice is already
      widespread,{' '}
      <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“consider adopting
        it rather than forbidding it or inventing something new”</a>.
    </p>
    <p className="thesis paragraph">
      This site is for the developer who has hit a bug on a page and wants to know what the
      platform, the browser and the standards it follows, meant. Many of us write one of the three languages well and
      the other two by habit,
      and the bug lives where the habit and the platform disagree. The habit might be a div where a
      button was meant, a class that names a margin instead of the reason for it, or a script that
      rebuilds what the browser already does: scrolling, focus, the back button. Each one works on
      the day it is written. The fix, when it stops working, is rarely more code. It is finding
      which language the job belonged to, and letting that language do it.
    </p>
    <p className="thesis paragraph">
      Below, each language has one section: what it says, the rule its history teaches, and where to read more. The
      Record tells each language’s story, then every moment in order, then reads the three together. Practice shows
      how I organize each one, with a tab for each language. The Demos are where I put the practice to
      work: {spelledOut(Object.values(DemoTopics).length)} features built from this site’s own
      code and explained beside it. Two compare the trick we used before the platform could do the job
      with what it does now; the other three show what the platform does with no library for the job.
    </p>
  </header>;
