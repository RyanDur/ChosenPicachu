import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from '../calendar';

const garrettAjaxEssay = 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php';
const computerworldInterview = 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html';
const infoworldInterview = 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html';
const prototypeJsSite = 'http://prototypejs.org/';
const jQuerySite = 'https://jquery.com/';
const xmlHttpRequest = 'https://en.wikipedia.org/wiki/XMLHttpRequest';
const googleMaps = 'https://en.wikipedia.org/wiki/Google_Maps';
const prototypeArticle = 'https://en.wikipedia.org/wiki/Prototype_JavaScript_Framework';

export const PageBecomesApplication: FC = () =>
  <Moment heading={moments.headings.pageBecomesApplication}
    summary={<>Ajax let a page fetch data and rewrite itself without reloading. Garrett named the approach and pointed
      at Google’s newest products as its highest-profile examples. Prototype and jQuery smoothed over the differences
      between the browsers, and then the frameworks came.</>}>
    <p className="paragraph muted-ink hyphenated">Garrett opens with the gap. Desktop
      applications <a className="signpost" href={garrettAjaxEssay}>“have a richness and responsiveness that has seemed out of reach
        on the Web”</a>. In the classic model <a className="signpost" href={garrettAjaxEssay}>“Most user actions in the interface
          trigger an HTTP request back to a web server”</a>, which <a className="signpost" href={garrettAjaxEssay}>“returns an HTML
            page to the client”</a>, and at every step <a className="signpost" href={garrettAjaxEssay}>“the user waits some
              more”</a>. That model, he writes, was <a className="signpost" href={garrettAjaxEssay}>“adapted from the Web’s
                original use as a hypertext medium”</a>, and <a className="signpost" href={garrettAjaxEssay}>“what makes the Web
                  good for hypertext doesn’t necessarily make it good for software applications”</a>.</p>
    <p className="paragraph muted-ink hyphenated">He published <a className="signpost" href={garrettAjaxEssay}>the essay</a> on 18
      February 2005, insisting that <a className="signpost" href={garrettAjaxEssay}>“Ajax isn’t a technology”</a> but several:
      presentation in XHTML and CSS, display through the DOM, data in
      XML, <a className="signpost" href={garrettAjaxEssay}>“asynchronous data retrieval using
        XMLHttpRequest”</a>, <a className="signpost" href={garrettAjaxEssay}>“and JavaScript binding everything together”</a>.
      The mechanism is an engine. Instead of a page, the browser loads <a className="signpost" href={garrettAjaxEssay}>“an
        Ajax engine — written in JavaScript and usually tucked away in a hidden frame”</a>. The engine draws the
      interface and talks to the server on the user’s behalf, so the
      user <a className="signpost" href={garrettAjaxEssay}>“is never staring at a blank browser window and an hourglass
        icon”</a>. Why a name at all? He needed, he said, <a className="signpost" href={garrettAjaxEssay}>something
          shorter to use with clients</a> than <a className="signpost" href={garrettAjaxEssay}>“Asynchronous
            JavaScript+CSS+DOM+XMLHttpRequest”</a>.</p>
    <p className="paragraph muted-ink hyphenated">His exhibits were Google Suggest and Google Maps, which Google had
      announced <a className="signpost" href={googleMaps}>ten days before the essay</a>, with Orkut, Gmail and the
      Google Groups beta behind them, and Flickr and Amazon’s A9 following. They showed
      Ajax <a className="signpost" href={garrettAjaxEssay}>“is not only technically sound, but also practical for real-world
        applications”</a>. He claimed practicality, not invention: <a className="signpost" href={garrettAjaxEssay}>“Neither
          Adaptive Path nor Google invented Ajax”</a>. What was new was <a className="signpost" href={garrettAjaxEssay}>“the
            prominent use of these techniques in real-world applications to change the fundamental interaction model
            of the Web”</a>. The pattern was older than the name. The object behind it had shipped in Internet
      Explorer 5 in 1999 as an ActiveX object, Microsoft’s format for plug-in
      components, <a className="signpost" href={xmlHttpRequest}>Microsoft.XMLHTTP</a>, and every browser
      answered to the name XMLHttpRequest <a className="signpost" href={xmlHttpRequest}>by 2006</a>. Eich
      points to hidden-frame applications <a className="signpost" href={computerworldInterview}>“even in late
        1995”</a> prefiguring the whole style, and sums up JavaScript’s part in the
      era: <a className="signpost" href={computerworldInterview}>“JS was the tap root.”</a></p>
    <p className="paragraph muted-ink hyphenated">When people came to JavaScript to program the browser, Eich
      says, <a className="signpost" href={infoworldInterview}>“they want the same APIs and they don’t get them”</a>: the browsers
      still differed in the objects a script used to reach the page, so a page written once did not run in every
      browser. What <a className="signpost" href={infoworldInterview}>“helps make this less painful”</a>, he goes
      on, <a className="signpost" href={infoworldInterview}>“are these JavaScript libraries, which are pure JavaScript code
        that makes this higher layer of code that masquerades and makes all the differences go away”</a>. Sam
      Stephenson’s Prototype came in <a className="signpost" href={prototypeArticle}>February 2005</a>, as the
      Ajax layer of Ruby on Rails, and calls itself a framework
      that <a className="signpost" href={prototypeJsSite}>“smooths over the rough edges of cross-browser
        development”</a>. John Resig’s jQuery followed in 2006: events, animation, Ajax calls, and DOM
      crawling wrapped as one API that hid the differences between the browsers then installed, in its own
      words <a className="signpost" href={jQuerySite}>“an easy-to-use API that works across a multitude of
        browsers”</a>. Then the frameworks came to organize what script was now building: AngularJS in
      2010, React in 2013, Vue in 2014, which is the 2010 moment. The page stopped being a document
      you fetched and started being a program you ran. What the language’s standard did next is the
      2009 moment.</p>
  </Moment>;
