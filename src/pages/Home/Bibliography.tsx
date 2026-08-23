import {FC} from 'react';

export const Bibliography: FC = () =>
  <section className="bibliography" aria-labelledby="the-research">
    <details className="shelves">
      <summary className="prompt"><h2 className="research-title" id="the-research">The research</h2></summary>
      <section className="shelf" aria-label="the web research">
        <h3 className="shelf-title">The web</h3>
        <ul className="works">
          <li className="work">
            <a className="signpost" href="https://www.w3.org/History/1989/proposal.html">Information Management: A Proposal</a>
            <span className="provenance caption">Tim Berners-Lee, CERN, 1989</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html">WorldWideWeb: Proposal for a HyperText Project</a>
            <span className="provenance caption">Tim Berners-Lee and Robert Cailliau, 1990</span>
          </li>
          <li className="work">
            <a className="signpost" href="http://info.cern.ch/hypertext/WWW/MarkUp/Tags.html">The original HTML tags</a>
            <span className="provenance caption">info.cern.ch, as preserved in 1992</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/Protocols/HTTP/AsImplemented.html">The Original HTTP as defined in 1991</a>
            <span className="provenance caption">w3.org</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://worldwideweb.cern.ch/browser/">The WorldWideWeb browser, rebuilt</a>
            <span className="provenance caption">CERN, 2019</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://worldwideweb.cern.ch/history/">A short history of the browser</a>
            <span className="provenance caption">CERN, 2019</span>
          </li>
        </ul>
      </section>
      <section className="shelf" aria-label="structure research">
        <h3 className="shelf-title">Structure</h3>
        <ul className="works">
          <li className="work">
            <a className="signpost" href="https://html.com/html5/">HTML5 Basics</a>
            <span className="provenance caption">html.com</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://html.com/deprecated/">Deprecated HTML features</a>
            <span className="provenance caption">html.com</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.infoq.com/news/2011/05/html5-design/">Jeremy Keith on the Design Principles of HTML5</a>
            <span className="provenance caption">InfoQ, 2011</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.smashingmagazine.com/2020/01/html5-article-section/">Why You Should Choose HTML5 article Over section</a>
            <span className="provenance caption">Bruce Lawson, Smashing Magazine, 2020</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://whatwg.org/position-paper">Position Paper for the W3C Workshop on Web Applications and Compound Documents</a>
            <span className="provenance caption">Mozilla and Opera, June 2004; the rejected proposal, preserved by the WHATWG</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://html.spec.whatwg.org/multipage/introduction.html">The HTML Standard’s own history</a>
            <span className="provenance caption">the WHATWG, in the specification’s introduction</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://whatwg.org/faq">The WHATWG FAQ</a>
            <span className="provenance caption">the WHATWG</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">HTML Design Principles</a>
            <span className="provenance caption">Anne van Kesteren and Maciej Stachowiak, W3C, 2007</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">ARIA</a>
            <span className="provenance caption">MDN</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element">The div element</a>
            <span className="provenance caption">the HTML Standard, WHATWG</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://webaim.org/projects/screenreadersurvey10/">Screen Reader User Survey #10</a>
            <span className="provenance caption">WebAIM, 2024</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://webaim.org/projects/million/">The WebAIM Million</a>
            <span className="provenance caption">WebAIM</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html">HTML and CSS</a>
            <span className="provenance caption">the W3C; the definitions survive only in the archive</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security">Website security</a>
            <span className="provenance caption">MDN</span>
          </li>
        </ul>
      </section>
      <section className="shelf" aria-label="presentation research">
        <h3 className="shelf-title">Presentation</h3>
        <ul className="works">
          <li className="work">
            <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">Cascading HTML style sheets: a proposal</a>
            <span className="provenance caption">Håkon Wium Lie, 10 October 1994</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">The CSS Saga</a>
            <span className="provenance caption">Håkon Wium Lie and Bert Bos, from Cascading Style Sheets: Designing for the Web, 1999</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm">The Box Acid Test</a>
            <span className="provenance caption">Todd Fahrner, in the W3C CSS1 Test Suite</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/Style/CSS/Test/CSS1/current/tsack.html">CSS1 Test Suite Acknowledgments</a>
            <span className="provenance caption">the W3C; the credits name the testers</span>
          </li>
          <li className="work">
            <a className="signpost" href="http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html">Sorry, you’re screwed</a>
            <span className="provenance caption">Marc Andreessen on www-talk, February 1994</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://thehistoryoftheweb.com/the-rise-of-css/">The Rise of CSS</a>
            <span className="provenance caption">Jay Hoffmann, The History of the Web, 2017</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://thehistoryoftheweb.com/look-back-history-css/">A Look Back at the History of CSS</a>
            <span className="provenance caption">Jay Hoffmann, The History of the Web, 2017</span>
          </li>
          <li className="work">
            <a className="signpost" href="http://csszengarden.com/">CSS Zen Garden</a>
            <span className="provenance caption">Dave Shea, 2003</span>
          </li>
          <li className="work">
            <a className="signpost" href="http://www.css-class.com/a-brief-history-of-css/">A Brief History of CSS</a>
            <span className="provenance caption">css-class.com</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://simplecss.eu/css-history-brief-overview.html">CSS History, A Brief Overview</a>
            <span className="provenance caption">simplecss.eu</span>
          </li>
          <li className="work">
            <a className="signpost" href="http://www.zerobugsandprogramfaster.net/essays/2.html">A tinge of guilt</a>
            <span className="provenance caption">zerobugsandprogramfaster.net</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.webdesignmuseum.org/">The Web Design Museum</a>
            <span className="provenance caption">webdesignmuseum.org</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/Style/CSS/Overview.en.html">Cascading Style Sheets home page</a>
            <span className="provenance caption">the W3C</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/TR/css-2023/">CSS Snapshot 2023</a>
            <span className="provenance caption">the CSS working group, W3C, 2023</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes">Pseudo-classes</a>
            <span className="provenance caption">MDN</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion">prefers-reduced-motion</a>
            <span className="provenance caption">MDN</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">Understanding Meaningful Sequence</a>
            <span className="provenance caption">W3C WAI</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select">Customizable select elements</a>
            <span className="provenance caption">MDN</span>
          </li>
        </ul>
      </section>
      <section className="shelf" aria-label="dynamic interaction research">
        <h3 className="shelf-title">Dynamic Interaction</h3>
        <ul className="works">
          <li className="work">
            <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">The A-Z of Programming Languages: JavaScript</a>
            <span className="provenance caption">Brendan Eich, interviewed by Naomi Hamilton, Computerworld, 2008</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html">JavaScript creator ponders past, future</a>
            <span className="provenance caption">Brendan Eich, interviewed by Paul Krill, InfoWorld, 2008</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://brendaneich.com/2008/04/popularity/">Popularity</a>
            <span className="provenance caption">Brendan Eich, 2008</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://auth0.com/blog/a-brief-history-of-javascript/">A Brief History of JavaScript</a>
            <span className="provenance caption">Sebastian Peyrott, Auth0, 2017</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://medium.com/@benastontweet/lesson-1a-the-history-of-javascript-8c1ce3bffb17">A brief history of JavaScript</a>
            <span className="provenance caption">Ben Aston, 2015</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.coursereport.com/blog/history-of-javascript">JavaScript: A History for Beginners</a>
            <span className="provenance caption">Course Report</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://en.wikibooks.org/wiki/JavaScript/History_of_JavaScript">History of JavaScript</a>
            <span className="provenance caption">Wikibooks</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php">Ajax: A New Approach to Web Applications</a>
            <span className="provenance caption">Jesse James Garrett, Adaptive Path, 18 February 2005; archived</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://en.wikipedia.org/wiki/Brendan_Eich">Brendan Eich</a>
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://en.wikipedia.org/wiki/Prototype-based_programming">Prototype-based programming</a>
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://tc39.es/process-document/">The TC39 Process</a>
            <span className="provenance caption">TC39, Ecma International</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">Understanding Success Criterion 2.1.1: Keyboard</a>
            <span className="provenance caption">W3C WAI</span>
          </li>
        </ul>
      </section>
      <section className="shelf" aria-label="the concert research">
        <h3 className="shelf-title">The concert</h3>
        <ul className="works">
          <li className="work">
            <a className="signpost" href="https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html">React: CSS in JS</a>
            <span className="provenance caption">Christopher Chedeau, NationJS, 2014</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM">Using shadow DOM</a>
            <span className="provenance caption">MDN</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://html.spec.whatwg.org/multipage/custom-elements.html">Custom elements</a>
            <span className="provenance caption">the HTML Standard, WHATWG</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://jasonformat.com/islands-architecture/">Islands Architecture</a>
            <span className="provenance caption">Jason Miller, 2020</span>
          </li>
          <li className="work">
            <a className="signpost" href="https://web.dev/rendering-on-the-web/">Rendering on the Web</a>
            <span className="provenance caption">Jason Miller and Addy Osmani, web.dev, 2019</span>
          </li>
        </ul>
      </section>
    </details>
  </section>;
