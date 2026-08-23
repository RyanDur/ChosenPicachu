import {FC} from 'react';
import {Moment} from './Moment';

export const BrowsersTakePen: FC = () =>
  <Moment year="2004"
          title="The browsers take the pen"
          tells={<>Mozilla and Opera{' '}
            <a className="signpost" href="https://whatwg.org/position-paper">put a counter-proposal in writing</a>:
            evolve HTML, backwards compatible. The W3C voted it down and held course for XML
            replacements, so the browser makers founded the WHATWG and wrote the specification they
            were implementing. Consistency arrived when the implementors held the pen together.</>}>
            <p className="paragraph">At the June 2004 workshop, Mozilla and Opera proposed evolving HTML itself:
    web applications, built on what already worked, backwards compatible with the web as
    deployed. The membership voted it down, eight votes to fourteen; in the standard’s own
    retelling, because it{' '}
    <a className="signpost" href="https://html.spec.whatwg.org/multipage/introduction.html">“conflicted with the previously chosen direction”</a>, and the
    W3C{' '}
    <a className="signpost" href="https://html.spec.whatwg.org/multipage/introduction.html">“voted to continue developing XML-based replacements instead”</a>.</p>
    <p className="paragraph">Two days later the walkout had a name. Apple, Mozilla, and Opera{' '}
    <a className="signpost" href="https://html.spec.whatwg.org/multipage/introduction.html">“jointly announced their intent to continue working on the effort”</a>{' '}
    under a new venue, the WHATWG, founded over what its FAQ plainly calls the W3C’s{' '}
    <a className="signpost" href="https://whatwg.org/faq">“apparent disregard for the needs of real-world web developers”</a>.
    The draft they wrote, Web Applications 1.0, became HTML5, and the method was the
    point: the people writing the specification were the people shipping it, so the
    specification could not drift from the browsers, and the browsers converged on it
    together.</p>
    <p className="paragraph">The W3C{' '}
    <a className="signpost" href="https://html.spec.whatwg.org/multipage/introduction.html">“indicated an interest to participate in the development of HTML5 after all”</a>{' '}
    in 2006 and chartered a group to work with the WHATWG in 2007; the two split again in
    2011 over a finished HTML5 versus a{' '}
    <a className="signpost" href="https://whatwg.org/faq">Living Standard</a> that is{' '}
    <a className="signpost" href="https://whatwg.org/faq">“continuously updated”</a>; and in 2019 they signed an agreement on{' '}
    <a className="signpost" href="https://html.spec.whatwg.org/multipage/introduction.html">“a single version of HTML going forward”</a>. The posture from
    1994, the specification following the field, was no longer a habit. It was the
    constitution.</p>
  </Moment>;
