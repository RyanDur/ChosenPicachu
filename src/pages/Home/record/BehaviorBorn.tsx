import {FC} from 'react';
import {Moment} from './Moment';

export const BehaviorBorn: FC = () =>
  <Moment year="1995"
          title="Behavior is born to serve"
          tells={<>Brendan Eich{' '}
            <a className="signpost" href="https://auth0.com/blog/a-brief-history-of-javascript/">wrote the
            interpreter in about ten days</a>, for{' '}
            <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">a
            complementary scripting language</a> that could{' '}
            <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">“touch
            elements of the page, change their properties, and respond to events”</a>. Smarts for
            documents, usable by amateurs, not an application platform.</>}>
            <p className="paragraph">Eich joined Netscape in April 1995 to put{' '}
    <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">“the Scheme programming language, or something like it”</a> into the
    browser. <a className="signpost" href="https://brendaneich.com/2008/04/popularity/">“Scheme was the bait”</a>, in his words. Then management
    ruled that whatever he built{' '}
    <a className="signpost" href="https://brendaneich.com/2008/04/popularity/">“must ‘look like Java’”</a>, which eliminated Perl, Python, Tcl, and
    Scheme itself in one stroke. The deeper debate inside Netscape was why a second
    language at all, and the answer was two audiences: Java for component authors, and a
    language for everyone else, written{' '}
    <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">“directly in source form as part of the Web page markup”</a>.</p>
    <p className="paragraph">The ten days in May bought the interpreter and its built-in objects, except
    Date, which Ken Smith produced by translating java.util.Date to C, inheriting{' '}
    <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">its Y2K bugs</a> in the bargain. Eich spent the rest of 1995 embedding
    the engine and inventing what became DOM level 0, the lone JavaScript developer at
    Netscape until mid-1996. His accounting of the parentage is precise:{' '}
    <a className="signpost" href="https://brendaneich.com/2008/04/popularity/">“Scheme-ish first-class functions and Self-ish (albeit singular) prototypes”</a>,
    with the Java leakage, in his word, unfortunate.</p>
    <p className="paragraph">The name took longer than the language. Mocha was Andreessen’s internal code name
    and never shipped publicly; marketing’s{' '}
    <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">“‘live’ meme”</a> put LiveScript on the betas; and in early December
    1995 Netscape and Sun signed a license agreement and Navigator 2.0B3 shipped it as
    JavaScript; in Eich’s description,{' '}
    <a className="signpost" href="https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html">“a little brother to Java, as a complementary language like Visual Basic was to C++”</a>.
    The audience was never in doubt:{' '}
    <a className="signpost" href="https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html">“Web designers, people who may or may not have much programming training”</a>,
    writing snippets they could learn as they went: a language, Eich liked to say, you
    could <a className="signpost" href="https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html">buy by the yard</a>. Jeremy Keith’s summary of the family
    relationship stands: Java is to JavaScript as ham is to hamster.</p>
    <p className="paragraph">He never romanticized it. Years later he counted himself among those who curse
    it, calling it <a className="signpost" href="https://brendaneich.com/2008/04/popularity/">“a quickie love-child of C and Self”</a> and reaching
    for Dr. Johnson: <a className="signpost" href="https://brendaneich.com/2008/04/popularity/">“the part that is good is not original, and the part that is original is not good.”</a>
    And yet: <a className="signpost" href="https://brendaneich.com/2008/04/popularity/">“JS beat Java on the client.”</a> The complementary language
    outlived the thing it was built to complement.</p>
  </Moment>;
