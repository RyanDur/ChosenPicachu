import {FC} from 'react';
import {classNames} from '@components';
import {DialGroup, FoldType, useControls} from '../Controls';
import {FoldMotionDial} from './FoldMotionDial';
import {FoldTypeDial} from './FoldTypeDial';
import {Fold} from './accordion-props';
import {ExclusiveToggleAccordion} from './ExclusiveToggleAccordion';
import {InclusiveToggleAccordion} from './InclusiveToggleAccordion';
import {carve, lines, Mdn, Sample, Snippet} from '../Recipe';
import exclusiveToggleAccordionSource from './ExclusiveToggleAccordion.tsx?sample';
import inclusiveToggleAccordionSource from './InclusiveToggleAccordion.tsx?sample';
import accordionsCss from './Accordions.css?sample';
import inclusiveHtmlAloneSource from './InclusiveHtmlAlone.tsx?sample';
import exclusiveHtmlAloneSource from './ExclusiveHtmlAlone.tsx?sample';
import {InclusiveHtmlAloneAccordion} from './InclusiveHtmlAlone';
import {ExclusiveHtmlAloneAccordion} from './ExclusiveHtmlAlone';
import resetCss from '../../../styles/reset.css?sample';
import surfaceCss from '../../../styles/surface.css?sample';
import {OneGuessTwoFolds, OneJobTwoWays, SizedToTheText, ThreeBecomeTwo} from './Diagrams';
import {foldInput} from './fold-input';
import {looks} from './looks';
import {accordionParts} from './part-pages';
import {PartListing} from './PartListing';
import {RemembersTheFoldLink} from './RemembersTheFoldLink';
import '../Runs.css';
import './Explained.css';
import {Build} from './build';
import './PartDepth.css';

export type FoldLists = {
  platform: Record<FoldType, Fold[]>;
};

const toldRun = 'run card rounded-corners lifted padded';

type HtmlAloneBuild = {
  readonly Accordion: FC;
  readonly source: Sample;
};

const htmlAloneBuilds: Record<FoldType, HtmlAloneBuild> = {
  inclusive: {Accordion: InclusiveHtmlAloneAccordion, source: inclusiveHtmlAloneSource},
  exclusive: {Accordion: ExclusiveHtmlAloneAccordion, source: exclusiveHtmlAloneSource}
};

const platformBuilds: Record<FoldType, Build> = {
  inclusive: {Accordion: InclusiveToggleAccordion, sample: carve.between(inclusiveToggleAccordionSource, '<details className="fold">', '</details>')},
  exclusive: {Accordion: ExclusiveToggleAccordion, sample: carve.between(exclusiveToggleAccordionSource, '<details className="fold" name=', '</details>')}
};

type Props = {
  foldLists: FoldLists;
};

export const AccordionsExplained: FC<Props> = ({foldLists}) => {
  const {foldType, foldMotion} = useControls();
  const exhibitMoving = classNames(looks.exhibit, foldMotion);
  const input = foldInput.of(foldType);
  const {Accordion: HtmlAlone, source: htmlAloneSource} = htmlAloneBuilds[foldType];
  const platform = platformBuilds[foldType];
  const {Accordion: Platform} = platform;
  return <>
    <header className="tab-introduction">
      <p className="paragraph">A web page is written in three languages. HTML says what is on the page, CSS says how it
        looks and moves, and script says what happens when you act.</p>
      <p className="paragraph">Nothing here leans on another tab.</p>
      <p className="paragraph">You don’t always need all three languages. HTML does some jobs alone, and HTML with CSS
        does more, before you need script. If you know how each one works, you can choose the one the job needs. This
        page shows that with one small thing, built several ways.</p>
      <p className="paragraph">The thing is an accordion: a list of parts, each with a bar you press to show or hide the
        text under it. This page calls one of them a fold. HTML alone can show and hide a fold.</p>
      <p className="paragraph">Sliding it open is the hard part. For years, CSS could move a height to a number but not
        to the height the text needs, so the older ways each worked around it: guess a height, measure it with script,
        or set one in advance. Each has a cost.</p>
      <p className="paragraph">By the end you can build an accordion in HTML alone, make it slide with CSS, keep one
        fold open at a time, and say which language each job needed and why. The first accordion below is HTML
        alone.</p>
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
            it and the browser shows the rest. Press it again and the browser hides it.</p>
        </li>
        {foldType === 'exclusive' && <li className="run">
          <p className="paragraph">Each of these details carries
            a <Mdn path="Web/HTML/Element/details#name">name</Mdn> attribute, a setting written inside the element’s
            opening tag, and details that share a name close one another: open one and the browser shuts the rest. It
            needs no CSS and no script.</p>
        </li>}
        <li className="run">
          <p className="paragraph">The browser also remembers whether each fold is open, and says so to a screen reader,
            which is software that reads the page aloud. The fold does not slide. The sections below are about making it
            slide, starting with how we did it before the browser could.</p>
        </li>
      </ol>
    </section>
    <section aria-labelledby="fold-choices-heading" className="fold-choices">
      <h2 id="fold-choices-heading" className="off-screen">fold choices</h2>
      <p className="paragraph">Two choices, the fold type and the fold motion, set the other accordions below. Each
        choice is a dial, a control on the page that sets how a build behaves, with a line beside it saying what it
        does. The fold type also reaches the accordion above: with exclusive, its details share a name and opening one
        closes the others.</p>
      <p className="paragraph">The fold motion is set in a style sheet. A style sheet is a file of rules. A rule has a
        selector, which names the elements it applies to. It also has properties. A property is one aspect of a look,
        like a height or a color, given a value.</p>
      <p className="paragraph">The fold motion does not reach the accordion above. A browser opens a details at once
        on its own. The site’s reset, the style sheet that sets every element’s defaults, slides every details where the
        browser can, and the first accordion turns that off, so you see what HTML alone does.</p>
      <DialGroup>
        <FoldTypeDial/>
        <FoldMotionDial/>
      </DialGroup>
    </section>
    <section aria-labelledby="old-way-heading" className="accordion-part">
      <h2 id="old-way-heading" className="title bold">How we used to build a fold</h2>
      <PartListing part="a-box-remembers-the-fold"/>
      <section className={toldRun} aria-labelledby="max-height-guess-heading">
        <h3 id="max-height-guess-heading" className="run-title sub-title bold">{accordionParts.titleOf('max-height-guess-heading')}</h3>
        <p className="paragraph">When the height isn’t known ahead of time, most of us slid a fold open with a guess. A transition is CSS
          moving a property from its old value to its new one over a set time. It can move a height to a number but not
          to auto, the height the text needs, so we moved <RemembersTheFoldLink>the
            panel</RemembersTheFoldLink>’s <Mdn path="Web/CSS/max-height">max-height</Mdn> instead,
          from 0 to a number taller than any fold would need, such as 1000px. The panel stopped at its own text, so
          nothing scrolled. The cost was the timing. The transition spent its whole time crossing the guess, so a short
          fold opened in a rush and then sat still, and on closing it waited, unmoving, until the guess fell to its
          text. The bigger the guess, the worse the rush and the wait. A guess too small cut the text off.</p>
        <Snippet label="CSS" lines={[
          lines.plain('.info {'),
          lines.plain('  max-height: 0;'),
          lines.plain('  overflow: hidden;'),
          lines.plain('  transition: max-height .3s ease-in-out;'),
          lines.plain('}'),
          lines.blank,
          lines.plain('.info-toggle:checked ~ .info {'),
          lines.plain('  max-height: 1000px;'),
          lines.plain('}')
        ]}/>
        <OneGuessTwoFolds/>
      </section>
      <PartListing part="the-measured-height"/>
    </section>
    <section aria-labelledby="platform-way-heading" className="accordion-part">
      <h2 id="platform-way-heading" className="title bold">{accordionParts.titleOf('platform-way-heading')}</h2>
      <Platform className={exhibitMoving} folds={foldLists.platform[foldType]}/>
      <ol className={looks.runs}>
        <li className="run">
          <p className="paragraph">This build uses details and summary, the two elements from the first accordion. Each
            piece of <RemembersTheFoldLink>the {input} build</RemembersTheFoldLink> has a native
            piece in its place. Summary is the bar and the control at once, so nothing has to tie a label to a
            hidden {input}. Details remembers whether it is open, so there is no {input} to hide and no rule that reads
            it. The keyboard comes with it, and a screen reader announces the bar as a disclosure, collapsed or
            expanded.
          {foldType === 'inclusive' && <> With nothing more, each fold opens and closes on its own,
            as <RemembersTheFoldLink>the checkbox build’s folds</RemembersTheFoldLink> do.</>}
          {foldType === 'exclusive' && ' Every details here shares a name, as the first accordion’s details do above. Pressing the open one closes it, so the list needs no Close bar.'} This build replaces the
            three old ways: the max-height guess, the height measured by script, and the known height.</p>
          <Snippet label="TS" lines={platform.sample}/>
          <OneJobTwoWays input={input}/>
          <ThreeBecomeTwo/>
        </li>
        <li className="part-depth">
          <details aria-labelledby="details-depth">
            <summary id="details-depth" className="fold-bar bold">How details works</summary>
            <ol className="runs">
              <li className="run">
                <p className="paragraph">The bar is the same flex row as the label
                  in <RemembersTheFoldLink>the {input} build</RemembersTheFoldLink>, now on
                  summary. Its classes are the site’s own: <code className="monospaced">inverse-filled</code> for its
                  colors, <code className="monospaced">attentive</code> for
                  the approach color, the ring and a glow while it is pressed,
                  and <code className="monospaced">field-outlined</code> for the
                  hairline that draws the line between one bar and the next. Summary takes focus and hover itself,
                  where the {input} build carried focus from the hidden {input} to the label.</p>
                <Snippet label="CSS" lines={[
                  ...carve.unit(accordionsCss, '.info-label {\n      display: flex;\n      padding'), lines.blank,
                  ...carve.unit(surfaceCss, '.inverse-filled {'), lines.blank,
                  ...carve.unit(surfaceCss, '.attentive:where(:not(:disabled)) {'), lines.blank,
                  ...carve.unit(surfaceCss, '.field-outlined {')
                ]}/>
              </li>
              <li className="run">
                <p className="paragraph">Summary also draws its own arrow, called a marker, where the {input} build
                  drew one from two borders. The browser gives a summary the display of a list item, and draws a marker
                  only on a list item. This bar’s display is flex, a row, so the browser draws no marker. The bar draws
                  the same arrow as <RemembersTheFoldLink>the known-height build’s bars</RemembersTheFoldLink> in its
                  place.</p>
              </li>
              <li className="run">
                <p className="paragraph">The arrow points right while the fold is closed. When the fold opens, the
                  browser adds an open attribute to the details in the page it is showing, as if it were written in the
                  opening tag. <code className="monospaced">[open]</code> is a piece of a CSS rule that picks an element
                  with that attribute, and its rule turns the arrow down.</p>
                <Snippet label="CSS" lines={carve.unit(accordionsCss, '&[open] > .info-label::after {')}/>
              </li>
              <li className="run">
                <p className="paragraph">A pseudo-element is a part of an element
                  that CSS can style as if it were an element of its
                  own. <Mdn path="Web/CSS/::details-content">::details-content</Mdn> is the part a closed
                  details hides. Here it is a grid, the CSS layout that sets a box out in rows and columns, with
                  one row. The fr is a grid unit for a share of the space. In a grid sized to its content, a row of
                  1fr is exactly as tall as its content needs, and a row of 0fr has no height. The row is 0fr while
                  the fold is closed and 1fr while it is open. A row in fr is a number, so 0fr to 1fr is a number
                  growing, which a transition can move. The row always ends at the text’s own height, so nothing is
                  guessed, measured or fixed. The site’s reset gives every details’ hidden part a height of 0 while it
                  is closed, so this one sets its height back to auto and leaves the closing to the row.
                {{
                  reveal: ' With reveal, the row moves over 300 milliseconds with ease-in-out, and the text shows from its top down. Align-items: start, in the sample, keeps the text at the top of its row while the row shrinks. Without it, Safari snaps a closing fold shut instead of sliding it. Content-visibility hides the closed content, and it has no values between on and off. Allow-discrete lets a property like that switch at the end of a close and at the start of an open. That keeps the text visible for the whole slide.',
                  drawer: ' With the drawer, the row moves on the same 300 milliseconds and sets the text at its bottom, so the text’s bottom edge stays on the fold’s edge as it slides down from under the bar. Content-visibility hides the closed content and has no values between on and off; allow-discrete lets it switch at the end of a close and at the start of an open, which keeps the text visible for the whole slide.',
                  static: ' With static, the part a details hides has no transition, so the fold opens at once, in every browser.'
                }[foldMotion]}</p>
                <Snippet label="CSS" lines={[
                  ...carve.unit(accordionsCss, '&::details-content {'), lines.blank,
                  ...carve.unit(accordionsCss, '&[open]::details-content {'),
                  ...{
                    reveal: [lines.blank, ...carve.unit(accordionsCss, ':is(.reveal, .drawer) &::details-content {'), lines.blank, ...carve.unit(accordionsCss, '.reveal &::details-content {')],
                    drawer: [lines.blank, ...carve.unit(accordionsCss, ':is(.reveal, .drawer) &::details-content {')],
                    static: []
                  }[foldMotion],
                  ...(foldMotion === 'drawer' ? [lines.blank, ...carve.unit(accordionsCss, '.drawer &::details-content {')] : [])
                ]}/>
                <SizedToTheText/>
              </li>
              <li className="run">
                <p className="paragraph">A row closes only as far as its item can. The text has a minimum height of 0,
                  so the row can shrink to nothing, and its padding sits on a span inside it, where it cannot hold the
                  row open. With the padding on the text itself, every fold jumped open by the padding’s height before
                  it began to slide.</p>
                <Snippet label="CSS" lines={[
                  ...carve.unit(accordionsCss, '.info {\n      min-block-size: 0;'), lines.blank,
                  ...carve.unit(accordionsCss, '.fold-text {')
                ]}/>
              </li>
              <li className="run">
                <p className="paragraph">There is no script here either.</p>
              </li>
            </ol>
          </details>
        </li>
      </ol>
    </section>
    <section aria-labelledby="motion-heading" className="accordion-part">
      <h2 id="motion-heading" className="title bold">{accordionParts.titleOf('motion-heading')}</h2>
      <ol className={looks.runs}>
        <li className="run">
          <p className="paragraph">Every fold on this tab that slides moves by transition, never by animation, because a
            reader may press again before the fold lands. If they do,
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
