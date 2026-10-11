import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const CssOne: FC = () =>
  <Moment of={moments.cssOne}
    tells={<>Two years after Lie’s draft, CSS level 1 became a W3C Recommendation on 17 December 1996. The first browser to
      support it had shipped in August with most of the text properties and little of the box model. The standard was
      ahead of every browser, and would stay ahead for years.</>}>
    <p className="paragraph muted-ink hyphenated">The Recommendation is a short document. Its abstract says what the language is for in two sentences: <a className="signpost" href="https://www.w3.org/TR/REC-CSS1-961217">“This document specifies level 1 of the Cascading Style Sheet mechanism (CSS1)”</a>,
      and <a className="signpost" href="https://www.w3.org/TR/REC-CSS1-961217">“One of the fundamental features of CSS is that style sheets cascade”</a>,
      so that <a className="signpost" href="https://www.w3.org/TR/REC-CSS1-961217">“authors can attach a preferred style sheet, while the reader may have a personal style sheet”</a>.
      The author-and-reader settlement of 1994 is the first thing the standard states. A Recommendation is W3C’s final
      status for a specification, the point at which it asks the browsers to implement it.</p>
    <p className="paragraph muted-ink hyphenated">The browsers were partly there already. Lie and Bos record that <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“CSS level 1 finally emerged as a W3C Recommendation in December 1996”</a> after
      the arguments of the HTML Editorial Review Board, and that <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“The first commercial browser to support CSS was Microsoft’s Internet Explorer 3 which was released in August 1996”</a>,
      with most of the colour, background, font and text properties and little of the box model. <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“The next browser to announce support was Netscape’s Navigator, version 4.0”</a>,
      an implementation the authors call half-hearted, beside its own alternative: <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“The company also decided to let developers write JSSS, thereby bypassing CSS entirely”</a>.
      JSSS, JavaScript Style Sheets, wrote style as script; it did not survive Navigator 4.</p>
    <p className="paragraph muted-ink hyphenated">So the standard fixed the language and not the rendering. The same sheet produced different pages, and the next
      decade of CSS is the browsers catching up with a document that was finished in 1996. CSS level 2 followed as a
      Recommendation in May 1998, and the catching-up is the 1998 moment.</p>
  </Moment>;
