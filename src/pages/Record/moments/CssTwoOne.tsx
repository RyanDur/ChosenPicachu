import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

const release = 'https://www.w3.org/2011/05/css-pr.html.en';
const roadmap = 'https://www.w3.org/TR/2001/WD-css3-roadmap-20010523/';
const color = 'https://www.w3.org/TR/2011/REC-css3-color-20110607/';
const selectors = 'https://www.w3.org/TR/2011/REC-css3-selectors-20110929/';
const namespaces = 'https://www.w3.org/TR/2011/REC-css3-namespace-20110929/';
const mediaQueries = 'https://www.w3.org/TR/2012/REC-css3-mediaqueries-20120619/';

export const CssTwoOne: FC = () =>
  <Moment of={moments.cssTwoOne}
    tells={<>CSS 2.1, the correction of 1998’s CSS 2, became a Recommendation on 7 June 2011. A standard now had to pass more
      than nine thousand tests in two independent browsers before W3C would call it finished. From then on CSS has
      grown by modules, each advancing at its own pace.</>}>
    <p className="paragraph muted-ink hyphenated">W3C’s announcement of 7 June 2011 is headed <a className="signpost" href={release}>“Cascading Style Sheets Standard Boasts Unprecedented Interoperability”</a>. Interoperability means the same sheet produces the same page in different browsers, the thing CSS1 could not deliver in 1996, and the release says why the wait: <a className="signpost" href={release}>“it took many years for implementations and the specification to converge”</a>. It gives the number: <a className="signpost" href={release}>“More than 9000 CSS tests have made it easier for designers to create style sheets that work across browsers, and across devices.”</a> Daniel Glazman, co-chair of the working group, answers the question he says people had asked, <a className="signpost" href={release}>“Why is CSS 2.1 taking so long?”</a> His answer: <a className="signpost" href={release}>“CSS 2.1 is a really large collection of formatting features, and we had to not only carefully review and specify all the potential interactions between them, but also learn from existing implementations and of course tests. Time ensured quality and interoperability.”</a> Thirteen years between CSS 2 and its finished revision.</p>
    <p className="paragraph muted-ink hyphenated">The same day W3C published <a className="signpost" href={color}>CSS Color Module Level 3</a> as a Recommendation, and within a year three more modules followed: <a className="signpost" href={selectors}>Selectors Level 3</a> and <a className="signpost" href={namespaces}>Namespaces</a> on 29 September 2011, and <a className="signpost" href={mediaQueries}>Media Queries</a> on 19 June 2012. The release says W3C <a className="signpost" href={release}>“expects future additions to CSS to be organized as independent modules, allowing smaller, more focused feature sets to progress and stabilize at their own pace”</a>. Peter Linss, the other co-chair, says the group <a className="signpost" href={release}>“can focus its efforts on rapidly advancing CSS with new modules”</a>. The reasoning had been set out in 2001. <a className="signpost" href={roadmap}>“Rather than attempting to shove dozens of updates into a single monolithic specification”</a>, <a className="signpost" href={roadmap}>“it will be much easier and more efficient to be able to update individual pieces of the specification”</a>; and for small devices <a className="signpost" href={roadmap}>“it may be impractical to support all of CSS”</a>. A module is one piece of the language with its own specification and its own tests.</p>
    <p className="paragraph muted-ink hyphenated">This is the shape CSS still has: modules at levels, each finished the way 2.1 was finished, against its tests. CSS 1 was declared finished while no browser rendered all of it; since 2.1, a module is finished when the browsers render it alike.</p>
  </Moment>;
