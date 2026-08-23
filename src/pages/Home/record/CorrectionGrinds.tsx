import {FC} from 'react';
import {Moment} from './Moment';

export const CorrectionGrinds: FC = () =>
  <Moment year="1998"
          title="The tests teach the browsers"
          tells={<>The specifications ran ahead of the browsers, and{' '}
            <a className="signpost" href="https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm">the Acid
            Test</a> drew the line pixel by pixel; in the beginning, most browsers failed it. The
            catching-up was not a release. It was a decade of feedback: tests, hacks, and public
            scoreboards.</>}>
            <p className="paragraph">The specifications were ahead of everyone. CSS1 had shipped into a market where
    Internet Explorer 3, the first commercial browser to try CSS at all, had implemented
    it against a spec still being changed underneath, handling color and text{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“reliably”</a> and the box model barely at all. CSS2 followed in May
    1998 with z-index, media types, positioning, bidirectional text, and aural style
    sheets: presentation for ears as well as eyes.</p>
    <p className="paragraph">The feedback ran through tests. Eric Meyer’s private compatibility
    suite became the official CSS1 Test Suite; Tim Boland of NIST mined the specification
    for <a className="signpost" href="https://www.w3.org/Style/CSS/Test/CSS1/current/tsack.html">more than five hundred testable statements</a>; the credits
    list a young L. David Baron and a young Ian Hickson, and one line lands with special
    irony: <a className="signpost" href="https://www.w3.org/Style/CSS/Test/CSS1/current/tsack.html">“Chris Wilson of Microsoft, who prodded us into actually finishing the Test Suite”</a>:
    the same Chris Wilson whose IE3 team had shipped without a box model. Opera 3.5
    earned the era’s driest compliment from Lie and Bos: its developers{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“found the time to test their implementation before shipping it”</a>.</p>
    <p className="paragraph">Inside that suite sits Todd Fahrner’s box model “acid test”: a deliberately
    nonsensical page, T.S. Eliot fragments and radio buttons labelled bang and whimper,
    because only the boxes were under test. Its stylesheet shows its work so no vendor
    could argue: <a className="signpost" href="https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm">“width: 10.638%; /* refers to parent element’s width of 47em. = 5em or 50px */”</a>.
    And its pass condition is the whole era in one sentence:{' '}
    <a className="signpost" href="https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm">“All discrepancies should be traceable to CSS1 implementation shortcomings.”</a></p>
    <p className="paragraph">The Web Standards Project turned the tests into scoreboards, the CSS Samurai’s
    “Top 10 CSS Problems” reports naming failures in public, and Tantek Çelik’s doctype
    switch let browsers keep old bugs for old pages while rendering new pages by the book;
    Eric Meyer has said doctype switching{' '}
    <a className="signpost" href="https://thehistoryoftheweb.com/look-back-history-css/">saved CSS</a>. The summit came in March 2000, when IE for Mac passed
    better than 99% of CSS1, and in September 2002 Douglas Bowman’s team relaunched Wired
    News on standards-compliant HTML and CSS; Hoffmann records, with audible pride, that{' '}
    <a className="signpost" href="https://thehistoryoftheweb.com/look-back-history-css/">“the site even validated”</a>. Lie and Bos had predicted{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">CSS3 “towards the end of 1999”</a>; the buggy parts of level 2 alone
    took until 2011 to become CSS 2.1.</p>
  </Moment>;
