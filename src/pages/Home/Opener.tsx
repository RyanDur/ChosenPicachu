import {FC} from 'react';

export const Opener: FC = () =>
  <>
    <p className="thesis paragraph">I made this site because I couldn’t find one about how HTML, CSS and JavaScript work
      together. There is plenty on each. MDN documents all three in depth, the standards define each in its own
      specification, and most courses teach them one at a time. The closest thing I found is Jeremy
      Keith’s <a className="signpost" href="https://resilientwebdesign.com/"><cite>Resilient Web Design</cite></a>, which
      treats the three as layers and tells their history, without code, by design. This site follows the same
      languages through working code.</p>
    <p className="thesis paragraph">HTML says what things are, CSS says how they look, and JavaScript says how they
      respond: structure, presentation and behavior.</p>
    <p className="thesis paragraph">I wrote this for developers who learned the three the way most of us did, one at a
      time and on the job, asking one language to do most of the work. Jobs then end up wherever they can be done: a div
      standing in for a button, a look written on the element itself, a script taking over scrolling, focus or the back
      button. Each of those works well enough to ship. The bugs come later, when someone uses the page with a
      keyboard, with a screen reader, or on a phone.</p>
    <p className="thesis paragraph">More code rarely fixes those bugs. Much of the work is already done by the platform:
      the browser and the standards it follows. The platform keeps getting better, too, because the people who write the
      standards listen to developers, watch what they build, and adopt what proves itself across the browsers. Putting
      the job where it belongs lets each language do what it already does.</p>
  </>;
