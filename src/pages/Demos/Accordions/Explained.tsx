import {FC} from 'react';
import {DialGroup, useControls} from '../Controls';
import {FoldType} from '../ReaderSettings';
import {FoldMotionDial} from './FoldMotionDial';
import {FoldTypeDial} from './FoldTypeDial';
import {carve, Mdn, Sample, Snippet} from '../Recipe';
import inclusiveHtmlAloneSource from './InclusiveHtmlAlone.tsx?sample';
import exclusiveHtmlAloneSource from './ExclusiveHtmlAlone.tsx?sample';
import {InclusiveHtmlAloneAccordion} from './InclusiveHtmlAlone';
import {ExclusiveHtmlAloneAccordion} from './ExclusiveHtmlAlone';
import resetCss from '../../../styles/reset.css?sample';
import {looks} from './looks';
import {accordionParts} from './part-pages';
import {tabHeadings} from './tab-headings';
import {PartListing} from './PartListing';
import '../Runs.css';
import './Explained.css';

type HtmlAloneBuild = {
  readonly Accordion: FC;
  readonly source: Sample;
};

const htmlAloneBuilds: Record<FoldType, HtmlAloneBuild> = {
  inclusive: {Accordion: InclusiveHtmlAloneAccordion, source: inclusiveHtmlAloneSource},
  exclusive: {Accordion: ExclusiveHtmlAloneAccordion, source: exclusiveHtmlAloneSource}
};

export const AccordionsExplained: FC = () => {
  const {foldType} = useControls();
  const {Accordion: HtmlAlone, source: htmlAloneSource} = htmlAloneBuilds[foldType];
  return <>
    <header className="tab-introduction">
      <p className="paragraph">A web page is written in three languages. HTML says what is on the page, CSS says how it
        looks and moves, and script says what happens when you act.</p>
      <p className="paragraph">Nothing here leans on another tab.</p>
      <p className="paragraph">You don’t always need all three languages. HTML does some jobs alone, and HTML with CSS
        does more, before you need script. If you know how each one works, you can choose the one the job needs. This
        tab builds one small thing in HTML alone, and each part’s page builds it another way.</p>
      <p className="paragraph">The thing is an accordion: a list of parts, each with a bar you press to show or hide the
        text under it. This page calls one of them a fold. HTML alone can show and hide a fold.</p>
      <p className="paragraph">Sliding it open is the hard part. For years, CSS could move a height to a number but not
        to the height the text needs, so the older ways each worked around it: guess a height, measure it with script,
        or set one in advance. Each has a cost.</p>
      <p className="paragraph">By the end you can build an accordion in HTML alone, make it slide with CSS, keep one
        fold open at a time, and say which language each job needed and why. The accordion below is HTML alone.</p>
    </header>
    <section aria-labelledby="html-alone-heading" className="accordion-part snapping">
      <h2 id="html-alone-heading" className="title bold">{accordionParts.titleOf('html-alone-heading')}</h2>
      <ol className={looks.runs}>
        <li className="run">
          <HtmlAlone/>
          <Snippet label="HTML" lines={carve.between(htmlAloneSource, '<ul>', '</ul>')}/>
        </li>
        <li className="run">
          <p className="paragraph">An HTML page is made of elements. Most are a pair of tags, such
            as <code className="monospaced">{'<details>'}</code> and <code className="monospaced">{'</details>'}</code>,
            around what they hold. A few, such as <code className="monospaced">{'<input>'}</code>, are a single tag and
            hold nothing.</p>
        </li>
        <li className="run">
          <p className="paragraph">A <Mdn path="Web/HTML/Element/details">details</Mdn> element holds
            a <Mdn path="Web/HTML/Element/summary">summary</Mdn> and the content it hides. The summary is the bar. Press
            it and the browser shows the rest. Press it again and the browser hides it. When a details is open, the
            browser marks it with an open attribute. An attribute is a name, often with a value, written inside an
            element’s opening tag.</p>
        </li>
        {foldType === 'exclusive' && <li className="run">
          <p className="paragraph">Each of these details carries
            a <Mdn path="Web/HTML/Element/details#name">name</Mdn> attribute, and details that share a name close one
            another: open one and the browser shuts the rest. It needs no CSS and no script.</p>
        </li>}
        <li className="run">
          <p className="paragraph">The browser also remembers whether each fold is open, and says so to a screen reader,
            which is software that reads the page aloud. The fold does not slide. The parts listed below make it slide,
            each on a page of its own, starting with how we did it before the browser could.</p>
        </li>
      </ol>
    </section>
    <section aria-labelledby={tabHeadings.foldChoices} className="fold-choices">
      <h2 id={tabHeadings.foldChoices} className="off-screen">fold choices</h2>
      <p className="paragraph">Two choices, the fold type and the fold motion, set the builds on each part’s own
        page. Each choice is a dial, a control on the page that sets how a build behaves, with a line
        beside it saying what it does. The fold type also reaches the accordion above: with exclusive, its details
        share a name and opening one closes the others.</p>
      <p className="paragraph">The fold motion is set in a style sheet. A style sheet is a file of rules. A rule has a
        selector, which names the elements it applies to. It also has properties. A property is one aspect of a look,
        like a height or a color, given a value.</p>
      <p className="paragraph">The fold motion does not reach the accordion above. A browser opens a details at once
        on its own. The site’s reset, the style sheet that sets every element’s defaults, slides every details where the
        browser can, and the accordion above turns that off, so you see what HTML alone does.</p>
      <DialGroup>
        <FoldTypeDial/>
        <FoldMotionDial forThePartPages/>
      </DialGroup>
    </section>
    <section aria-labelledby="old-way-heading" className="accordion-part">
      <h2 id="old-way-heading" className="title bold">How we used to build a fold</h2>
      <PartListing part="a-box-remembers-the-fold" level={3}/>
      <PartListing part="the-max-height-guess" level={3}/>
      <PartListing part="the-measured-height" level={3}/>
    </section>
    <PartListing part="what-the-platform-gives-now" level={2}/>
    <section aria-labelledby="motion-heading" className="accordion-part">
      <h2 id="motion-heading" className="title bold">{accordionParts.titleOf('motion-heading')}</h2>
      <ol className={looks.runs}>
        <li className="run">
          <p className="paragraph">Every fold that slides on this tab’s pages moves by transition, never by animation,
            because a reader may press again before the fold lands. If they do,
            a <Mdn path="Web/CSS/CSS_transitions">transition</Mdn> turns around from wherever it is.
            An <Mdn path="Web/CSS/CSS_animations">animation</Mdn> plays a set of keyframes on its own clock, whatever
            the state does.</p>
        </li>
        <li className="run">
          <p className="paragraph">When a reader asks
            for <Mdn path="Web/CSS/@media/prefers-reduced-motion">less motion</Mdn>, every fold opens with no slide. The
            reset, the style sheet that sets every element’s defaults, has a reduced-motion block with three rules.
            The first uses the universal selector, *, which picks every element and reaches their before and after
            too. It sets each transition’s duration to zero, cuts each animation to 0.01 milliseconds, plays each
            animation once,
            and turns smooth scrolling into a jump. The second names ::details-content, the part a
            details hides, which the universal selector cannot reach. The third sets view
            transitions, the browser’s moves from one page state to the next, to no animation at all.</p>
          <Snippet label="CSS" lines={carve.unit(resetCss, '@media (prefers-reduced-motion: reduce) {')}/>
        </li>
        <li className="run">
          <p className="paragraph">A fold’s transition has no delay, so with no duration it has no middle: the
            change lands whole in one frame, one picture the browser draws. One that ran even for an instant
            would show the old state for a frame, and a fold’s text would arrive after the fold had opened.</p>
        </li>
      </ol>
    </section>
  </>;
};
