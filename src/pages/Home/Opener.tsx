import {FC} from 'react';

export const Opener: FC = () =>
  <header className="opening">
    <p className="thesis paragraph">
      A webpage is built from three languages, and each has its own job. HTML says what things are, CSS says how they
      look, and JavaScript says how they respond: structure, presentation and behavior. This site is about that
      division of work: what each language is for, how it came to be that way, and how to build with it in mind.
    </p>
    <p className="thesis paragraph">
      It’s written for the developer who learned the three the way most of us did, one at a time and on the job, and
      so asks one of them to do most of the work. A job then ends up in a language that can do it, rather than the one
      it belongs to: a div standing in for a button, a class named for a color, a script taking over scrolling, focus
      or the back button. Each works well enough to ship. The bugs come later, when someone uses the page with a
      keyboard, with a screen reader, on a phone. Much of this work is already done by the platform: the browser and
      the standards it follows. It keeps getting better, too, because the people who write the standards listen to
      developers, watch what they build, and adopt what proves itself across the browsers. So more code rarely fixes
      these bugs. Putting the job where it belongs does.
    </p>
    <p className="thesis paragraph">
      Below, each language has a section: what it says, the rule its history teaches, and where to read more. The
      Record tells how the work came to be divided. When one language could not yet do a job, another covered for it
      until its standard caught up and adopted the workaround, which is what HTML’s own design principles ask: when a
      practice is already widespread,{' '}
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
