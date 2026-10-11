import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const HtmlTwo: FC = () =>
  <Moment of={moments.htmlTwo}
    tells={<>The first HTML standard was written after the fact. HTML 2.0, published in November 1995, is the set of tags the
      browsers already used, collected and defined. Dave Raggett’s history puts the cause plainly: the browsers had
      each added their own, and the language was becoming ill-defined.</>}>
    <p className="paragraph muted-ink hyphenated">By 1994 HTML was whatever the browsers accepted. Raggett, who wrote HTML+ and later HTML 3, records that <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“During 1993 and early 1994, lots of browsers had added their own bits to HTML; the language was becoming ill-defined”</a>.
      Mosaic’s IMG tag was one such bit, and it <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“remains to this day firmly implanted in HTML”</a>.
      The answer was to write down what existed: <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“Dan Connolly and colleagues collected all the HTML tags that were widely used and collated them into a draft document”</a>,
      and <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“In early 1994, an Internet Engineering Task Force working group was set up to deal with HTML”</a>.
      The IETF is the body that standardises the internet’s protocols; its documents are RFCs.</p>
    <p className="paragraph muted-ink hyphenated">The result is <a className="signpost" href="https://www.rfc-editor.org/rfc/rfc1866">RFC 1866</a>, dated November
      1995, by Berners-Lee and Connolly. Its scope sentence is the whole method: the specification covers <a className="signpost" href="https://www.rfc-editor.org/rfc/rfc1866">“a set of features that roughly corresponds to the capabilities of HTML in common use prior to June 1994”</a>,
      and it names itself HTML 2.0 <a className="signpost" href="https://www.rfc-editor.org/rfc/rfc1866">“to distinguish it from the previous informal specifications”</a>.
      Forms, the one thing a page could do besides link, came in as a level: <a className="signpost" href="https://www.rfc-editor.org/rfc/rfc1866">“Form processing is a level 2 feature”</a>.</p>
    <p className="paragraph muted-ink hyphenated">Practice kept outrunning the document. Netscape, formed in November 1994, <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“began inventing its own HTML tags as it pleased without first openly discussing them with the Web community”</a>,
      tags like FONT FACE and BGCOLOR <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“which control stylistic aspects of a document”</a>,
      and in December 1995 the IETF group was dismantled because it <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“was having difficulties coming to consensus swiftly enough”</a>.
      The W3C took the pen: HTML 3.2, January 1997, <a className="signpost" href="https://www.w3.org/People/Raggett/book4/ch02.html">“took the existing IETF HTML 2 standard and incorporated features from HTML+ and HTML 3”</a>.
      Standardising what the browsers already did became HTML’s habit, and in 2014 its stated principle.</p>
  </Moment>;
