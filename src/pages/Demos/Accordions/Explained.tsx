import {FC} from 'react';
import {useControls} from '../Controls';
import {FoldType} from '../ReaderSettings';
import {carve, Mdn, Sample, Snippet} from '../Recipe';
import inclusiveHtmlAloneSource from './InclusiveHtmlAlone.tsx?sample';
import exclusiveHtmlAloneSource from './ExclusiveHtmlAlone.tsx?sample';
import {InclusiveHtmlAloneAccordion} from './InclusiveHtmlAlone';
import {ExclusiveHtmlAloneAccordion} from './ExclusiveHtmlAlone';
import {looks} from './looks';
import {accordionParts} from './part-pages';
import {tabHeadings} from './tab-headings';
import {PartsAndDials} from './PartsAndDials';
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
    <header className="tab-introduction accordions-opening">
      <p className="paragraph">This tab builds an accordion: a list of parts, each with a bar you press to show or hide
        the text under it. This page calls one of them a fold. A web page is written in three languages. HTML says what
        is on the page, CSS says how it looks and moves, and script says what happens when you act. Sliding a fold open
        is the hard part. For years, CSS could move a height to a number but not to the height the text needs, so the
        older ways each worked around it: guess a height, measure it with script, or set one in advance. Each has a
        cost.</p>
      <p className="paragraph">You don’t always need all three. HTML does some jobs alone, and HTML with CSS does more,
        before you need script. If you know how each one works, you can choose the one the job needs. By the end you
        can build an accordion in HTML alone, make it slide with CSS, keep one fold open at a time, and say which
        language each job needed and why. The accordion on this page is HTML alone.</p>
      <figure className={`html-alone-exhibit snapping ${looks.exhibit}`}>
        <HtmlAlone/>
      </figure>
    </header>
    <PartsAndDials titled/>
    <section aria-labelledby="before-you-start-heading" className="before-you-start">
      <h2 id="before-you-start-heading" className="title bold">Before you start</h2>
      <p className="paragraph">Nothing here leans on another tab. Each part’s page builds the accordion another way.</p>
      <section aria-labelledby="html-alone-heading" className="accordion-part">
        <h3 id="html-alone-heading" className="sub-title bold">{accordionParts.titleOf('html-alone-heading')}</h3>
        <ol className={looks.runs}>
          <li className="run">
            <Snippet label="HTML" lines={carve.between(htmlAloneSource, '<ul>', '</ul>')}/>
          </li>
          <li className="run">
            <p className="paragraph">An HTML page is made of elements. Most are a pair of tags, such
              as <code className="monospaced">{'<details>'}</code> and <code className="monospaced">{'</details>'}</code>,
              around what they hold. A few, such as <code className="monospaced">{'<input>'}</code>, are a single tag
              and hold nothing.</p>
          </li>
          <li className="run">
            <p className="paragraph">A <Mdn path="Web/HTML/Element/details">details</Mdn> element holds
              a <Mdn path="Web/HTML/Element/summary">summary</Mdn> and the content it hides. The summary is the bar.
              Press one in the accordion at the top of this tab, and the browser shows the rest. Press it again and
              the browser hides it. When a details is open, the browser marks it with an open attribute. An attribute
              is a name, often with a value, written inside an element’s opening tag.</p>
          </li>
          {foldType === 'exclusive' && <li className="run">
            <p className="paragraph">Each of these details carries
              a <Mdn path="Web/HTML/Element/details#name">name</Mdn> attribute, and details that share a name close one
              another: open one and the browser shuts the rest. It needs no CSS and no script.</p>
          </li>}
          <li className="run">
            <p className="paragraph">The browser also remembers whether each fold is open, and says so to a screen
              reader, which is software that reads the page aloud. The fold does not slide. The parts in the list make
              it slide, each on a page of its own, starting with how we did it before the browser could.</p>
          </li>
        </ol>
      </section>
      <section aria-labelledby={tabHeadings.foldChoices} className="fold-choices">
        <h3 id={tabHeadings.foldChoices} className="sub-title bold">The fold choices</h3>
        <p className="paragraph">Two choices, the fold type and the fold motion, set the builds on each part’s own page.
          Each choice is a dial, a control on the page that sets how a build behaves, with a line beside it saying what
          it does. The fold type also reaches the HTML-alone accordion: with exclusive, its details share a name and
          opening one closes the others.</p>
        <p className="paragraph">The fold motion is set in a style sheet. A style sheet is a file of rules. A rule has a
          selector, which names the elements it applies to. It also has properties. A property is one aspect of a look,
          like a height or a color, given a value.</p>
        <p className="paragraph">The fold motion does not reach the HTML-alone accordion. A browser opens a details at
          once on its own. The site’s reset, the style sheet that sets every element’s defaults, slides every details
          where the browser can, and the HTML-alone accordion turns that off, so you see what HTML alone does.</p>
      </section>
    </section>
  </>;
};
