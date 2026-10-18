import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {FromTheRecord} from './FromTheRecord';
import {ConcernSection} from './ConcernSection';

export const Structure: FC = () =>
  <ConcernSection concern="Structure">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://html.com/html5/">html.com, on HTML</a>}>
      It is not a programming language, but rather a language that identifies the meaning,
      purpose, and structure of text within a document.
    </Quotation>
    <div className="concern-essay">
      <p className="paragraph">HTML says what each thing on the page is: a heading, a list, a button, a form. Berners-Lee’s tags already did that job. They came from CERN’s SGML guide so the documents world would recognise them, and the one tag of his own, the anchor, carried the address of a document on another machine. Twice since, the structure left the document, and twice the standard brought it back. Through 1993 and early 1994 the browsers added tags of their own until, in Dave Raggett’s words, <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“the language was becoming ill-defined”</a>; HTML 2.0 wrote down the tags in use in 1995, and from 2004 the browser makers wrote the standard themselves, the one that calls a div an element <a className="signpost" href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element">“of last resort”</a>. In 2013 script built the components, and links and the back button became state. HTML5 became a Recommendation in 2014, and html.com’s summary of its objectives puts semantic markup first; in 2016 the document came first again and the program second.</p>
      <p className="paragraph">I take one rule from that. Choose the element that means what the content is, and add the look and the behaviour on top of it.</p>
    </div>
    <FromTheRecord/>
  </ConcernSection>;
