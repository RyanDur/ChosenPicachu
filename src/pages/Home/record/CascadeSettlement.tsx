import {FC} from 'react';
import {Moment} from './Moment';

export const CascadeSettlement: FC = () =>
  <Moment year="1994"
          title="The cascade settles it"
          tells={<>The proposal{' '}
            <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">balanced two
            voices</a>: the author, who must be able to decide how a document presents, and the user,
            whose eyes have to decode it. Some argued style needed a full programming language; CSS
            chose a simple, declarative format instead.</>}>
            <p className="paragraph">The first cascade was not the one we know. It was arithmetic. Every declaration
    could carry a percentage of influence, the user’s sheet claimed its share first, and
    conflicts were settled by weighted average:</p>
    <pre className="period-markup"><code>{'h1.font.size = 24pt 100%\nh2.font.size = 20pt 40%'}</code></pre>
    <p className="paragraph">Forty percent left sixty for sheets later in the cascade, and
    the browser averaged the requests. Lie conceded the seam himself: it was not obvious{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“how to mix 40% helvetica and 60% times”</a>, and left it open for
    research. The draft’s own example sheet contains the sharpest comment in the history
    of the language: <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“# first, redefine influence to dictatorship.”</a></p>
    <p className="paragraph">The draft even drew the settlement as a user interface: a fictitious screenshot,
    in ASCII, of sliders between two masters:</p>
    <pre className="period-markup"><code>{'        User            Author\n Font   o-----x--------------o 64%\n Color  o-x------------------o 90%\n Margin o-------------x------o 37%\n Volume o---------x----------o 50%'}</code></pre>
    <p className="paragraph">At Chicago, Lie and Bos remember, the balance of author and
    user preferences was itself <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“novel”</a>, and by the Darmstadt
    conference the discussion was openly political. Authors argued they had to control
    presentation, warning labels and legal force invoked; the other side held that the
    user, <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“whose eyes and ears ultimately have to decode the presentation”</a>,
    should win a conflict.</p>
    <p className="paragraph">CSS was attacked from the other flank too: as too simple, by those who believed
    style needed a full programming language. The draft had already chosen its side:
    style sheets are not programs but{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“declarations of constraints”</a>, declarative on purpose, which is
    why a stylesheet from 1996 still parses today.</p>
    <p className="paragraph">Then the treaty grew institutions. The www-style list opened in May 1995 and held
    four thousand messages within three years; Thomas Reardon of Microsoft pledged CSS
    support at a W3C workshop in Paris; the W3C’s review board took CSS as a work item,
    and after battles Lie and Bos describe as <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“long and hard”</a>, CSS1
    became a Recommendation in December 1996, the percentages gone, traded for
    specificity, with a working group formed to focus on CSS alone.</p>
  </Moment>;
