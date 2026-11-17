import {FC} from 'react';
import {classNames} from '@components';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {DialGroup, FoldType, useControls} from '../Controls';
import {carve, Line, lines, Mdn, Snippet} from '../Recipe';
import {Fold} from './accordion-props';
import {ExclusiveAccordion} from './ExclusiveAccordion';
import {InclusiveAccordion} from './InclusiveAccordion';
import {FoldMotionDial} from './FoldMotionDial';
import {FoldTypeDial} from './FoldTypeDial';
import {FocusOnTheBar, OffScreenNotGone, OneNameOneChoice, TheKnownHeight, TheRuleMatchesTheBox, TwoBordersTurned} from './Diagrams';
import {foldInput} from './fold-input';
import {looks} from './looks';
import {TabPartLink} from './TabPartLink';
import exclusiveAccordionSource from './ExclusiveAccordion.tsx?sample';
import inclusiveAccordionSource from './InclusiveAccordion.tsx?sample';
import accordionsCss from './Accordions.css?sample';
import oldWayMotionCss from './OldWayMotion.css?sample';
import placementCss from '../../../styles/placement.css?sample';
import surfaceCss from '../../../styles/surface.css?sample';
import drawingCss from '../../../styles/drawing.css?sample';
import '../Runs.css';
import {Build} from './build';
import './PartDepth.css';

const foldOf = (input: 'checkbox' | 'radio', typed: string): Line[] => [
  lines.plain('<li class="fold">'),
  lines.plain(`  <input id="fold-0-${input}" class="info-toggle off-screen" ${typed}>`),
  lines.plain(`  <label id="fold-0-${input}-label" class="info-label" for="fold-0-${input}">…</label>`),
  lines.plain('  <div class="info">'),
  lines.plain(`    <section class="info-text" aria-labelledby="fold-0-${input}-label">`),
  lines.plain('      <p class="info-paragraph">…</p>'),
  lines.plain('    </section>'),
  lines.plain('  </div>'),
  lines.plain('</li>')
];

const plainFolds: Record<FoldType, Line[]> = {
  inclusive: foldOf('checkbox', 'type="checkbox"'),
  exclusive: foldOf('radio', 'type="radio" name="group"')
};

const knownHeightBuilds: Record<FoldType, Build> = {
  inclusive: {Accordion: InclusiveAccordion, sample: lines.fromTheExhibit(carve.between(inclusiveAccordionSource, '<li key={heading} className="fold">', '</li>'))},
  exclusive: {Accordion: ExclusiveAccordion, sample: lines.fromTheExhibit(carve.between(exclusiveAccordionSource, '<li className="fold" key={heading}>', '</li>'))}
};

type Props = {
  folds: Record<FoldType, Fold[]>;
};

export const RemembersTheFold: FC<Props> = ({folds}) => {
  const {foldType, foldMotion} = useControls();
  const input = foldInput.of(foldType);
  const {Accordion: KnownHeight, sample} = knownHeightBuilds[foldType];
  return <>
    <p className="paragraph">A fold has to keep whether it is open somewhere. This part keeps it in a hidden input and
      lets a rule in the style sheet read it, with no script. It builds on two places on the accordions tab:
      “<TabPartLink heading="html-alone-heading"/>”, for elements, tags and screen readers,
      and <TabLink to={DemoTopics.accordions} heading="fold-choices-heading">the fold choices</TabLink> after it, for
      style sheets, rules, selectors, properties and the dials.</p>
    <DialGroup>
      <FoldTypeDial/>
      <FoldMotionDial/>
    </DialGroup>
    <KnownHeight className={classNames(looks.exhibit, foldMotion)} folds={folds[foldType]}/>
    <ol className={looks.runs}>
      <li className="run">
        <p className="paragraph">This build is a disclosure: a bar you press to show the text under it.
          Everything below is HTML and CSS: what the elements hold, and what a selector can match.</p>
      </li>
      <li className="run">
        {foldType === 'inclusive'
          ? <p className="paragraph">To open and close a fold, something has to remember which way it is.
            A <Mdn path="Web/HTML/Element/input/checkbox">checkbox</Mdn> remembers: it is either
            checked or not, and pressing it switches between the two. So each fold is a list item
            holding three things, in this order: the checkbox, its label, and the text. An attribute is a
            name, often with a value, written inside an element’s opening tag. An id is an attribute
            whose value is one no other element on the page shares. The
            label’s <Mdn path="Web/HTML/Attributes/for">for</Mdn> attribute names the checkbox’s
            id. That link makes a press anywhere on the label press the checkbox. Each id includes
            the fold’s place in the list, so no two checkboxes share one.</p>
          : <p className="paragraph">To open and close a fold, something has to remember which way it is.
            A <Mdn path="Web/HTML/Element/input/radio">radio</Mdn> remembers: it is either checked or
            not. Radios that share a name form a group, and checking one unchecks the others. So each
            fold is a list item holding three things, in this order: the radio, its label, and the
            text. An attribute is a name, often with a value, written inside an element’s opening tag. An id
            is an attribute whose value no other element on the page shares. The
            label’s <Mdn path="Web/HTML/Attributes/for">for</Mdn> attribute names the radio’s id. That link makes
            a press anywhere on the label press the radio. Each id includes the fold’s place in the list, so no two
            radios share one.</p>}
        <Snippet label="HTML" lines={plainFolds[foldType]}/>
      </li>
      <li className="run">
        <p className="paragraph">Now a rule has to match on whether the {input} is
          checked. <Mdn path="Web/CSS/:checked">:checked</Mdn> is a pseudo-class, a selector that picks an element
          by its state: here, a checked {input}. The ~ is
          a <Mdn path="Web/CSS/Subsequent-sibling_combinator">combinator</Mdn>, a symbol between two selectors
          that says how their elements relate; it picks the siblings that come after the element on its left, the
          elements with the same parent. That is why the order is fixed: the style sheet can only look forward from
          the {input}.
          While it is not checked, this rule collapses the text.</p>
        <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(accordionsCss, '.info-toggle:not(:checked) ~ .info {'))}/>
        <TheRuleMatchesTheBox/>
      </li>
      <li className="run">
        <p className="paragraph">The way to move a fold evenly with no script is a height you know ahead of time.
          Here every panel is the same height, so every fold travels the same distance, and a short fold moves like a
          tall one. The cost is that a short fold leaves room under its text, and a tall one makes you scroll.</p>
        <TheKnownHeight/>
      </li>
      <li className="part-depth">
        <details aria-labelledby="known-depth">
          <summary id="known-depth" className="fold-bar bold">How the known height works</summary>
          <ol className="runs">
            <li className="run">
              <p className="paragraph">The fold is the three parts from the runs above: the {input}, its label and
                the text. The sample beside this run is the same fold
                in <TabLink to={DemoTopics.zIndex}>React</TabLink>, the library
                this site’s script is written in, which writes class
                as <code className="monospaced">className</code> and for
                as <code className="monospaced">htmlFor</code>. A class is a name an element wears so a rule can
                pick it out.</p>
              <Snippet label="TS" lines={sample}/>
            </li>
            <li className="run">
              <p className="paragraph">You want the reader to see a bar, not a {input}, so you hide the {input}.
                Position absolute takes it out of the page’s flow, so it leaves no gap. A vw is a
                hundredth of the window’s width, so a right offset of 1000vw puts the {input} ten
                window widths to the left, far off the page. Display is the property that sets how a box lays
                out what it holds, and display none would hide the {input} too, but it would also take
                the {input} out of the tab order, and a keyboard could no longer open
                the fold. Focus is the element the keyboard will act on. Off screen, the {input} still
                takes focus, still answers the space bar, and
                is still named by its label.</p>
              <Snippet label="CSS" lines={carve.unit(placementCss, '.off-screen {')}/>
              <OffScreenNotGone/>
            </li>
            <li className="run">
              <p className="paragraph">The bar looks like the site’s diagrams: a paper ground with a charcoal hairline
                around it. The old way on the z-index tab wears that look too, so I keep it out of the bar’s own style
                sheet.
                It is a class in a shared style sheet, <code className="monospaced">drawn-piece</code>, and the bar
                wears it: the class sits in the element’s class attribute, so its rules apply. The bar’s own style
                sheet keeps the structure, the row, the padding and the height. The samples that follow show both, the
                style sheet’s rule and then the shared class.</p>
              <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(accordionsCss, '&:not(.close) .info-label {'))}/>
              <Snippet label="CSS" lines={carve.unit(drawingCss, '.drawn-piece {')}/>
            </li>
            <li className="run">
              <p className="paragraph">Each bar shows an arrow that points right while its fold is closed and down
                while it is open. The label is a flex row, which lays its children side by side: the name at one
                end, the arrow at the other. The arrow is an empty box drawn after the label’s words, with only its
                top and right borders, from the shared class <code className="monospaced">corner-after</code>; the
                style sheet sizes it and turns it 45 degrees so the corner points right. The borders are drawn in
                currentcolor, the element’s own text color, so the arrow is drawn in the words’ color. When
                the {input} is checked, the ~
                combinator picks the label after it, and the corner turns to 135 degrees and points down. The turn
                is a transition, and a transform: a transform moves pixels the browser has already painted without
                laying the page out again, so it is cheap.
              {foldMotion === 'static'
                ? ' With static the turn has no transition, so the corner turns at once.'
                : ' With reveal and the drawer, a transition sits on every bar, not on one state, so opening and closing both turn the arrow over 500 milliseconds with ease.'}</p>
              <Snippet label="CSS" lines={[
                ...lines.fromTheExhibit(carve.unit(accordionsCss, '&:not(.close) .info-label {')), lines.blank,
                ...lines.fromTheExhibit(carve.unit(accordionsCss, '.opening-arrow::after {')), lines.blank,
                ...lines.fromTheExhibit(carve.unit(accordionsCss, '.info-toggle:checked ~ .info-label::after {')),
                ...{
                  reveal: [lines.blank, ...lines.fromTheExhibit(carve.unit(accordionsCss, ':is(.reveal, .drawer) &:not(.close) .info-toggle ~ .info-label::after {'))],
                  drawer: [lines.blank, ...lines.fromTheExhibit(carve.unit(accordionsCss, ':is(.reveal, .drawer) &:not(.close) .info-toggle ~ .info-label::after {'))],
                  static: []
                }[foldMotion]
              ]}/>
              <Snippet label="CSS" lines={carve.unit(surfaceCss, '.corner-after::after {')}/>
              <TwoBordersTurned/>
            </li>
            <li className="run">
              <p className="paragraph">A keyboard user needs to see which bar they are on. Here the {input} has the
                focus, but the label is what the reader sees, so the label
                wears <code className="monospaced">prior-approached</code>, a shared class that reads an earlier
                sibling. The :focus-visible pseudo-class picks the {input} while it has keyboard focus,
                and <code className="monospaced">:focus-visible ~ .prior-approached</code> gives the bar the approach
                color, ink for its words and a ring inside its edge. The browser treats hovering a label as hovering
                its {input}, so the class’s :hover rule lights the bar too. That rule sits inside a media
                query, <code className="monospaced">(hover: hover)</code>, which applies its rules only on a device
                whose pointer can hover, so a tap on a phone does not leave the bar lit.</p>
              <Snippet label="CSS" lines={[
                ...carve.unit(surfaceCss, '@media (hover: hover) {\n  :hover ~ .prior-approached'), lines.blank,
                ...carve.unit(surfaceCss, ':focus-visible ~ .prior-approached {')
              ]}/>
              <FocusOnTheBar/>
            </li>
            <li className="run">
              <p className="paragraph">You want the text to slide open, not appear at once. Each fold’s panel is ten
                lines tall: the lh unit is the height of one line, so the panel grows with the text size. Closed, the
                panel’s height is 0 and overflow hidden hides the text.
              {{
                reveal: ' With reveal, the panel’s height moves over 300 milliseconds with ease-in-out, which starts slowly, speeds up and slows to a stop, opening and closing.',
                drawer: ' With the drawer, the height moves over 300 milliseconds with ease-in-out, which starts slowly, speeds up and slows to a stop, and the text slides down from under the bar.',
                static: ' With static, nothing moves: the panel is at its full height or at 0, at once.'
              }[foldMotion]}</p>
              <Snippet label="CSS" lines={[
                ...lines.fromTheExhibit(carve.unit(accordionsCss, '.info,\n    .info-text {')), lines.blank,
                ...lines.fromTheExhibit(carve.unit(accordionsCss, '.info {\n      overflow: hidden;')), lines.blank,
                ...lines.fromTheExhibit(carve.unit(accordionsCss, '.info-toggle:not(:checked) ~ .info {')),
                ...{
                  reveal: [lines.blank, ...lines.fromTheExhibit(carve.unit(oldWayMotionCss, '& .info {\n      transition: height'))],
                  drawer: [lines.blank, ...lines.fromTheExhibit(carve.unit(oldWayMotionCss, '& .info {\n      transition: height'))],
                  static: []
                }[foldMotion]
              ]}/>
            </li>
            <li className="run">
              <p className="paragraph">Inside it, a section of the same height holds the paragraph and scrolls what
                does not fit. Whether a tall fold’s last line is cut off depends on where its lines fall, so the
                section wears <code className="monospaced">foot-shadowed</code>. That class paints a shadow at the
                section’s foot, and over it a cover in the panel’s color that scrolls with the text. The cover hides
                the shadow when the text is at its end, or when the text fits.
              {{
                reveal: ' With reveal, the section sits at the panel’s top, so the text is uncovered from its first line down.',
                drawer: ' With the drawer, the panel lays the section out as a column set at its end, so the section’s bottom stays on the fold’s edge.',
                static: ''
              }[foldMotion]}</p>
              <Snippet label="CSS" lines={[
                ...lines.fromTheExhibit(carve.unit(accordionsCss, '.info-text {\n      overflow-y')), lines.blank,
                ...lines.fromTheExhibit(carve.unit(accordionsCss, '.info-paragraph {')), lines.blank,
                ...lines.fromTheExhibit(carve.unit(surfaceCss, '.foot-shadowed {')),
                ...{
                  reveal: [],
                  drawer: [
                    lines.blank, ...lines.fromTheExhibit(carve.unit(accordionsCss, '.drawer & .info {')), lines.blank,
                    ...lines.fromTheExhibit(carve.unit(accordionsCss, '.drawer & .info-text {'))
                  ],
                  static: []
                }[foldMotion]
              ]}/>
            </li>
            <li className="run">
              <p className="paragraph">The section has a tabindex of 0, so a keyboard can reach it and scroll it,
                and wears <code className="monospaced">focus-ringed</code>, so a keyboard user sees when they have
                reached it. Its bar names it through aria-labelledby, so a screen reader says which fold it is
                reading. Closed, visibility hidden takes the text out of the tab order and out of what a screen reader
                reads.
              {{
                reveal: ' With reveal, visibility moves on the same 300 milliseconds and changes at the visible end, so a closing panel keeps its text until it is shut.',
                drawer: ' With the drawer, visibility moves on the same 300 milliseconds and changes at the visible end, so a closing panel keeps its text until it is shut.',
                static: ''
              }[foldMotion]}</p>
              <Snippet label="CSS" lines={carve.unit(surfaceCss, '.focus-ringed {')}/>
              {foldMotion !== 'static' &&
                <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(oldWayMotionCss, '& .info {\n      transition: height'))}/>}
            </li>
            {foldType === 'exclusive' && <li className="run">
              <p className="paragraph">Every radio in the build has the name group, so checking a fold unchecks the
                last one, and the rule that collapses unchecked text closes it. The arrow keys move the
                choice within a group, so a keyboard opens each fold it passes.</p>
              <OneNameOneChoice/>
            </li>}
            {foldType === 'exclusive' && <li className="run">
              <p className="paragraph">A checked radio stays checked when you press it again, so a fold cannot close
                itself. So the list starts with a Close radio, checked at first, and choosing it unchecks
                whichever fold was open.</p>
              <Snippet label="HTML" lines={lines.fromTheExhibit(carve.between(exclusiveAccordionSource, '<li className="fold close drawn-piece">', '</li>'))}/>
            </li>}
            {foldType === 'exclusive' && <li className="run">
              <p className="paragraph">The Close bar is shorter than the others and has no text beneath it, so it
                gets its own rule: a flex row that centers its one word. Its label fills the whole bar,
                so a press anywhere on the bar counts. It
                wears <code className="monospaced">drawn-piece</code>, the class the other bars wear, which has no hover
                or focus of its own.</p>
              <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(accordionsCss, '&.close {'))}/>
              <Snippet label="CSS" lines={carve.unit(drawingCss, '.drawn-piece {')}/>
            </li>}
            <li className="run">
              <p className="paragraph">A screen reader announces each fold as what its markup says it is:
                {foldType === 'inclusive' ? ' a checkbox, checked or not checked.' : ' a radio, one of six.'}</p>
            </li>
          </ol>
        </details>
      </li>
    </ol>
  </>;
};
