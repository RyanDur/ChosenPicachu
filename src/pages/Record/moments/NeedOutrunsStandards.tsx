import {FC} from 'react';
import {Moment} from './Moment';
import {PeriodSample} from './PeriodSample';
import {moments} from '../calendar';

const cssLookBack = 'https://thehistoryoftheweb.com/look-back-history-css/';
const riseOfCss = 'https://thehistoryoftheweb.com/the-rise-of-css/';
const cssSaga = 'https://www.w3.org/Style/LieBos2e/history/Overview.html';
const raggettHtmlHistory = 'https://www.w3.org/People/Raggett/book4/ch02.html';
const html32Recommendation = 'https://www.w3.org/TR/REC-html32';
const infoworldInterview = 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html';
const computerworldInterview = 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html';

export const NeedOutrunsStandards: FC = () =>
  <Moment heading={moments.headings.needOutrunsStandards}
    summary={<>Markup carried presentation for years because nothing else could, columns and fonts written as tags, and
      in the chaotic years of mixed browser support <a className="signpost" href={riseOfCss}>designers leaned on tables
        and spacer gifs</a>: vendor tags on every side, and in Navigator 4, which came the next year, CSS
      itself <a className="signpost" href={cssSaga}>run as JavaScript</a>. The same page looked one way in one browser
      and another in the other.</>}>
    <p className="paragraph muted-ink hyphenated">The markup of the time said it plainly:</p>
    <PeriodSample name="Netscape’s markup of 1996: columns and a font as tags">{'<MULTICOL COLS="3" GUTTER="25">\n  <P><FONT SIZE="4" COLOR="RED">This would be some font broken up into columns</FONT></P>\n</MULTICOL>'}</PeriodSample>
    <p className="paragraph muted-ink hyphenated">Layout and paint, written as structure. Netscape, Hoffmann
      writes, <a className="signpost" href={cssLookBack}>“simply extended HTML to include presentational, unstandardized HTML
        tags that could be used to design web pages”</a>, and <a className="signpost" href={cssLookBack}>“it wasn’t long before
          web pages lost all semantic value”</a>. While CSS was still a draft
      it <a className="signpost" href={cssLookBack}>“pressed on with presentational HTML elements like multicol, layer,
        and the dreaded blink tag”</a>. Center had shipped in the first Mozilla beta, three days after Lie’s
      draft, and FONT made it into <a className="signpost" href={html32Recommendation}>HTML 3.2</a> itself, the
      W3C’s Recommendation of January 1997. Raggett records the end of two of
      them: <a className="signpost" href={raggettHtmlHistory}>“The BLINK tag was ousted in an HTML ERB meeting.
        Netscape would only abolish it if Microsoft agreed to get rid of MARQUEE; the deal was struck and
        both tags disappeared.”</a></p>
    <p className="paragraph muted-ink hyphenated">Netscape <a className="signpost" href={cssSaga}>“had been sceptical
      towards style sheets”</a>. Lie and Bos read its first implementation, in Navigator
      4, <a className="signpost" href="https://en.wikipedia.org/wiki/Netscape_Communicator">released the next year, in
        June 1997</a>, as <a className="signpost" href={cssSaga}>“a half-hearted attempt to stop Microsoft from claiming
          to be more standards-compliant than themselves”</a>. It was a broad set of features its
      developers <a className="signpost" href={cssSaga}>“did not have time to fully test”</a>, run
      by <a className="signpost" href={cssSaga}>“translating CSS rules into snippets of Javascript”</a>. The
      company also let developers write JSSS, JavaScript Style
      Sheets, <a className="signpost" href={cssSaga}>“thereby bypassing CSS entirely”</a>; had it
      succeeded, <a className="signpost" href={cssSaga}>“the Web would have had one more style sheet than
        necessary”</a>.</p>
    <p className="paragraph muted-ink hyphenated">Designers stopped trusting CSS. The same page looked one way in
      Internet Explorer and another in Navigator. In <a className="signpost" href={riseOfCss}>“the chaotic years of mixed
        browser support, CSS became pretty unpopular among web designers”</a>,
      who <a className="signpost" href={riseOfCss}>“leaned on HTML data tables (or spacer gifs), which allowed them to
        lay things out to exact dimensions”</a>. Hoffmann’s verdict on the
      era: <a className="signpost" href={riseOfCss}>“at one time, not using CSS was actually a best
        practice.”</a></p>
    <p className="paragraph muted-ink hyphenated">JavaScript fought the same war under a different flag. Microsoft
      shipped its own JavaScript, JScript, in Internet Explorer 3 that August, under a different name
      because <a className="signpost" href={infoworldInterview}>“Microsoft couldn’t get a license from Sun”</a>, and the two
      dialects differed. Eich’s reading is that the browser war <a className="signpost" href={computerworldInterview}>“forced
        premature standardization after a furious period of innovation”</a>: Netscape took the language to Ecma in
      November 1996, and the standard got a name nobody owned, ECMAScript. The standard, and why that name, is the
      1997 moment.</p>
  </Moment>;
