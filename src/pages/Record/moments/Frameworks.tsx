import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const Frameworks: FC = () =>
  <Moment of={moments.frameworks}
    tells={<>After Ajax and jQuery the page was an application, and an application needs a shape. AngularJS, released in
      October 2010 and maintained by Google, bound the model and the view to each other in both directions. React, Vue
      and Angular followed, each with a different answer to the same need.</>}>
    <p className="paragraph muted-ink hyphenated"><a className="signpost" href="https://en.wikipedia.org/wiki/AngularJS">“AngularJS was originally developed in 2009 by Miško Hevery”</a>,
      at a small company, as the back end for a storage service at GetAngular.com; it was released on 20 October 2010
      and <a className="signpost" href="https://en.wikipedia.org/wiki/AngularJS">“maintained mainly by Google”</a>. It
      is a <a className="signpost" href="https://en.wikipedia.org/wiki/AngularJS">“JavaScript-based web framework for developing single-page applications”</a>.
      A framework is a program that owns the page’s structure and calls your code, the reverse of a library, which
      your code calls. A single-page application is a page that never reloads; the script rewrites it. AngularJS’s one
      idea was <a className="signpost" href="https://en.wikipedia.org/wiki/AngularJS">“two-way data-binding that allowed for the automatic synchronization of models and views”</a>:
      change the data and the page changes, change the page and the data changes.</p>
    <p className="paragraph muted-ink hyphenated">The answers multiplied. React, open-sourced at <a className="signpost" href="https://en.wikipedia.org/wiki/React_(software)">“JSConf US, in May 2013”</a>,
      is the 2013 moment. Vue, <a className="signpost" href="https://en.wikipedia.org/wiki/Vue.js">“first publicly announced the following February, in 2014”</a>,
      began as a reaction to AngularJS; Evan You: <a className="signpost" href="https://en.wikipedia.org/wiki/Vue.js">“what if I could just extract the part that I really liked about Angular and build something really lightweight”</a>.
      Angular, <a className="signpost" href="https://en.wikipedia.org/wiki/Angular_(web_framework)">“a complete rewrite from the same team that built AngularJS”</a>,
      shipped its 2.0 release on <a className="signpost" href="https://en.wikipedia.org/wiki/Angular_(web_framework)">14 September 2016</a>,
      and <a className="signpost" href="https://en.wikipedia.org/wiki/AngularJS">“As of January 1, 2022, Google no longer updates AngularJS”</a>.</p>
    <p className="paragraph muted-ink hyphenated">Each framework moved more of the page into script, with structure, style and behaviour composed in one
      place and rendered by the program. The 2013 moment names that need; the 2016 moment counts its cost.</p>
  </Moment>;
