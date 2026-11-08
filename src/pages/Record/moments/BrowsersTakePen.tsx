import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from '../calendar';

const whatwgHtmlIntroduction = 'https://html.spec.whatwg.org/multipage/introduction.html';
const whatwgPositionPaper = 'https://whatwg.org/position-paper';
const w3cWorkshopSummary = 'https://www.w3.org/2004/04/webapps-cdf-ws/summary';
const whatwgFaq = 'https://whatwg.org/faq';

export const BrowsersTakePen: FC = () =>
  <Moment heading={moments.headings.browsersTakePen}
    summary={<>Mozilla and Opera <a className="signpost" href={whatwgPositionPaper}>put a counter-proposal in writing</a>: evolve HTML,
      backwards compatible. A straw poll at the W3C’s workshop went against it and the W3C said it did not intend to put
      any resources into it, so the browser makers founded the WHATWG, their own working group, and wrote the
      specification they were implementing. The people writing the specification were the people shipping it, and their
      second principle was that the two must match.</>}>
    <p className="paragraph muted-ink hyphenated">The Standard’s own history says how HTML had stopped. In
      1998 <a className="signpost" href={whatwgHtmlIntroduction}>“the W3C membership decided to stop evolving HTML and instead begin
        work on an XML-based equivalent, called XHTML”</a>, then on XHTML2, <a className="signpost" href={whatwgHtmlIntroduction}>“a
          new language that was not compatible with the earlier HTML and XHTML languages”</a>. In 2003
      XForms <a className="signpost" href={whatwgHtmlIntroduction}>“sparked a renewed interest in evolving HTML itself, rather
        than finding replacements for it”</a>, because XML had been deployed only for new things like
      RSS, <a className="signpost" href={whatwgHtmlIntroduction}>“rather than as a replacement for existing deployed
        technologies (like HTML)”</a>. The first result was a proof of concept extending HTML4’s forms, a
      draft under Opera’s copyright.</p>
    <p className="paragraph muted-ink hyphenated">At the W3C’s workshop on web applications in June 2004, Mozilla and
      Opera put the case in a position paper. It warned of <a className="signpost" href={whatwgPositionPaper}>“a rising threat of
        single-vendor solutions”</a>, and asked that browsers ship first
      implementations <a className="signpost" href={whatwgPositionPaper}>“before the end of the year 2004”</a>. Its seven
      principles begin with <a className="signpost" href={whatwgPositionPaper}>“Backwards compatibility, clear migration
        path”</a>: web application technologies <a className="signpost" href={whatwgPositionPaper}>“should be based on
          technologies authors are familiar with, including HTML, CSS, DOM, and JavaScript”</a>, and should work
      in Internet Explorer 6 <a className="signpost" href={whatwgPositionPaper}>“without the need for binary
        plug-ins”</a>. The rest are of a piece. <a className="signpost" href={whatwgPositionPaper}>“Well-defined error
          handling”</a> means browsers <a className="signpost" href={whatwgPositionPaper}>“do not have to invent their own
            error handling mechanisms or reverse engineer other User Agents’”</a>,
      and <a className="signpost" href={whatwgPositionPaper}>“Practical use”</a> means every feature
      is <a className="signpost" href={whatwgPositionPaper}>“justified by a practical use case”</a>. The last
      three are <a className="signpost" href={whatwgPositionPaper}>“Scripting is here to stay”</a>, no
      device-specific profiling, and an <a className="signpost" href={whatwgPositionPaper}>“Open
        process”</a> in which drafts <a className="signpost" href={whatwgPositionPaper}>“should continuously
          be visible to the public”</a>.</p>
    <p className="paragraph muted-ink hyphenated">The workshop took a straw poll. On the
      question <a className="signpost" href={w3cWorkshopSummary}>“Should the W3C develop declarative extension to HTML and CSS and
        to address medium level Web Application requirements”</a>, the summary
      records <a className="signpost" href={w3cWorkshopSummary}>“8 voted Yes. 14 voted No.”</a> It calls the
      poll <a className="signpost" href={w3cWorkshopSummary}>“not binding”</a>, and says that
      W3C <a className="signpost" href={w3cWorkshopSummary}>“does not intend to put any resources into”</a> extensions to
      HTML and CSS for web applications. The Standard’s history puts it in one line: the
      proposal <a className="signpost" href={whatwgHtmlIntroduction}>“conflicted with the previously chosen direction for
        the web’s evolution”</a>, and the W3C <a className="signpost" href={whatwgHtmlIntroduction}>“voted to continue
          developing XML-based replacements instead”</a>. Shortly after, Apple, Mozilla and
      Opera <a className="signpost" href={whatwgHtmlIntroduction}>“jointly announced their intent to continue working
        on the effort”</a> under a new venue, the WHATWG, founded, its FAQ says, over the
      W3C’s <a className="signpost" href={whatwgFaq}>“apparent disregard for the needs of real-world web
        developers”</a>. The draft moved to the WHATWG’s site, and its copyright passed to the three
      vendors jointly.</p>
    <p className="paragraph muted-ink hyphenated">The Standard states the WHATWG’s method as three
      principles: <a className="signpost" href={whatwgHtmlIntroduction}>“technologies need to be backwards
        compatible”</a>, <a className="signpost" href={whatwgHtmlIntroduction}>“specifications and implementations need to match even
          if this means changing the specification rather than the implementations”</a>,
      and <a className="signpost" href={whatwgHtmlIntroduction}>“specifications need to be detailed enough that implementations
        can achieve complete interoperability without reverse-engineering each other”</a>. That last one is why
      HTML5 took in what had been three documents, HTML4, XHTML1 and DOM2 HTML. The people writing the
      specification were the people shipping it, and the second principle says the specification follows what
      they ship. The W3C <a className="signpost" href={whatwgHtmlIntroduction}>“indicated an interest to participate in the
        development of HTML5 after all”</a> in 2006 and chartered a group to work with the WHATWG in 2007. The
      two split in 2011 over a finished HTML5 versus a <a className="signpost" href={whatwgFaq}>Living
        Standard</a>, <a className="signpost" href={whatwgFaq}>“continuously updated”</a>. In 2019 they signed
      an agreement on <a className="signpost" href={whatwgHtmlIntroduction}>“a single version of HTML going
        forward”</a>. The posture from 1994, the specification following the field, had become the
      rule.</p>
  </Moment>;
