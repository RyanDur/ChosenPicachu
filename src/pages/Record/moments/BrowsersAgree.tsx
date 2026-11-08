import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from '../calendar';

const css2 = 'https://www.w3.org/TR/1998/REC-CSS2-19980512/';
const css1TestSuiteAcknowledgments = 'https://www.w3.org/Style/CSS/Test/CSS1/current/tsack.html';
const boxAcidTest = 'https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm';
const cssSaga = 'https://www.w3.org/Style/LieBos2e/history/Overview.html';
const cssLookBack = 'https://thehistoryoftheweb.com/look-back-history-css/';
const ieForMac = 'https://en.wikipedia.org/wiki/Internet_Explorer_for_Mac';

export const BrowsersAgree: FC = () =>
  <Moment heading={moments.headings.browsersAgree}
    summary={<>In 1998 the standards were ahead of every browser. Todd Fahrner wrote a
      page, <a className="signpost" href={boxAcidTest}>The Box Acid Test</a>, that a correct CSS1 browser renders to the pixel,
      and no browser that year did. The browsers took a decade to catch up, pushed by tests, hacks and failures named
      in public.</>}>
    <p className="paragraph muted-ink hyphenated">The specifications were ahead of every browser. CSS2 became a
      Recommendation on 12 May 1998, edited by Bos and Lie. Its abstract lists what it
      added: <a className="signpost" href={css2}>“media-specific style sheets so that authors may tailor the
        presentation of their documents to visual browsers, aural devices, printers, braille devices, handheld
        devices”</a>, and <a className="signpost" href={css2}>“content positioning, downloadable fonts, table layout,
          features for internationalization, automatic counters and numbering”</a>. With them came z-index,
      bidirectional text and aural style sheets: presentation for ears as well as eyes.</p>
    <p className="paragraph muted-ink hyphenated">The browsers were measured by tests. The CSS1 Test Suite was a joint
      effort of the W3C, NIST and Case Western Reserve University, and its credits say how it came about. Eric
      Meyer <a className="signpost" href={css1TestSuiteAcknowledgments}>“had created his own private test suite in order to create a set of
        compatibility charts for the Internet community’s reference”</a>. Håkon
      Lie <a className="signpost" href={css1TestSuiteAcknowledgments}>“checked each page for correctness and completeness”</a>. Tim
      Boland of NIST went <a className="signpost" href={css1TestSuiteAcknowledgments}>“to the effort of identifying more than five
        hundred testable statements in the CSS1 specification”</a>. It opened for public comment in late April
      1998, moved to the W3C’s server in May, and was declared complete with the revised CSS1 specification on
      17 December 1998. The credits also name L. David Baron, Ian Hickson and the CSS Samurai of the Web
      Standards Project, and one line thanks <a className="signpost" href={css1TestSuiteAcknowledgments}>“Chris Wilson of
        Microsoft, who prodded us into actually finishing the Test Suite”</a>: the same Chris Wilson whose IE3
      team had shipped with little of the box model. Opera 3.5 earned the era’s driest compliment from Lie
      and Bos: its developers <a className="signpost" href={cssSaga}>“found the time to test their
        implementation before shipping it”</a>.</p>
    <p className="paragraph muted-ink hyphenated">Inside that suite sits Todd Fahrner’s box model “acid test”, Test
      5.5.26c: a deliberately nonsensical page, T.S. Eliot fragments and radio buttons labeled bang and whimper, because
      only the boxes were under test. Its style sheet shows its work so no vendor could
      argue: <a className="signpost" href={boxAcidTest}>“width: 10.638%; /* refers to parent element’s width of 47em. = 5em or
        50px */”</a>. The page says what passing means: <a className="signpost" href={boxAcidTest}>“All 100%-conformant CSS1
          agents should be able to render the document elements above this paragraph indistinguishably (to the pixel)
          from this reference rendering”</a>. Its last line is the whole era in one
      sentence: <a className="signpost" href={boxAcidTest}>“All discrepancies should be traceable to CSS1 implementation
        shortcomings.”</a></p>
    <p className="paragraph muted-ink hyphenated">None of 1998’s browsers managed that. Lie and Bos record that Internet
      Explorer 4 <a className="signpost" href={cssSaga}>“does not fully support CSS1”</a>, that in Navigator
      4 <a className="signpost" href={cssSaga}>“many CSS properties cannot be used”</a>, and that Opera
      3.5 <a className="signpost" href={cssSaga}>“supports most of CSS1”</a>. The Web Standards Project turned the
      tests into scoreboards: in November 1998 it published <a className="signpost" href={cssSaga}>“IE’s Top 10 CSS
        Problems”</a>, naming failures in public. Tantek Çelik’s doctype switch, worked out after a conversation
      with Fahrner, let a browser keep its old bugs for old pages and render new pages by the book. Eric
      Meyer, Hoffmann writes, <a className="signpost" href={cssLookBack}>“has gone on record and said doctype
        switching saved CSS”</a>. Çelik’s own team shipped Internet Explorer 5 for the Macintosh
      on <a className="signpost" href={ieForMac}>27 March 2000</a>, on a new
      engine, <a className="signpost" href={ieForMac}>Tasman</a>; Hoffmann calls
      it <a className="signpost" href={cssLookBack}>“the first browser with full CSS Level 1 support”</a>.
      Lie and Bos had predicted CSS3 <a className="signpost" href={cssSaga}>“towards the end of
        1999”</a>; the buggy parts of level 2 alone took until 2011 to become CSS 2.1, and a large
      publisher betting its pages on CSS is the 2002 moment.</p>
  </Moment>;
