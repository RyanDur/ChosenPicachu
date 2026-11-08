import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from '../calendar';

const htmlCom = 'https://html.com/html5/';
const infoQ = 'https://www.infoq.com/news/2011/05/html5-design/';
const htmlDesignPrinciples = 'https://www.w3.org/TR/html-design-principles/';
const html5Recommendation = 'https://www.w3.org/TR/2014/REC-html5-20141028/';
const htmlParsing = 'https://html.spec.whatwg.org/multipage/parsing.html';
const htmlSyntax = 'https://html.spec.whatwg.org/multipage/syntax.html';

export const Html5SaysIt: FC = () =>
  <Moment heading={moments.headings.html5SaysIt}
    summary={<>The W3C’s HTML working group published its <a className="signpost" href={htmlDesignPrinciples}>HTML Design
      Principles</a> as a working draft on 26 November 2007, with its priority of
      constituencies, <a className="signpost" href={htmlDesignPrinciples}>“users over authors over implementors over specifiers
        over theoretical purity”</a>, and HTML5 became a Recommendation
      on <a className="signpost" href={html5Recommendation}>28 October 2014</a>. html.com’s summary lists the
      objectives: semantic markup, separation of design from content,
      and <a className="signpost" href={htmlCom}>“reducing the overlap between HTML, CSS, and
        JavaScript”</a>.</>}>
    <p className="paragraph muted-ink hyphenated">The objectives, as html.com summarizes them: encouraging semantic
      markup; separating design from content; promoting accessibility and responsiveness; reducing the overlap between
      the three languages; and supporting rich media without plugins. html.com gives the reasoning: content is
      read <a className="signpost" href={htmlCom}>“in a lot of different contexts — desktops, laptops, tablets, mobile
        phones, RSS readers”</a>, so provide the meaning and let presentation adapt.</p>
    <p className="paragraph muted-ink hyphenated">The principles came first, in November 2007, as a W3C working draft,
      HTML Design Principles, from the working group chartered to work with the WHATWG. Its rule for conflicts is one
      sentence: <a className="signpost" href={htmlDesignPrinciples}>“In case of conflict, consider users over authors over
        implementors over specifiers over theoretical purity.”</a> Its rule for the past, pave the cowpaths, is the line
      the concert below quotes when it reaches 2007. Jeremy Keith presented them as six: avoid needless complexity;
      support existing content; solve real problems; pave the cowpaths, adopting what
      is <a className="signpost" href={infoQ}>“widely accepted”</a> instead of inventing anew; degrade gracefully;
      and priority of constituencies: <a className="signpost" href={infoQ}>“users &gt; authors &gt; implementors
        &gt; specifiers &gt; theoretical purity”</a>.</p>
    <p className="paragraph muted-ink hyphenated">HTML5 itself became a W3C Recommendation
      on <a className="signpost" href={html5Recommendation}>28 October 2014</a>, seven years after the principles. And there
      was a quiet break with the past, which the Standard states. <a className="signpost" href={htmlParsing}>“While the
        HTML syntax described in this specification bears a close resemblance to SGML and XML, it is a separate
        language with its own parsing rules”</a>, and <a className="signpost" href={htmlParsing}>“few (if any) web
          browsers ever implemented true SGML parsing for HTML documents”</a>. The standard now describes the parser
      the browsers had, rather than the SGML grammar the earlier standards had claimed and the browsers had not
      implemented. The specification <a className="signpost" href={htmlParsing}>“defines the parsing rules for HTML
        documents, whether they are syntactically correct or not”</a>, so what a browser does with broken markup
      stopped being a vendor’s guess. The doctype collapsed to fifteen
      characters, <code className="monospaced">{'<!DOCTYPE html>'}</code>,
      kept <a className="signpost" href={htmlSyntax}>“for legacy reasons”</a>, because when it is
      omitted <a className="signpost" href={htmlSyntax}>“browsers tend to use a different rendering mode
        that is incompatible with some specifications”</a>. Even Berners-Lee’s 1991 wish
      for <a className="signpost" href={infoQ}>“a nestable &lt;SECTION&gt;..&lt;/SECTION&gt;
        element”</a> resurfaced as the section element, twenty-three years later.</p>
  </Moment>;
