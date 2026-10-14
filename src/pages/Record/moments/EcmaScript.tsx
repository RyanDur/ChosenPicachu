import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const EcmaScript: FC = () =>
  <Moment of={moments.ecmaScript}
    tells={<>Microsoft shipped its own JavaScript, JScript, in Internet Explorer 3 in August 1996, and the two dialects
      differed enough that pages worked in one browser and not the other. Netscape took the language to Ecma that
      November. The first edition of the standard, named ECMAScript, was adopted in June 1997.</>}>
    <p className="paragraph muted-ink hyphenated">JavaScript had shipped in Navigator 2.0 and Microsoft answered in kind: <a className="signpost" href="https://en.wikipedia.org/wiki/JScript">“JScript was first supported in the Internet Explorer 3.0 browser released in August 1996”</a>.
      The two were the same idea written twice, and <a className="signpost" href="https://en.wikipedia.org/wiki/JavaScript">“These differences made it difficult for developers to make their websites work well in both browsers”</a>.
      Netscape’s answer was a standards body that was not the W3C: <a className="signpost" href="https://en.wikipedia.org/wiki/JavaScript">“In November 1996, Netscape submitted JavaScript to Ecma International”</a>,
      and <a className="signpost" href="https://en.wikipedia.org/wiki/JavaScript">“This led to the official release of the first ECMAScript language specification in June 1997”</a>.
      Ecma is a standards organisation for computing; ECMA-262 is the number it gave the language.</p>
    <p className="paragraph muted-ink hyphenated">The specification tells its own origin. It is based on several technologies, <a className="signpost" href="https://262.ecma-international.org/5.1/">“the most well known being JavaScript (Netscape) and JScript (Microsoft)”</a>; <a className="signpost" href="https://262.ecma-international.org/5.1/">“The development of this Standard started in November 1996”</a>,
      and the first edition was <a className="signpost" href="https://262.ecma-international.org/5.1/">“adopted by the Ecma General Assembly of June 1997”</a>.
      Ecma’s own list gives the <a className="signpost" href="https://ecma-international.org/publications-and-standards/standards/ecma-262/">1st edition as June 1997</a>,
      the second as August 1998, and the third as December 1999, the edition that <a className="signpost" href="https://262.ecma-international.org/5.1/">“introduced powerful regular expressions, better string handling, new control statements”</a>.</p>
    <p className="paragraph muted-ink hyphenated">The third edition is the JavaScript the web ran on for a decade. The standard had written the practice down
      so two browsers could agree on it, as HTML 2.0 had for markup. It then stood still for ten years, which is the
      2009 moment.</p>
  </Moment>;
