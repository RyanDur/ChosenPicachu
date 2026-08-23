import {FC} from 'react';
import {Moment} from './Moment';

export const PresentationLeavesHome: FC = () =>
  <Moment year="1994"
          title="Presentation leaves home"
          tells={<>Håkon Wium Lie{' '}
            <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">drafted Cascading HTML
            Style Sheets</a>, encouraged by Dave Raggett, who had realized HTML should{' '}
            <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">never become a
            page-description language</a>. Presentation was separated from structure by decision, not
            by accident.</>}>
            <p className="paragraph">Style existed before CSS did. Berners-Lee’s NeXT browser had style sheets whose
    syntax he kept private, considering presentation each browser’s own business; Pei
    Wei’s Viola carried its own style language by 1992; Robert Raisch of O’Reilly had
    posted a proposal in 1993. Then Mosaic made the web popular and took the capability
    backwards: users could adjust a few colors and fonts, authors could do nothing. Marc
    Andreessen told www-talk in February 1994 exactly how the browser side saw authors who
    wanted control: <a className="signpost" href="http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html">“Sorry, you’re screwed.”</a></p>
    <p className="paragraph">Lie published the draft on October 10, 1994, three days before Andreessen
    announced the first Mozilla beta, and presented it at the Chicago web conference’s
    Developer’s Day. The timing was deliberate: Dave Raggett, the main architect of HTML
    3.0, pushed the draft out before the conference precisely because he was arguing
    against his own specification’s expansion. The draft calls itself version 0.92,{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“incomplete as a basis for implementation”</a>: shipped early on
    purpose, to start the argument.</p>
    <p className="paragraph">Bert Bos answered it. He was building Argo, a customizable browser for scholars
    in the humanities, with a style language general enough to dress any markup; under
    its influence, “HTML” was dropped from the proposal’s title. The two proposals merged,
    and what set the survivor apart from every rival, in Lie and Bos’s own telling, was
    the insight that on the web style could never belong to author or reader alone: the
    wishes of both, plus the capabilities of the device, had to be{' '}
    <a className="signpost" href="https://www.w3.org/Style/LieBos2e/history/Overview.html">“combined, or ‘cascaded,’ in some way”</a>.</p>
    <p className="paragraph">The same year, Berners-Lee founded the W3C at MIT: governments, businesses,
    universities, and individuals writing recommendations to keep the browsers’ behavior
    converging. Presentation got its own language and its own institution in the same
    breath.</p>
  </Moment>;
