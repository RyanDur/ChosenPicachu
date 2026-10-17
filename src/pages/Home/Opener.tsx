import {FC} from 'react';
import {DemoTopics} from '@pages/Demos/types';
import {inOrder} from '@pages/Record/moments/moments';
import {spelledOut} from '@pages/Record/moments/spelled-out';

export const Opener: FC = () =>
  <header className="opening">
    <p className="thesis paragraph">
      A webpage is three languages working in concert. HTML says what things are, CSS says how
      they show, and JavaScript says how they respond. They were designed apart, on purpose. When
      one could not yet do a job, another covered for it until the standard caught up, which is
      what HTML’s own principles ask:{' '}
      <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“consider adopting
        it rather than forbidding it or inventing something new”</a>.
    </p>
    <p className="thesis paragraph">
      This site is for the developer who has hit a bug on a page and wants to know what the
      platform meant. Many of us write one of the three languages well and the other two by habit,
      and the bug lives where the habit and the platform disagree. The habit is a div where a
      button was meant, a class that names a margin instead of the reason for it, a script that
      rebuilds what the browser already does: scrolling, focus, the back button. Each one works on
      the day it is written. The fix, when it stops working, is rarely more code. It is finding
      which language the job belonged to, and letting that language do it.
    </p>
    <p className="thesis paragraph">
      Each language has a door below: what it is for, how I organize it, and the moments in the
      record where the web learned it. The record tells how the web got the three languages, in{' '}
      {spelledOut(inOrder.length)} moments and a closing essay. The demos are where I work the
      practice: {spelledOut(Object.values(DemoTopics).length)} features built from this site’s own
      code and explained beside it. Two set the trick we used before the platform could do the job
      beside what it gives now, and the other three show what the platform does with no library at
      all.
    </p>
  </header>;
