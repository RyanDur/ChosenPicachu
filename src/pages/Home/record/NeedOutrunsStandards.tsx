import {FC} from 'react';
import {Moment} from './Moment';

export const NeedOutrunsStandards: FC = () =>
  <Moment year="1996"
          title="The need outruns the standards"
          tells={<>Markup carried presentation for years because nothing else could, columns and fonts
            written as tags, and{' '}
            <a className="signpost" href="https://thehistoryoftheweb.com/the-rise-of-css/">the war multiplied
            the dialects</a>: vendor tags on every side, and CSS itself{' '}
            <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">run as
            JavaScript</a>. The same page looked broken in the other browser.</>}>
            <p className="paragraph">Mosaic-era markup said it plainly:</p>
    <pre className="period-markup"><code>{'<MULTICOL COLS="3" GUTTER="25">\n  <P><FONT SIZE="4" COLOR="RED">This would be some font broken up into columns</FONT></P>\n</MULTICOL>'}</code></pre>
    <p className="paragraph">Layout and paint, written as structure. Netscape extended
    HTML with presentational, unstandardized tags (multicol, layer, the dreaded blink)
    until, as Jay Hoffmann of The History of the Web puts it, pages{' '}
    <a className="signpost" href="https://thehistoryoftheweb.com/look-back-history-css/">“lost all semantic value”</a>. The font tag made it into HTML 3.2
    itself; center shipped in the very first Mozilla beta, three days after Lie’s
    draft.</p>
    <p className="paragraph">Netscape had been sceptical of style sheets, and Lie and Bos read its first
    implementation as{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“a half-hearted attempt to stop Microsoft from claiming to be more standards-compliant than themselves”</a>.
    Navigator 4 ran CSS by{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“translating CSS rules into snippets of Javascript”</a>, and offered
    JSSS so developers could bypass CSS entirely: style as script, shipped broad but
    untested, and had it succeeded the web would have carried{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“one more style sheet language than necessary”</a>.</p>
    <p className="paragraph">The war’s quieter effect was on trust: the same page looked one way in IE and
    another in Navigator, so designers covered with what was reliable: table layouts,
    spacer GIFs, and Flash. Hoffmann’s verdict on the era:{' '}
    <a className="signpost" href="https://thehistoryoftheweb.com/the-rise-of-css/">“at one time, not using CSS was actually a best practice.”</a></p>
    <p className="paragraph">JavaScript fought the same war under a different flag. It took off so fast its
    tools outpaced the Java applets it was meant to accompany, and Microsoft’s
    reverse-engineered JScript, a different name because the trademark was Sun’s to
    license, bred incompatibilities of its own. The war, Eich says,{' '}
    <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">“forced premature standardization”</a>: Ecma convened in November 1996,
    and the standard took a name nobody owned: ECMAScript, which even Eich concedes{' '}
    <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">“does sound a bit like eczema”</a>. Edition 1 came in 1997, Edition 2
    was pure paperwork, and Edition 3, in December 1999, brought regular expressions and exceptions,
    and became the baseline the web would stand on for a decade.</p>
  </Moment>;
