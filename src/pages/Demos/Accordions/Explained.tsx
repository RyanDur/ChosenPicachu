import {FC} from 'react';
import {useControls} from '../Controls';
import {Exhibit, ExhibitDials} from '../Exhibit';
import {FoldType} from '../ReaderSettings';
import {carve, Mdn, Sample, Snippet} from '../Recipe';
import inclusiveHtmlAloneSource from './InclusiveHtmlAlone.tsx?sample';
import exclusiveHtmlAloneSource from './ExclusiveHtmlAlone.tsx?sample';
import {InclusiveHtmlAloneAccordion} from './InclusiveHtmlAlone';
import {ExclusiveHtmlAloneAccordion} from './ExclusiveHtmlAlone';
import {looks} from './looks';
import {accordionParts} from './part-pages';
import {PageWithParts} from '../PageWithParts';
import {FoldTypeDial} from './FoldTypeDial';
import {tabHeadings} from './tab-headings';
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
  return <PageWithParts>
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
    </header>
    <Exhibit name={accordionParts.titleOf('html-alone-heading')} heading="html-alone-heading" writtenIn={['html']}>
      <figure className="snapping">
        <HtmlAlone/>
      </figure>
      <ExhibitDials>
        <FoldTypeDial/>
      </ExhibitDials>
    </Exhibit>
    <section aria-labelledby={tabHeadings.exhibitSource} className="exhibit-source">
      <h2 id={tabHeadings.exhibitSource} className="sub-title bold">The exhibit’s source</h2>
      <ol className={looks.runs}>
        <li className="run">
          <Snippet label="HTML" lines={carve.between(htmlAloneSource, '<ul>', '</ul>')}/>
        </li>
        <li className="run">
          <p className="paragraph">The fold type under the accordion is a dial: a control on the page that sets how a
            build behaves.</p>
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
        <li className="run">
          <p className="paragraph">A style sheet is a file of rules. A rule has a selector, which names the elements it
            applies to. It also has properties. A property is one aspect of a look, like a height or a color, given a
            value.</p>
        </li>
      </ol>
    </section>
  </PageWithParts>;
};
