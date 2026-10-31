import {FC} from 'react';

export const Opener: FC = () =>
  <header className="opening">
    <p className="thesis paragraph">
      I made this site because I couldn’t find one about how HTML, CSS and JavaScript work together. There is plenty on
      each. MDN documents all three in depth, the standards define each in its own specification, and courses teach
      them one at a time. What I wanted was the view a working developer needs: how each language does its own job
      well, and how each covers for another’s weakness until the platform closes it. The closest I found is Jeremy
      Keith’s <cite>Resilient Web Design</cite>, which treats the three as layers and tells their history, without code,
      by design. This site follows the same three through working code.
    </p>
    <p className="thesis paragraph">
      A webpage is built from three languages, and each has its own job. HTML says what things are, CSS says how they
      look, and JavaScript says how they respond: structure, presentation and behavior. This site is about how they
      share that work: what each language is for, how they came to divide it, and how to build with that in mind.
    </p>
    <p className="thesis paragraph">
      It’s written for the developer who learned the three the way most of us did, one at a time and on the job, and
      so asks one of them to do most of the work. A job then ends up in a language that can do it, rather than the one
      it belongs to: a div standing in for a button, a look written on the element itself, a script taking over
      scrolling, focus or the back button. Each works well enough to ship. The bugs come later, when someone uses the page with a
      keyboard, with a screen reader, on a phone. Much of this work is already done by the platform: the browser and
      the standards it follows. It keeps getting better, too, because the people who write the standards listen to
      developers, watch what they build, and adopt what proves itself across the browsers. So more code rarely fixes
      these bugs. Putting the job where it belongs does.
    </p>
    <p className="thesis paragraph">
      Below, each language has a section: what it says, what its history teaches, and where to read more. The Record
      tells how the work came to be divided, by the pattern HTML’s own design principles ask for: when a practice is
      already widespread,{' '}
      <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“consider adopting
        it rather than forbidding it or inventing something new”</a>. It goes through each language’s story, then
      every moment in order, then reads the three together.
    </p>
    <p className="thesis paragraph">
      Practice shows how I organize each language, with a tab for each. The Demos put that practice to work: five
      features built from this site’s own code and explained beside it, that run from simple to expert. Two compare
      the trick we used before the platform could do the job with what it does now; the other three build drag
      sorting, charts and tables with no library for any of them.
    </p>
  </header>;
