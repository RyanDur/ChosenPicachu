import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const CssTwoOne: FC = () =>
  <Moment of={moments.cssTwoOne}
    tells={<>CSS 2.1, the correction of 1998’s CSS 2, became a Recommendation on 7 June 2011. A standard now had to pass more
      than nine thousand tests in two independent browsers before W3C would call it finished. From then on CSS has
      grown by modules, each advancing at its own pace.</>}>
    <p className="paragraph muted-ink hyphenated">W3C’s announcement is headed <a className="signpost" href="https://www.w3.org/2011/05/css-pr.html.en">“Cascading Style Sheets Standard Boasts Unprecedented Interoperability”</a>.
      Interoperability means the same sheet produces the same page in different browsers, the thing CSS1 could not
      deliver in 1996. The release gives the number: <a className="signpost" href="https://www.w3.org/2011/05/css-pr.html.en">“More than 9000 CSS tests have made it easier for designers”</a>.
      Daniel Glazman, co-chair of the working group, gives the cost: <a className="signpost" href="https://www.w3.org/2011/05/css-pr.html.en">“Time ensured quality and interoperability”</a>.
      Thirteen years between CSS 2 and its finished revision.</p>
    <p className="paragraph muted-ink hyphenated">Alongside CSS 2.1 the group published the Color module as a Recommendation, and the release says W3C expects
      future additions to CSS to be organised as independent modules that progress and stabilise at their own pace.
      The reasoning was set out in 2001: <a className="signpost" href="https://www.w3.org/TR/2001/WD-css3-roadmap-20010523/">“Rather than attempting to shove dozens of updates into a single monolithic specification”</a>, <a className="signpost" href="https://www.w3.org/TR/2001/WD-css3-roadmap-20010523/">“it will be much easier and more efficient to be able to update individual pieces of the specification”</a>,
      and for small devices <a className="signpost" href="https://www.w3.org/TR/2001/WD-css3-roadmap-20010523/">“it may be impractical to support all of CSS”</a>.
      A module is one piece of the language with its own specification and its own tests.</p>
    <p className="paragraph muted-ink hyphenated">This is the shape CSS still has: modules at levels, each finished the way 2.1 was finished, against its tests.
      The language that was declared finished before any browser could render it became a language that is not
      finished until the browsers render it alike.</p>
  </Moment>;
