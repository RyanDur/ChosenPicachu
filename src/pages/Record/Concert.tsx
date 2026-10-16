import {FC} from 'react';
import {Link} from 'react-router';
import {moments} from './moments/moments';

export const Concert: FC = () =>
  <section className="concert trim-rule-above" aria-labelledby="the-concert">
    <h2 className="record-title title" id="the-concert">The concert</h2>
    <p className="paragraph muted-ink hyphenated">In 2007 the W3C wrote down how HTML should grow. One line of the <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">HTML Design Principles</a> is
      the rule this whole record obeys: <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“When a practice is already widespread among authors, consider adopting it rather than forbidding it or inventing something new.”</a> Another
      says the same about technology: <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“If there is already a widely used and implemented technology covering particular use cases”</a>,
      then <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“consider specifying that technology in preference to inventing something new for the same purpose.”</a> The
      principles were written late. The web had worked by them since 1994, and the moments above show how: when one
      language could not yet do a job, another did it, and the standard later adopted what had spread.</p>
    <p className="paragraph muted-ink hyphenated">The first language to cover for the others was HTML. Browsers invented tags faster than any specification could
      define them, and the first HTML standard, <a className="signpost" href="https://www.rfc-editor.org/rfc/rfc1866">RFC 1866</a> in
      November 1995, wrote down <a className="signpost" href="https://www.rfc-editor.org/rfc/rfc1866">“a set of features that roughly corresponds to the capabilities of HTML in common use prior to June 1994”</a>.
      Among those features was presentation. Markup carried fonts, colours and columns because nothing else could,
      FONT FACE and BGCOLOR being the tags Raggett names as ones <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“which control stylistic aspects of a document”</a>,
      and it kept carrying them until CSS 1 was finished in December 1996 and the browsers caught up with it over the
      years that followed. The principles name what that separation was for: <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“HTML should allow separation of content and presentation.”</a> HTML
      allowed it once there was a language to separate presentation into.</p>
    <p className="paragraph muted-ink hyphenated">Script covered for style twice. The first time was Netscape 4, which ran CSS as script, as <Link className="signpost" to={`#${moments.needOutrunsStandards.id}`}>the 1996 moment</Link> tells,
      and, in Lie and Bos’s words, <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“also decided to let developers write JSSS, thereby bypassing CSS entirely”</a>.
      JavaScript Style Sheets did not survive the browser. The second time was 2014, when Christopher Chedeau listed
      Facebook’s <a className="signpost" href="https://speakerdeck.com/vjeux/react-css-in-js">“Problems with CSS at scale 1. Global Namespace 2. Dependencies 3. Dead Code Elimination 4. Minification”</a> and <a className="signpost" href="https://speakerdeck.com/vjeux/react-css-in-js">“5. Sharing Constants 6. Non-deterministic Resolution 7. Isolation”</a>,
      and proposed writing styles in script, where <a className="signpost" href="https://speakerdeck.com/vjeux/react-css-in-js">“All your styles are local JS variables and you can export them if you want to”</a>.
      He was careful about what he was claiming: <a className="signpost" href="https://speakerdeck.com/vjeux/react-css-in-js">“My goal with this talk is not to convince you that you should drop CSS and use JS instead.”</a> The
      seven problems were real, and the platform answered the largest of them, isolation, in its own language. Shadow
      DOM, in MDN’s words, <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM">“enables you to attach a DOM tree to an element, and have the internals of this tree hidden from JavaScript and CSS running in the page”</a>,
      so that <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM">“just as page styles don’t affect elements in the shadow DOM, shadow DOM styles don’t affect elements in the rest of the page.”</a> The
      browsers had been doing this for themselves all along: <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM">“Before shadow DOM was made available to web developers, browsers were already using it to encapsulate the inner structure of an element.”</a> A
      video element’s controls live there.</p>
    <p className="paragraph muted-ink hyphenated">Script covered for structure too. When interfaces became applications, builders needed components,
      self-contained pieces carrying structure, style and behaviour together, and in 2013 script built them because
      markup had no such thing. The HTML Standard’s answer is custom elements, which <a className="signpost" href="https://html.spec.whatwg.org/multipage/custom-elements.html">“provide a way for authors to build their own fully-featured DOM elements”</a>.
      The one rule on their names is that a custom element’s name contains a hyphen, which <a className="signpost" href="https://html.spec.whatwg.org/multipage/custom-elements.html">“is used for namespacing and to ensure forward compatibility”</a>:
      a built-in element can never be called my-menu, so a page’s own elements and the platform’s cannot collide. The
      standard describes the feature as part of an effort to <a className="signpost" href="https://html.spec.whatwg.org/multipage/custom-elements.html">“rationalise the platform”</a>,
      explaining the built-in elements in terms of the same low-level parts an author can now use.</p>
    <p className="paragraph muted-ink hyphenated">Script covered for the document last. The single-page application moved the document itself into script: the
      server sent an empty body and a program, and the page existed only once the program had run. The cost arrived
      with scale. Miller and Osmani’s survey of rendering puts it in one line: <a className="signpost" href="https://web.dev/rendering-on-the-web/">“the amount of JavaScript required tends to grow as an application grows.”</a> The
      way back was the oldest technique on the record, server rendering, <a className="signpost" href="https://web.dev/rendering-on-the-web/">“Rendering an app on the server to send HTML, rather than JavaScript, to the client”</a>,
      refined into islands. The pattern, which <a className="signpost" href="https://jasonformat.com/islands-architecture/">“was coined by Etsy’s frontend architect Katie Sylor-Miller”</a>,
      is to <a className="signpost" href="https://jasonformat.com/islands-architecture/">“render HTML pages on the server, and inject placeholders or slots around highly dynamic regions”</a>,
      so that <a className="signpost" href="https://jasonformat.com/islands-architecture/">“individual regions of the page become interactive without anything else on the page needing to be loaded first.”</a> The
      survey’s advice agrees: <a className="signpost" href="https://web.dev/rendering-on-the-web/">“It’s fine to mostly ship HTML with minimal JavaScript to get an experience interactive.”</a></p>
    <p className="paragraph muted-ink hyphenated">Read together, the moments are one method. A need arrives that the right language cannot yet meet. The language
      that can, usually script, meets it first, and the result is useful and costly: a page that cannot be read
      without a program, styles that cannot be found in a stylesheet. The platform then learns the answer in the
      language it belonged to, and the cover can be put down. The principles even say in what order the people
      involved count when that choice is hard: <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“consider users over authors over implementors over specifiers over theoretical purity.”</a></p>
  </section>;
