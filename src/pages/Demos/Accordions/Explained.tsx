import {FC} from 'react';
import {
  ExclusiveAccordion,
  ExclusiveCheckboxToggleAccordion,
  ExclusiveRadioToggleAccordion,
  ExclusiveToggleAccordion,
  Fold,
  InclusiveAccordion
} from './Accordions';
import {Mdn, Snippet, plain} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import accordionsSource from './Accordions.tsx?raw';
import accordionsCss from './Accordions.css?raw';
import placementCss from '../../../styles/placement.css?raw';
import resetCss from '../../../styles/reset.css?raw';
import {FocusOnTheBar, OffScreenNotGone, OneJobTwoWays, OneNameOneChoice, PaddingInsideTheClip, RidesTheEdge, RowToItsContent, SizedToTheText, TheGuess, TheSheetReadsTheBox, ThreeBecomeTwo, TwoBordersTurned, WhatEachPromises} from './Diagrams';
import './Explained.css';

export type Contents = {
  checkbox: Fold[];
  radio: Fold[];
  details: Fold[];
  checkboxWithState: Fold[];
  radioWithState: Fold[];
};

const exhibit = 'card rounded-corners lifted padded';
const gap = plain(' ');
const runs = 'runs card rounded-corners lifted padded';

export const AccordionsExplained: FC<{contents: Contents}> = ({contents}) => <>
  <section aria-labelledby="old-way-heading" className="accordion-part">
    <h3 id="old-way-heading" className="title bold">How we used to build a fold</h3>
    <ul className="accordions">
      <li><InclusiveAccordion className={exhibit} content={contents.checkbox}/></li>
      <li><ExclusiveAccordion className={exhibit} content={contents.radio}/></li>
    </ul>
    <ol className={runs}>
      <li className="run">
        <p className="paragraph">Neither build has any script. Everything below is what the
          elements already hold and what the sheet can already read. Each piece stands in for
          something <Mdn path="Web/HTML/Element/details">details</Mdn> now does natively.</p>
      </li>
      <li className="run">
        <p className="paragraph">Natively, details holds whether it is open, and pressing its
          summary turns that on and off. Before details, the only element that held an on and an
          off was a <Mdn path="Web/HTML/Element/input/checkbox">checkbox</Mdn>. So each part is a
          list item holding three things in a fixed order: the checkbox, its label, and the text.
          The label’s <Mdn path="Web/HTML/Attributes/for">for</Mdn> names the box’s id, so
          pressing anywhere on the bar presses the box. The id carries the part’s place in the
          list, so no two boxes share one.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<li key={key} className="fold">', '</li>')}/>
        <OneJobTwoWays/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, summary is both the bar and the control, so there is
          nothing to hide. The trick has two elements where it wants one, so the box has to go.
          Position absolute takes it out of the row, so it leaves no gap. A right offset of
          1000vw puts the box’s right edge a thousand viewports in from the right, which is far
          off the left. Display none would hide it too, but it would also take the box out of the
          tab order, and a keyboard could no longer open the part. Off screen, the box still
          takes focus, still answers the space bar, and is still named by its label.</p>
        <Snippet label="CSS" lines={unit(placementCss, '.off-screen {')}/>
        <OffScreenNotGone/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, details shows its content when it is open, and the
          browser does the showing. The trick needs the sheet to read the box.
          The <Mdn path="Web/CSS/:checked">:checked</Mdn> selector matches a checked box, and ~,
          the <Mdn path="Web/CSS/Subsequent-sibling_combinator">subsequent-sibling
            combinator</Mdn>, reaches any sibling after it. That is why the order is fixed: the
          sheet can only look forward from the box. While the box is not checked, this rule
          collapses the text. No script watches the box; the sheet asks it.</p>
        <Snippet label="CSS" lines={unit(accordionsCss, '.info-toggle:not(:checked) ~ .info {')}/>
        <TheSheetReadsTheBox/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, summary draws its own marker and turns it when the
          details opens. The trick draws one. The label is a flex row, so the part’s name sits at
          one end and the chevron at the other, both centred on the bar’s height. The chevron is
          an empty box drawn after the label’s words, with only its top and right borders, turned
          45 degrees so the corner points right. When the box is checked, the same ~ reaches the
          label, and the corner turns to 135 degrees and points down, over 500 milliseconds. The
          bar has a set height and side padding, so every bar is the same size whatever its word,
          and its colours are the page’s, inverted. The chevron’s padding sizes the box its
          borders outline, and its right margin keeps the corner off the bar’s edge.</p>
        <Snippet label="CSS" lines={[
          ...unit(accordionsCss, '&:not(.close) .info-label {'), gap,
          ...unit(accordionsCss, '&:not(.close) .info-toggle ~ .info-label::after {'), gap,
          ...unit(accordionsCss, '.info-toggle:checked ~ .info-label::after {')
        ]}/>
        <TwoBordersTurned/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, summary takes focus and hover itself. In the trick, the
          box has the focus and the label has the looks, so the sheet carries one to the other.
          When the box has keyboard focus, :focus-visible ~ .info-label gives the bar the
          approach colour and a ring inside its edge. The platform treats a label’s hover as its
          control’s, so :hover on the box lights the bar too. That rule sits under (hover: hover),
          so a tap on a phone does not leave the bar lit. In both, the chevron’s borders take the
          ink colour with the words.</p>
        <Snippet label="CSS" lines={[
          ...unit(accordionsCss, '@media (hover: hover) {'), gap,
          ...unit(accordionsCss, '.info-toggle:focus-visible ~ .info-label {')
        ]}/>
        <FocusOnTheBar/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, the platform can now animate a details to its
          content’s height, as the next part shows. Before, height could not animate to auto, so
          max-height stands in. Open, the text’s max-height is 80rem, a guess taller than any
          part should be. Closed, it is 0, with its padding and top margin gone, and overflow
          hidden clips what the guess lets through. The slide runs at the guess’s pace and not
          the text’s, so a short part opens in a blink and closes after a pause. Text taller than
          the guess is cut off. Opacity and a half-height drop ride along, so the text fades as
          it lands: 500 milliseconds opening, 250 closing.</p>
        <Snippet label="CSS" lines={unit(accordionsCss, '.info {\n      overflow: hidden;\n      max-height')}/>
        <TheGuess/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, details elements that share a name keep one open.
          Before, <Mdn path="Web/HTML/Element/input/radio">radios</Mdn> were the only elements
          with that promise. The radio build is the checkbox build with one change: every radio
          carries the name group, so checking a part unchecks the last one, and the same rule
          closes it. The arrow keys move the choice within a group, so a keyboard opens each part
          it passes.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<li className="fold" key={key}>', '</li>')}/>
        <OneNameOneChoice/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, pressing an open summary closes it. A chosen radio
          stays chosen when pressed. So the list starts with a Close radio, checked by default,
          and choosing it unchecks whichever part was open.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<li className="fold close">', '</li>')}/>
      </li>
      <li className="run">
        <p className="paragraph">The Close bar is shorter than the others and has no text beneath
          it, so it gets its own rule: a flex row that centres its one word. Its label fills the
          whole bar, so a press anywhere on the bar counts.</p>
        <Snippet label="CSS" lines={unit(accordionsCss, '&.close {')}/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, summary is announced as a disclosure with its state,
          collapsed or expanded. The trick is announced as what its markup says it is: a
          checkbox, checked or not checked, or a radio, one of six.</p>
      </li>
    </ol>
  </section>
  <section aria-labelledby="platform-way-heading" className="accordion-part">
    <h3 id="platform-way-heading" className="title bold">What the platform gives now</h3>
    <ExclusiveToggleAccordion className={exhibit} content={contents.details}/>
    <ol className={runs}>
      <li className="run">
        <p className="paragraph">This is what the checkbox, its label, the off-screen box and the
          sibling selectors rebuilt. <Mdn path="Web/HTML/Element/summary">Summary</Mdn> is the
          bar and the control, details holds open and closed, and the keyboard, the marker and
          the announcement come with it. No id, no for, no hidden box, and no sibling
          selector.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<details className="fold"', '</details>')}/>
        <ThreeBecomeTwo/>
      </li>
      <li className="run">
        <p className="paragraph">This is what the radio group was for. Give every details the
          same <Mdn path="Web/HTML/Element/details#name">name</Mdn>, and the browser closes the
          others. Pressing the open one closes it, so no Close is needed.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<details className="fold" name=', '<details className="fold" name=')}/>
      </li>
      <li className="run">
        <p className="paragraph">The bar is the same flex row as the label in the old builds, now
          on summary, in the same colours. List-style none removes summary’s own marker, because
          this bar shows open and closed by its text alone. The hairline border draws the line
          between one bar and the next.</p>
        <Snippet label="CSS" lines={unit(accordionsCss, '.info-label {\n      display: flex;\n      padding')}/>
      </li>
      <li className="run">
        <p className="paragraph">This is what the max-height guess stood in
          for. <Mdn path="Web/CSS/::details-content">::details-content</Mdn> is the part a closed
          details hides, and the sheet can size it. Closed, its block size is 0. Open, it is
          auto, and <Mdn path="Web/CSS/interpolate-size">interpolate-size</Mdn> in the reset lets
          auto animate, over 300 milliseconds. Overflow hidden clips the text while the size
          moves. Content-visibility moves with allow-discrete, so the text stays on the
          page until the slide ends. A browser without these opens the fold at once, and the fold
          still works.</p>
        <Snippet label="CSS" lines={[
          ...unit(accordionsCss, '&::details-content {'), gap,
          ...unit(accordionsCss, '&[open]::details-content {'), gap,
          ...unit(resetCss, ':root {\n  interpolate-size')
        ]}/>
        <SizedToTheText/>
      </li>
      <li className="run">
        <p className="paragraph">There is no script here either.</p>
      </li>
    </ol>
  </section>
  <section aria-labelledby="together-heading" className="accordion-part">
    <h3 id="together-heading" className="title bold">The two together</h3>
    <ul className="accordions">
      <li><ExclusiveCheckboxToggleAccordion className={exhibit} content={contents.checkboxWithState}/></li>
      <li><ExclusiveRadioToggleAccordion className={exhibit} content={contents.radioWithState}/></li>
    </ul>
    <ol className={runs}>
      <li className="run">
        <p className="paragraph">Natively, details with a shared name keeps one open, and a
          second press closes it. A checkbox gives the close but not the one at a time; a radio
          gives the one at a time but not the close. So each build keeps its element for what it
          gives and holds the rest in state: which part is open. On a change, the checkbox build
          opens the part pressed, or clears it if it was already open. The box is still checked
          only when its part is the one held in state, so the state and the box never
          disagree.</p>
        <Snippet label="TS" lines={[
          ...unit(accordionsSource, 'const [checked, updateChecked]'), gap,
          ...span(accordionsSource, 'type="checkbox"\n                  aria-label', 'className="off-screen"/>')
        ]}/>
        <WhatEachPromises/>
      </li>
      <li className="run">
        <p className="paragraph">The radio build takes its one at a time from the group, and
          clears the part on a click of the radio already chosen, which a radio on its own will
          not do. Its shared name makes the radios one group, so the arrow keys move between
          them, and its value is its part’s key, which the change handler reads.</p>
        <Snippet label="TS" lines={span(accordionsSource, 'type="radio"\n                  name="exclusive-checkbox-toggle"', 'className="off-screen"/>')}/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, summary’s state is announced. Here, the bar’s word is
          Open or Close, and each input is named by that word and its part, such as “Open
          basalt”. A listener hears which part a press opens, and a voice user can say the word
          they see.</p>
        <Snippet label="TS" lines={unit(accordionsSource, 'const toggleWord')}/>
      </li>
      <li className="run">
        <p className="paragraph">Natively, ::details-content animates to auto. Here, a grid row
          does it in every browser today. The fold is a grid of two rows: the bar at its
          min-content height, and the text in a row of 0fr. When the fold holds a checked
          input, <Mdn path="Web/CSS/:has">:has(:checked)</Mdn> makes that row 1fr, and 1fr is
          exactly the height the content needs. Grid-template-rows animates between the two over
          300 milliseconds, and the fold’s overflow hidden clips whatever its rows do not
          hold.</p>
        <Snippet label="CSS" lines={[
          ...span(accordionsCss, '  .exclusive-fold {', 'grid-template-rows: min-content 0fr;'), gap,
          ...unit(accordionsCss, '&:has(:checked) {'), gap,
          ...unit(accordionsCss, '&.animated.reveal {')
        ]}/>
        <RowToItsContent/>
      </li>
      <li className="run">
        <p className="paragraph">A row closes only as far as its item can. The row’s item has no
          minimum height, so the row can reach 0. The text’s padding sits further in, inside a
          wrapper whose own row is 0fr and clips, so the padding cannot hold the row open. Take
          the wrappers out and a strip of text shows under every closed bar.</p>
        <Snippet label="CSS" lines={[
          ...unit(accordionsCss, '.info-animated-wrapper {\n      overflow: hidden;'), gap,
          ...unit(accordionsCss, '.info-animated {'), gap,
          ...unit(accordionsCss, '.info {\n      padding: var(--base-x-2);\n    }\n  }\n}')
        ]}/>
        <PaddingInsideTheClip/>
      </li>
      <li className="run">
        <p className="paragraph">The radio build’s text slides down from under its bar. Its
          fold keeps one explicit row, for the bar, so the wrapper sits in a row of its own
          content’s height. The wrapper grows from 0fr to 1fr, and the element inside moves from translateY(-100%) to 0
          over the same 300 milliseconds, both linear, so the text’s bottom edge travels with the
          row’s. It answers no limit. It is there to show what grid and a transform do
          together.</p>
        <Snippet label="CSS" lines={unit(accordionsCss, '&.animated.drawer {')}/>
        <RidesTheEdge/>
      </li>
      <li className="run">
        <p className="paragraph">The Animate and Static choice only adds or removes a class. The
          sheet decides what moves.</p>
        <Snippet label="TS" lines={[
          ...span(accordionsSource, "classNames('exclusive-fold', tab, 'reveal')", "classNames('exclusive-fold', tab, 'reveal')"), gap,
          ...span(accordionsSource, "classNames('exclusive-fold', tab === 'animated'", "classNames('exclusive-fold', tab === 'animated'")
        ]}/>
      </li>
    </ol>
  </section>
</>;
