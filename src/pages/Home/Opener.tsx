import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';

export const Opener: FC = () =>
  <header className="opening">
    <p className="thesis paragraph">I made this site because I couldn’t find one about how HTML, CSS and JavaScript work together. There is
      plenty on each. MDN documents all three in depth, the standards define each in its own specification, and
      most courses teach them one at a time. But a page is all three at once, and in my experience much of what
      goes wrong on a page happens where they meet. The closest thing I found is Jeremy Keith’s <cite>Resilient Web
        Design</cite>, which treats the three as layers and tells their history, without code, by design. This site
      follows the same languages through working code.</p>
    <p className="thesis paragraph">Each language has its own job. HTML says what things are, CSS says how they look, and JavaScript says how
      they respond: structure, presentation and behavior.</p>
    <p className="thesis paragraph">I wrote this for developers who learned the three the way most of us did, one at a time and on the job,
      asking one language to do most of the work. Jobs then end up wherever they can be done: a div standing in
      for a button, a look written on the element itself, a script taking over scrolling, focus or the back
      button. Each of those works well enough to ship. The bugs come later, when someone uses the page with a
      keyboard, with a screen reader, or on a phone.</p>
    <p className="thesis paragraph">More code rarely fixes those bugs. Much of the work is already done by the platform: the browser and the
      standards it follows. The platform keeps getting better, too, because the people who write the standards
      listen to developers, watch what they build, and adopt what proves itself across the browsers. Putting the
      job where it belongs lets each language do what it already does.</p>
    <p className="thesis paragraph">Below, each language has a section of its own: what it says, what its history teaches, and where to read
      more. <Link className="signpost" to={Paths.record}>The Record</Link> tells that history in full: a story for
      each language, then every moment in order, then the three read together, and the pattern they follow, which
      HTML’s own design principles wrote down in 2007. <Link className="signpost"
      to={Paths.practice}>Practice</Link> shows how I organize each language, with a tab for each.</p>
    <p className="thesis paragraph"><Link className="signpost" to={Paths.demos}>The Demos</Link> put that practice to work on five features
      built from this site’s own code, explained beside it and running from simple to expert. Two compare the
      trick we used before the platform could do the job with what it does now. The other three build drag
      sorting, charts and tables with no library for any of them.</p>
  </header>;
