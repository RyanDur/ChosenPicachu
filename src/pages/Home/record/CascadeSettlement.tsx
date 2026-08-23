import {FC} from 'react';
import {Moment} from './Moment';

export const CascadeSettlement: FC = () =>
  <Moment year="1994"
          title="Author and reader both need a say"
          tells={<>The proposal{' '}
            <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">balanced two
            voices</a>: the author, who must be able to decide how a document presents, and the user,
            whose eyes have to decode it. Some argued style needed a full programming language; CSS
            chose a simple, declarative format instead.</>}>
    <p className="paragraph">The fight over style was really a fight over who decides. Håkon Lie’s 1994
    proposal named both parties and promised each a prize: readers get{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“a richer visual (or auditory and tactile) environment”</a> while
    keeping control, authors get{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“stylistic influence without resorting to page description languages”</a>.
    Lie and Bos remember that giving both a say was itself{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“novel”</a>.</p>
    <p className="paragraph">The first cascade settled their conflicts with arithmetic. Every declaration
    carried a percentage of influence, the user’s sheet claimed its share first, and the
    browser averaged what remained:</p>
    <pre className="period-markup"><code>{'h1.font.size = 24pt 100%\nh2.font.size = 20pt 40%'}</code></pre>
    <p className="paragraph">Forty percent left sixty for sheets later in the cascade. Lie named the open
    problem himself: nobody knew{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“how to mix 40% helvetica and 60% times”</a>. And his own example
    sheet includes the comment:{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“# first, redefine influence to dictatorship.”</a></p>
    <p className="paragraph">The draft even drew the settlement as an interface: a fictitious screenshot,
    in ASCII, of sliders between user and author:</p>
    <pre className="period-markup"><code>{'        User            Author\n Font   o-----x--------------o 64%\n Color  o-x------------------o 90%\n Margin o-------------x------o 37%\n Volume o---------x----------o 50%'}</code></pre>
    <p className="paragraph">The weighting ran all the way up: whole style sheets could carry percentages
    against each other, so a reader could take most of one newspaper’s look and a little
    of another’s:</p>
    <pre className="period-markup"><code>{'http://NYT.com/style 30%\nhttp://LeMonde.com/style 70%'}</code></pre>
    <p className="paragraph">Properties could be computed from other properties, arithmetic the platform
    would wait almost two decades to offer again as calc():</p>
    <pre className="period-markup"><code>{'h1.font.size = font.size * 3\nspace.first = space.left + 0.5cm'}</code></pre>
    <p className="paragraph">The draft imagined rules that read the world outside the document. A page could
    yellow with age like paper, a tall display could earn a different newspaper’s style
    sheet, and a headline could grow when an agent judged the story relevant to you, an
    idea Lie carried from his work on personalized newspapers at the MIT Media Lab:</p>
    <pre className="period-markup"><code>{'AGE > 3d ? background.color = pale_yellow : background.color = white\nDISPLAY_HEIGHT > 30cm ? http://NYT.com/style : http://LeMonde.fr/style\nRELEVANCE > 80 ? h1.font.size *= 1.5'}</code></pre>
    <p className="paragraph">The conditionals were cut, though the display-size test reads today like a media
    query twenty years early.</p>
    <p className="paragraph">And the screen was only{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“the primary presentation target”</a>. The proposal named the
    others, <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“paper, speech and braille”</a>, and styled speech with
    volume in decibels:</p>
    <pre className="period-markup"><code>{'speech.*.weight = 35db\nspeech.em.weight = 40db'}</code></pre>
    <p className="paragraph">The emphasis you hear instead of see was already there in 1994; CSS2 made it
    official four years later.</p>
    <p className="paragraph">By the Darmstadt conference in April 1995 the discussion was openly political.
    Nine style-sheet proposals had been{' '}
    <a className="signpost" href="http://www.css-class.com/a-brief-history-of-css/">submitted in all</a>, and Lie and Bos, who{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">met in person there for the first time</a>, each arrived with an
    implementation to show. Authors argued they had to control presentation, down to
    warning labels with legal requirements behind them; the other side held that the
    user, <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“whose eyes and ears ultimately have to decode the presentation”</a>,
    should win a conflict. A third camp pushed from the opposite direction: style needed
    a full programming language, and one rival,{' '}
    <a className="signpost" href="https://thehistoryoftheweb.com/look-back-history-css/">PSL96</a>, had the functions and conditional statements to prove
    it meant it. The draft had already answered: style sheets are{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“declarations of constraints”</a>, not programs, declarative
    on purpose, which is why a stylesheet from 1996 still parses today.</p>
    <p className="paragraph">The W3C became operational in 1995 and hired both authors of the proposal onto
    its technical staff, based at its European site in Sophia-Antipolis; the www-style
    mailing list opened in May and held four thousand messages within three years. When
    the consortium gathered the field for a style-sheet workshop, it passed over its own
    offices because Paris{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“is better served by international flights”</a>. Thomas Reardon
    of Microsoft pledged CSS support there, and Lie and Bos call the workshop{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“a milestone in ensuring style sheets their rightful place on the Web”</a>.</p>
    <p className="paragraph">At the end of 1995 the W3C formed the HTML Editorial Review Board to ratify
    specifications, Lou Montulli of Netscape among its members, and took CSS as a work
    item. After battles Lie and Bos describe as{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“long and hard”</a>, CSS1 became a Recommendation in December
    1996, the percentages gone, traded for specificity. In February 1997 CSS got its own
    working group, chaired by Chris Lilley, recruited to the W3C from the University of
    Manchester.</p>
  </Moment>;
