import {FC} from 'react';

export const Bibliography: FC = () =>
  <section className="bibliography" aria-labelledby="the-research">
    <details className="shelves">
      <summary className="prompt"><h2 className="research-title title" id="the-research">The research</h2></summary>
      <section className="shelf" aria-label="the web research">
        <h3 className="shelf-title sub-title">The web</h3>
        <ul className="works">
          <li>
            <a className="signpost" href="https://www.w3.org/History/1989/proposal.html"><cite>Information Management: A Proposal</cite></a>{' '}
            <span className="provenance caption">Tim Berners-Lee, CERN, 1989</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html"><cite>WorldWideWeb: Proposal for a HyperText Project</cite></a>{' '}
            <span className="provenance caption">Tim Berners-Lee and Robert Cailliau, 1990</span>
          </li>
          <li>
            <a className="signpost" href="https://info.cern.ch/hypertext/WWW/MarkUp/Tags.html"><cite>The original HTML tags</cite></a>{' '}
            <span className="provenance caption">info.cern.ch, as preserved in 1992</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/Protocols/HTTP/AsImplemented.html"><cite>The Original HTTP as defined in 1991</cite></a>{' '}
            <span className="provenance caption">w3.org</span>
          </li>
          <li>
            <a className="signpost" href="https://worldwideweb.cern.ch/browser/"><cite>The WorldWideWeb browser, rebuilt</cite></a>{' '}
            <span className="provenance caption">CERN, 2019</span>
          </li>
          <li>
            <a className="signpost" href="https://worldwideweb.cern.ch/worldwideweb/"><cite>The Browser: WorldWideWeb NeXT Application</cite></a>{' '}
            <span className="provenance caption">CERN, 2019</span>
          </li>
          <li>
            <a className="signpost" href="https://worldwideweb.cern.ch/history/"><cite>A short history of the browser</cite></a>{' '}
            <span className="provenance caption">CERN, 2019</span>
          </li>
          <li>
            <a className="signpost"
              href="https://www.ppd.stfc.ac.uk/news/unravelling-the-web-how-particle-physics-launched-the-invention-that-changed-the-world/"><cite>Weaving the Web</cite></a>{' '}
            <span className="provenance caption">Tim Berners-Lee with Mark Fischetti, 1999, as quoted by the STFC</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt"><cite>The WorldWideWeb project, posted to alt.hypertext</cite></a>{' '}
            <span className="provenance caption">Tim Berners-Lee, 6 August 1991</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/People/Berners-Lee/1991/08/art-6487.txt"><cite>WorldWideWeb: Summary, posted to alt.hypertext</cite></a>{' '}
            <span className="provenance caption">Tim Berners-Lee, 6 August 1991</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/History.html"><cite>A Little History of the World Wide Web</cite></a>{' '}
            <span className="provenance caption">W3C</span>
          </li>
        </ul>
      </section>
      <section className="shelf" aria-label="structure research">
        <h3 className="shelf-title sub-title">Structure</h3>
        <ul className="works">
          <li>
            <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html"><cite>A history of HTML</cite></a>{' '}
            <span className="provenance caption">Dave Raggett, from Raggett on HTML 4, 1998</span>
          </li>
          <li>
            <a className="signpost" href="https://www.rfc-editor.org/rfc/rfc1866"><cite>RFC 1866: Hypertext Markup Language 2.0</cite></a>{' '}
            <span className="provenance caption">Tim Berners-Lee and Dan Connolly, IETF, November 1995</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/TR/REC-html32"><cite>HTML 3.2 Reference Specification</cite></a>{' '}
            <span className="provenance caption">W3C Recommendation, 14 January 1997</span>
          </li>
          <li>
            <a className="signpost" href="https://html.com/html5/"><cite>HTML5 Basics</cite></a>{' '}
            <span className="provenance caption">html.com</span>
          </li>
          <li>
            <a className="signpost" href="https://html.com/deprecated/"><cite>Deprecated HTML features</cite></a>{' '}
            <span className="provenance caption">html.com</span>
          </li>
          <li>
            <a className="signpost" href="https://www.infoq.com/news/2011/05/html5-design/"><cite>Jeremy Keith on the Design Principles of HTML5</cite></a>{' '}
            <span className="provenance caption">InfoQ, 2011</span>
          </li>
          <li>
            <a className="signpost" href="https://www.smashingmagazine.com/2020/01/html5-article-section/"><cite>Why You Should Choose HTML5 article Over section</cite></a>{' '}
            <span className="provenance caption">Bruce Lawson, Smashing Magazine, 2020</span>
          </li>
          <li>
            <a className="signpost" href="https://whatwg.org/position-paper"><cite>Position Paper for the W3C Workshop on Web Applications and Compound Documents</cite></a>{' '}
            <span className="provenance caption">Mozilla and Opera, June 2004; the rejected proposal, preserved by the WHATWG</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/2004/04/webapps-cdf-ws/summary"><cite>Summary, W3C Workshop on Web Applications and Compound Documents</cite></a>{' '}
            <span className="provenance caption">Dean Jackson for the W3C, 21 July 2004</span>
          </li>
          <li>
            <a className="signpost" href="https://html.spec.whatwg.org/multipage/introduction.html"><cite>The HTML Standard’s own history</cite></a>{' '}
            <span className="provenance caption">the WHATWG, in the specification’s introduction</span>
          </li>
          <li>
            <a className="signpost" href="https://whatwg.org/faq"><cite>The WHATWG FAQ</cite></a>{' '}
            <span className="provenance caption">the WHATWG</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/TR/html-design-principles/"><cite>HTML Design Principles</cite></a>{' '}
            <span className="provenance caption">Anne van Kesteren and Maciej Stachowiak, W3C Working Draft, 26 November 2007</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/TR/2014/REC-html5-20141028/"><cite>HTML5</cite></a>{' '}
            <span className="provenance caption">Ian Hickson, Robin Berjon, Steve Faulkner, Travis Leithead, Erika Doyle Navara, Theresa O’Connor and Silvia Pfeiffer, W3C Recommendation, 28 October 2014</span>
          </li>
          <li>
            <a className="signpost" href="https://html.spec.whatwg.org/multipage/parsing.html"><cite>HTML Standard, parsing HTML documents</cite></a>{' '}
            <span className="provenance caption">WHATWG, undated</span>
          </li>
          <li>
            <a className="signpost" href="https://html.spec.whatwg.org/multipage/syntax.html"><cite>HTML Standard, the HTML syntax</cite></a>{' '}
            <span className="provenance caption">WHATWG, undated</span>
          </li>
          <li>
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA"><cite>ARIA</cite></a>{' '}
            <span className="provenance caption">MDN</span>
          </li>
          <li>
            <a className="signpost" href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element"><cite>The div element</cite></a>{' '}
            <span className="provenance caption">the HTML Standard, WHATWG</span>
          </li>
          <li>
            <a className="signpost" href="https://webaim.org/projects/screenreadersurvey10/"><cite>Screen Reader User Survey #10</cite></a>{' '}
            <span className="provenance caption">WebAIM, 2024</span>
          </li>
          <li>
            <a className="signpost" href="https://webaim.org/projects/million/"><cite>The WebAIM Million</cite></a>{' '}
            <span className="provenance caption">WebAIM</span>
          </li>
          <li>
            <a className="signpost" href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html"><cite>HTML and CSS</cite></a>{' '}
            <span className="provenance caption">the W3C; the definitions survive only in the archive</span>
          </li>
          <li>
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security"><cite>Website security</cite></a>{' '}
            <span className="provenance caption">MDN</span>
          </li>
        </ul>
      </section>
      <section className="shelf" aria-label="presentation research">
        <h3 className="shelf-title sub-title">Presentation</h3>
        <ul className="works">
          <li>
            <a className="signpost" href="https://www.w3.org/TR/REC-CSS1-961217"><cite>Cascading Style Sheets, level 1</cite></a>{' '}
            <span className="provenance caption">W3C Recommendation, 17 December 1996</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/TR/1998/REC-CSS2-19980512/"><cite>Cascading Style Sheets, level 2</cite></a>{' '}
            <span className="provenance caption">W3C Recommendation, 12 May 1998</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/TR/2011/REC-css3-color-20110607/"><cite>CSS Color Module Level 3</cite></a>{' '}
            <span className="provenance caption">W3C Recommendation, 7 June 2011</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/TR/2011/REC-css3-selectors-20110929/"><cite>Selectors Level 3</cite></a>{' '}
            <span className="provenance caption">W3C Recommendation, 29 September 2011</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/TR/2011/REC-css3-namespace-20110929/"><cite>CSS Namespaces Module</cite></a>{' '}
            <span className="provenance caption">W3C Recommendation, 29 September 2011</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/TR/2012/REC-css3-mediaqueries-20120619/"><cite>Media Queries</cite></a>{' '}
            <span className="provenance caption">W3C Recommendation, 19 June 2012</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/Internet_Explorer_for_Mac"><cite>Internet Explorer for Mac</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/"><cite>Wired With Standards</cite></a>{' '}
            <span className="provenance caption">Eric Meyer, 11 October 2002</span>
          </li>
          <li>
            <a className="signpost" href="https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/"><cite>An Interview With Douglas Bowman of Wired News</cite></a>{' '}
            <span className="provenance caption">Eric Meyer for Netscape DevEdge, 11 October 2002, via the Internet Archive</span>
          </li>
          <li>
            <a className="signpost" href="https://meyerweb.com/eric/projects/ndept/home.html"><cite>Wired News Redesigns With Standards</cite></a>{' '}
            <span className="provenance caption">Eric Meyer, Netscape DevEdge, 2002</span>
          </li>
          <li>
            <a className="signpost" href="https://stopdesign.com/archive/2012/10/11/ten-years-later.html"><cite>Wired.com: Ten years later</cite></a>{' '}
            <span className="provenance caption">Douglas Bowman, 11 October 2012</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/2011/05/css-pr.html.en"><cite>Cascading Style Sheets Standard Boasts Unprecedented Interoperability</cite></a>{' '}
            <span className="provenance caption">W3C, 7 June 2011</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/TR/2001/WD-css3-roadmap-20010523/"><cite>Introduction to CSS3</cite></a>{' '}
            <span className="provenance caption">W3C Working Draft, 23 May 2001</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html"><cite>Cascading HTML style sheets: a proposal</cite></a>{' '}
            <span className="provenance caption">Håkon Wium Lie, 10 October 1994</span>
          </li>
          <li>
            <a className="signpost" href="https://www.wiumlie.no/2006/phd/#ch-postweb"><cite>Cascading Style Sheets</cite></a>{' '}
            <span className="provenance caption">Håkon Wium Lie, PhD thesis, University of Oslo, 2005</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html"><cite>The CSS Saga</cite></a>{' '}
            <span className="provenance caption">Håkon Wium Lie and Bert Bos, from Cascading Style Sheets: Designing for the Web, 1999</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm"><cite>The Box Acid Test</cite></a>{' '}
            <span className="provenance caption">Todd Fahrner, in the W3C CSS1 Test Suite</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/Style/CSS/Test/CSS1/current/tsack.html"><cite>CSS1 Test Suite Acknowledgments</cite></a>{' '}
            <span className="provenance caption">the W3C; the credits name the testers</span>
          </li>
          <li>
            <a className="signpost" href="http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html"><cite>Sorry, you’re screwed</cite></a>{' '}
            <span className="provenance caption">Marc Andreessen on www-talk, February 1994</span>
          </li>
          <li>
            <a className="signpost" href="https://thehistoryoftheweb.com/the-rise-of-css/"><cite>The Rise of CSS</cite></a>{' '}
            <span className="provenance caption">Jay Hoffmann, The History of the Web, 2017</span>
          </li>
          <li>
            <a className="signpost" href="https://thehistoryoftheweb.com/look-back-history-css/"><cite>A Look Back at the History of CSS</cite></a>{' '}
            <span className="provenance caption">Jay Hoffmann, The History of the Web, 2017</span>
          </li>
          <li>
            <a className="signpost" href="https://csszengarden.com/"><cite>CSS Zen Garden</cite></a>{' '}
            <span className="provenance caption">Dave Shea, 2003</span>
          </li>
          <li>
            <a className="signpost" href="https://csszengarden.com/pages/about/"><cite>About the CSS Zen Garden</cite></a>{' '}
            <span className="provenance caption">Dave Shea, undated</span>
          </li>
          <li>
            <a className="signpost" href="https://www.css-class.com/a-brief-history-of-css/"><cite>A Brief History of CSS</cite></a>{' '}
            <span className="provenance caption">css-class.com</span>
          </li>
          <li>
            <a className="signpost" href="https://simplecss.eu/css-history-brief-overview.html"><cite>CSS History, A Brief Overview</cite></a>{' '}
            <span className="provenance caption">simplecss.eu</span>
          </li>
          <li>
            <a className="signpost" href="http://www.zerobugsandprogramfaster.net/essays/2.html"><cite>A tinge of guilt</cite></a>{' '}
            <span className="provenance caption">zerobugsandprogramfaster.net</span>
          </li>
          <li>
            <a className="signpost" href="https://www.webdesignmuseum.org/"><cite>The Web Design Museum</cite></a>{' '}
            <span className="provenance caption">webdesignmuseum.org</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/Style/CSS/Overview.en.html"><cite>Cascading Style Sheets home page</cite></a>{' '}
            <span className="provenance caption">the W3C</span>
          </li>
          <li>
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes"><cite>Pseudo-classes</cite></a>{' '}
            <span className="provenance caption">MDN</span>
          </li>
          <li>
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"><cite>prefers-reduced-motion</cite></a>{' '}
            <span className="provenance caption">MDN</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html"><cite>Understanding Meaningful Sequence</cite></a>{' '}
            <span className="provenance caption">W3C WAI</span>
          </li>
          <li>
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select"><cite>Customizable select elements</cite></a>{' '}
            <span className="provenance caption">MDN</span>
          </li>
          <li>
            <a className="signpost" href="https://speakerdeck.com/vjeux/react-css-in-js"><cite>React: CSS in JS</cite></a>{' '}
            <span className="provenance caption">Christopher Chedeau, Facebook, November 2014</span>
          </li>
        </ul>
      </section>
      <section className="shelf" aria-label="dynamic interaction research">
        <h3 className="shelf-title sub-title">Dynamic Interaction</h3>
        <ul className="works">
          <li>
            <a className="signpost" href="https://ecma-international.org/publications-and-standards/standards/ecma-262/"><cite>ECMA-262, the editions</cite></a>{' '}
            <span className="provenance caption">Ecma International</span>
          </li>
          <li>
            <a className="signpost" href="https://262.ecma-international.org/5.1/"><cite>ECMAScript Language Specification, 5.1 edition, Introduction</cite></a>{' '}
            <span className="provenance caption">Ecma International, June 2011</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/JavaScript"><cite>JavaScript</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/XMLHttpRequest"><cite>XMLHttpRequest</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/Google_Maps"><cite>Google Maps</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="http://prototypejs.org/"><cite>Prototype JavaScript framework</cite></a>{' '}
            <span className="provenance caption">prototypejs.org</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/Prototype_JavaScript_Framework"><cite>Prototype JavaScript Framework</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://jquery.com/"><cite>jQuery</cite></a>{' '}
            <span className="provenance caption">jquery.com</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/JScript"><cite>JScript</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/ECMAScript_version_history"><cite>ECMAScript version history</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://web.archive.org/web/2015/https://mail.mozilla.org/pipermail/es-discuss/2008-August/006837.html"><cite>ECMAScript Harmony</cite></a>{' '}
            <span className="provenance caption">Brendan Eich on es-discuss, 13 August 2008, via the Internet Archive</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/ActionScript"><cite>ActionScript</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/Tamarin_(software)"><cite>Tamarin</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/Adobe_Flash_Player"><cite>Adobe Flash Player</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/AngularJS"><cite>AngularJS</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://angularjs.org/"><cite>Why AngularJS?</cite></a>{' '}
            <span className="provenance caption">angularjs.org, undated</span>
          </li>
          <li>
            <a className="signpost" href="https://github.com/angular/angular.js/blob/master/CHANGELOG.md"><cite>AngularJS changelog</cite></a>{' '}
            <span className="provenance caption">the angular.js repository on GitHub, undated</span>
          </li>
          <li>
            <a className="signpost" href="https://legacy.reactjs.org/blog/2013/06/05/why-react.html"><cite>Why did we build React?</cite></a>{' '}
            <span className="provenance caption">Pete Hunt, React blog, 5 June 2013</span>
          </li>
          <li>
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@scope"><cite>@scope</cite></a>{' '}
            <span className="provenance caption">MDN</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/React_(software)"><cite>React</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/Vue.js"><cite>Vue.js</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/Angular_(web_framework)"><cite>Angular</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html"><cite>The A-Z of Programming Languages: JavaScript</cite></a>{' '}
            <span className="provenance caption">Brendan Eich, interviewed by Naomi Hamilton, Computerworld, 2008</span>
          </li>
          <li>
            <a className="signpost" href="https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html"><cite>JavaScript creator ponders past, future</cite></a>{' '}
            <span className="provenance caption">Brendan Eich, interviewed by Paul Krill, InfoWorld, 2008</span>
          </li>
          <li>
            <a className="signpost" href="https://brendaneich.com/2008/04/popularity/"><cite>Popularity</cite></a>{' '}
            <span className="provenance caption">Brendan Eich, 2008</span>
          </li>
          <li>
            <a className="signpost" href="https://adactio.com/journal/1595"><cite>Misunderstanding markup</cite></a>{' '}
            <span className="provenance caption">Jeremy Keith, 7 July 2009</span>
          </li>
          <li>
            <a className="signpost" href="https://auth0.com/blog/a-brief-history-of-javascript/"><cite>A Brief History of JavaScript</cite></a>{' '}
            <span className="provenance caption">Sebastian Peyrott, Auth0, 2017</span>
          </li>
          <li>
            <a className="signpost" href="https://medium.com/@benastontweet/lesson-1a-the-history-of-javascript-8c1ce3bffb17"><cite>A brief history of JavaScript</cite></a>{' '}
            <span className="provenance caption">Ben Aston, 2015</span>
          </li>
          <li>
            <a className="signpost" href="https://www.coursereport.com/blog/history-of-javascript"><cite>JavaScript: A History for Beginners</cite></a>{' '}
            <span className="provenance caption">Course Report</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikibooks.org/wiki/JavaScript/History_of_JavaScript"><cite>History of JavaScript</cite></a>{' '}
            <span className="provenance caption">Wikibooks</span>
          </li>
          <li>
            <a className="signpost" href="https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php"><cite>Ajax: A New Approach to Web Applications</cite></a>{' '}
            <span className="provenance caption">Jesse James Garrett, Adaptive Path, 18 February 2005; archived</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/Brendan_Eich"><cite>Brendan Eich</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://en.wikipedia.org/wiki/Prototype-based_programming"><cite>Prototype-based programming</cite></a>{' '}
            <span className="provenance caption">Wikipedia</span>
          </li>
          <li>
            <a className="signpost" href="https://tc39.es/process-document/"><cite>The TC39 Process</cite></a>{' '}
            <span className="provenance caption">TC39, Ecma International</span>
          </li>
          <li>
            <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html"><cite>Understanding Success Criterion 2.1.1: Keyboard</cite></a>{' '}
            <span className="provenance caption">W3C WAI</span>
          </li>
        </ul>
      </section>
      <section className="shelf" aria-label="the concert research">
        <h3 className="shelf-title sub-title">The concert</h3>
        <ul className="works">
          <li>
            <a className="signpost" href="https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html"><cite>React: CSS in JS</cite></a>{' '}
            <span className="provenance caption">Christopher Chedeau, NationJS, 2014</span>
          </li>
          <li>
            <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM"><cite>Using shadow DOM</cite></a>{' '}
            <span className="provenance caption">MDN</span>
          </li>
          <li>
            <a className="signpost" href="https://html.spec.whatwg.org/multipage/custom-elements.html"><cite>Custom elements</cite></a>{' '}
            <span className="provenance caption">the HTML Standard, WHATWG</span>
          </li>
          <li>
            <a className="signpost" href="https://jasonformat.com/islands-architecture/"><cite>Islands Architecture</cite></a>{' '}
            <span className="provenance caption">Jason Miller, 2020</span>
          </li>
          <li>
            <a className="signpost" href="https://vercel.com/blog/next"><cite>Next.js</cite></a>{' '}
            <span className="provenance caption">Naoyuki Kanezawa, Guillermo Rauch and Tony Kovanen, Vercel blog, 25 October 2016</span>
          </li>
          <li>
            <a className="signpost" href="https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html"><cite>Introducing Zero-Bundle-Size React Server Components</cite></a>{' '}
            <span className="provenance caption">React blog, 21 December 2020</span>
          </li>
          <li>
            <a className="signpost" href="https://nextjs.org/blog/next-13-4"><cite>Next.js 13.4</cite></a>{' '}
            <span className="provenance caption">Next.js blog, 4 May 2023</span>
          </li>
          <li>
            <a className="signpost" href="https://web.dev/rendering-on-the-web/"><cite>Rendering on the Web</cite></a>{' '}
            <span className="provenance caption">Jason Miller and Addy Osmani, web.dev, 2019</span>
          </li>
        </ul>
      </section>
    </details>
  </section>;
