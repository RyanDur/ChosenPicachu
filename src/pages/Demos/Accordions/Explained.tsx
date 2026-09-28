import {FC} from 'react';
import {
  ExclusiveAccordion,
  ExclusiveCheckboxToggleAccordion,
  ExclusiveRadioToggleAccordion,
  ExclusiveToggleAccordion,
  Fold,
  InclusiveAccordion,
  InclusiveCheckboxToggleAccordion,
  InclusiveToggleAccordion
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
  inclusiveDetails: Fold[];
  details: Fold[];
  inclusiveCheckboxWithState: Fold[];
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
      <li className="build"><InclusiveAccordion className={exhibit} content={contents.checkbox}/></li>
      <li className="build"><ExclusiveAccordion className={exhibit} content={contents.radio}/></li>
    </ul>
    <ol className={runs}>
      <li className="run">
        <p className="paragraph">Each of these builds is a disclosure: a bar you press to show the text under it.
          Neither build has any script. Everything below is HTML and CSS:
          what the elements hold, and what the stylesheet can read.</p>
      </li>
      <li className="run">
        <p className="paragraph">To open and close a part, something has to remember which way it is.
          A <Mdn path="Web/HTML/Element/input/checkbox">checkbox</Mdn> remembers: it is either
          checked or not, and pressing it switches between the two. So each part is a list item
          holding three things, in this order: the checkbox, its label, and the text. The
          label’s <Mdn path="Web/HTML/Attributes/for">for</Mdn> attribute names the checkbox’s
          id. That link makes a press anywhere on the label press the checkbox. Each id includes
          the part’s place in the list, so no two checkboxes share one.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<li key={key} className="fold">', '</li>')}/>
      </li>
      <li className="run">
        <p className="paragraph">You want the reader to see a bar, not a checkbox, so you hide the checkbox.
          Position absolute takes it out of the page’s flow, so it leaves no gap. A vw is a
          hundredth of the window’s width, so a right offset of 1000vw puts the checkbox ten
          window widths to the left, far off the page. Display none would hide it too, but it
          would also take the checkbox out of the tab order, and a keyboard could no longer open
          the part. Focus is the element the keyboard will act on. Off screen, the checkbox still
          takes focus, still answers the space bar, and
          is still named by its label.</p>
        <Snippet label="CSS" lines={unit(placementCss, '.off-screen {')}/>
        <OffScreenNotGone/>
      </li>
      <li className="run">
        <p className="paragraph">Now the stylesheet needs to know whether the checkbox is checked. A selector
          is the part of a CSS rule that picks which elements the rule styles. A pseudo-class is a
          selector that picks an element by its state rather than by its name,
          and <Mdn path="Web/CSS/:checked">:checked</Mdn> picks a checked checkbox. Elements with
          the same parent are siblings. A combinator is a symbol between two selectors that says
          how their elements relate. The ~ is
          the <Mdn path="Web/CSS/Subsequent-sibling_combinator">subsequent-sibling
            combinator</Mdn>: it picks the siblings that come after the first element. That is why
          the order is fixed, because the stylesheet can only look forward from the checkbox. While
          the checkbox is not checked, this rule collapses the text. No script watches the checkbox;
          the stylesheet reads it.</p>
        <Snippet label="CSS" lines={unit(accordionsCss, '.info-toggle:not(:checked) ~ .info {')}/>
        <TheSheetReadsTheBox/>
      </li>
      <li className="run">
        <p className="paragraph">Each bar shows an arrow that points right while its part is closed and down
          while it is open. The label is a flex row, which lays its children side by side: the
          part’s name sits at one end and the arrow at the other, both centred on the bar’s height.
          The arrow is an empty box drawn after the label’s words, with only its top and right
          borders, turned 45 degrees so the corner points right. When the checkbox is checked, the
          ~ combinator picks the label after it, and the corner turns to 135 degrees and points
          down. A transition moves a property from its old value to its new one over a set time,
          whenever the value changes. This one sits on every bar, not on one state, so opening and
          closing both turn the arrow over 500 milliseconds with ease. A transform, such as this
          turn, moves pixels the browser has already painted, without laying out the page again,
          so a turn is cheap. The bar has a set height and side padding, so every bar is the same
          size whatever its word, and its colours are the page’s, inverted. The arrow’s width and
          height size the box its borders outline, and its right margin keeps the corner off the
          bar’s edge.</p>
        <Snippet label="CSS" lines={[
          ...unit(accordionsCss, '&:not(.close) .info-label {'), gap,
          ...unit(accordionsCss, '&:not(.close) .info-toggle ~ .info-label::after {'), gap,
          ...unit(accordionsCss, '.info-toggle:checked ~ .info-label::after {')
        ]}/>
        <TwoBordersTurned/>
      </li>
      <li className="run">
        <p className="paragraph">A keyboard user needs to see which bar they are on. Here the checkbox has the focus, but the label is what the reader
          sees, so the stylesheet carries one to the other. The :focus-visible pseudo-class picks
          the checkbox while it has keyboard focus, and :focus-visible ~ .info-label gives the
          bar the approach colour and a ring inside its edge. The browser treats hovering a label
          as hovering its checkbox, so :hover on the checkbox lights the bar too. That rule sits
          inside a media query, (hover: hover), which applies its rules only on a device whose
          pointer can hover, so a tap on a phone does not leave the bar lit. In both, the arrow’s
          borders take the ink colour with the words.</p>
        <Snippet label="CSS" lines={[
          ...unit(accordionsCss, '@media (hover: hover) {'), gap,
          ...unit(accordionsCss, '.info-toggle:focus-visible ~ .info-label {')
        ]}/>
        <FocusOnTheBar/>
      </li>
      <li className="run">
        <p className="paragraph">The text should slide open, not appear at once. A transition cannot move a
          height to auto, the height the content needs, so max-height stands in: a height the text
          may grow to but not past. Open, the text’s max-height is 80rem, a guess taller than any
          part should be. Closed, it is 0, with its padding and top margin gone, and overflow
          hidden hides whatever does not fit. Text taller than the guess is cut off. The
          transition that runs is the one on the state being entered. The open rule has 500
          milliseconds, so opening takes 500; the closed rule has 250, so closing takes 250. Both
          use ease, which starts quickly and slows to a stop. Max-height travels the full 80rem
          either way. While it is above the text’s height, nothing visible changes, and the text
          only starts to hide once max-height drops below it. So a short part is fully open
          within the first few frames, and on closing it stays whole until the last few. That is
          the blink and the pause. Opacity, the half-height drop, the top margin and the bottom
          padding all move on the same transition, so the text fades in as it rises into place,
          and its spacing opens with it.</p>
        <Snippet label="CSS" lines={[
          ...unit(accordionsCss, '.info {\n      overflow: hidden;\n      max-height'), gap,
          ...unit(accordionsCss, '.info-toggle:not(:checked) ~ .info {')
        ]}/>
        <TheGuess/>
      </li>
      <li className="run">
        <p className="paragraph">The second build keeps only one part open at a time.
          A <Mdn path="Web/HTML/Element/input/radio">radio</Mdn> does that: radios that share a name
          form a group, and checking one unchecks the others. The radio build is the checkbox build
          with one change. Every radio has the name group, so checking a part unchecks the last
          one, and the same rule closes it. The arrow keys move the choice within a group, so a
          keyboard opens each part it passes.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<li className="fold" key={key}>', '</li>')}/>
        <OneNameOneChoice/>
      </li>
      <li className="run">
        <p className="paragraph">A checked radio stays checked when you press it again, so a part cannot close
          itself. So the list starts with a Close radio, checked at first, and choosing it unchecks
          whichever part was open.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<li className="fold close">', '</li>')}/>
      </li>
      <li className="run">
        <p className="paragraph">The Close bar is shorter than the others and has no text beneath it, so it
          gets its own rule: a flex row that centres its one word. Its label fills the whole bar,
          so a press anywhere on the bar counts.</p>
        <Snippet label="CSS" lines={unit(accordionsCss, '&.close {')}/>
      </li>
      <li className="run">
        <p className="paragraph">A screen reader announces each part as what its markup says it is: a
          checkbox, checked or not checked, or a radio, one of six.</p>
      </li>
    </ol>
  </section>
  <section aria-labelledby="platform-way-heading" className="accordion-part">
    <h3 id="platform-way-heading" className="title bold">What the platform gives now</h3>
    <ul className="accordions">
      <li className="build"><InclusiveToggleAccordion className={exhibit} content={contents.inclusiveDetails}/></li>
      <li className="build"><ExclusiveToggleAccordion className={exhibit} content={contents.details}/></li>
    </ul>
    <ol className={runs}>
      <li className="run">
        <p className="paragraph">HTML now has a disclosure of its own:
          the <Mdn path="Web/HTML/Element/details">details</Mdn> element. Its first child,
          a <Mdn path="Web/HTML/Element/summary">summary</Mdn>, is the bar, and everything after it
          is the text the bar shows and hides. Each piece of the checkbox build has a native
          piece in its place. Summary is the bar and the control at once, so there is no label,
          no for and no id. Details remembers whether it is open, so there is no checkbox to
          hide and no sibling selector to read it. The keyboard comes with it, and a screen
          reader announces the bar as a disclosure, collapsed or expanded. With nothing more,
          each part opens and closes on its own, as the checkbox build’s parts do. That is the
          inclusive build.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<details className="fold"', '</details>')}/>
        <OneJobTwoWays/>
        <ThreeBecomeTwo/>
      </li>
      <li className="run">
        <p className="paragraph">This replaces the radio group. Give every details the
          same <Mdn path="Web/HTML/Element/details#name">name</Mdn>, and the browser closes the
          others when one opens. Pressing the open one closes it, so no Close radio is needed.</p>
        <Snippet label="TS" lines={span(accordionsSource, '<details className="fold" name=', '<details className="fold" name=')}/>
      </li>
      <li className="run">
        <p className="paragraph">The bar is the same flex row as the label in the checkbox build, now on
          summary, in the same colours. Summary takes focus and hover itself, where the checkbox
          build carried focus from the hidden checkbox to the label. Summary also draws its own
          arrow, called a marker, where the checkbox build drew one from two borders. List-style
          none removes that marker, because this bar shows open and closed by its word alone. The
          hairline border draws the line between one bar and the next.</p>
        <Snippet label="CSS" lines={unit(accordionsCss, '.info-label {\n      display: flex;\n      padding')}/>
      </li>
      <li className="run">
        <p className="paragraph">This replaces the max-height guess. A pseudo-element is a part of an element
          that CSS can style as if it were an element of its
          own. <Mdn path="Web/CSS/::details-content">::details-content</Mdn> is the part a closed
          details hides. Closed, its block size, its height, is 0. Open, it is auto. Auto is a
          keyword, not a number, and a transition cannot move to a keyword on its
          own. <Mdn path="Web/CSS/interpolate-size">interpolate-size</Mdn> in the reset lets a size
          move to and from keywords like auto. The slide takes 300 milliseconds with ease-in-out,
          which starts slowly, speeds up, and settles, and overflow hidden hides the text the size
          does not hold yet. Content-visibility, which hides the closed content, has no values
          between on and off, so allow-discrete lets it switch at the end of a close and at the
          start of an open. That keeps the text visible for the whole slide. Today only Chromium
          does both; other browsers open the fold at once, and it still works.</p>
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
      <li className="build"><InclusiveCheckboxToggleAccordion className={exhibit} content={contents.inclusiveCheckboxWithState}/></li>
      <li className="build"><ExclusiveCheckboxToggleAccordion className={exhibit} content={contents.checkboxWithState}/></li>
      <li className="build"><ExclusiveRadioToggleAccordion className={exhibit} content={contents.radioWithState}/></li>
    </ul>
    <ol className={runs}>
      <li className="run">
        <p className="paragraph">The two exclusive builds keep only one part open, and a second press on the
          open part closes it. Details does both with a shared name. A checkbox can close itself but cannot
          keep the others shut; a radio keeps the others shut but cannot close itself. So each
          build keeps its element for what it gives, and holds the rest in React state: a value
          the component remembers, here which part is open. When a checkbox changes, the
          checkbox build opens the part pressed, or clears it if it was already open. A checkbox
          is checked only when its part is the one held in state, so the state and the checkbox
          always agree.</p>
        <Snippet label="TS" lines={[
          ...unit(accordionsSource, 'const [checked, updateChecked]'), gap,
          ...span(accordionsSource, 'type="checkbox"\n                  aria-label', 'className="off-screen"/>')
        ]}/>
        <WhatEachPromises/>
      </li>
      <li className="run">
        <p className="paragraph">The inclusive build lets every part open on its own, as a checkbox already
          does. It holds a list of the open parts in state, so each bar can say Open or Close. A
          change adds the part pressed to the list, or takes it out if it was there.</p>
        <Snippet label="TS" lines={[
          ...unit(accordionsSource, 'const [opened, updateOpened]'), gap,
          ...unit(accordionsSource, 'const isOpen = '), gap,
          ...span(accordionsSource, 'onChange={() => updateOpened', 'onChange={() => updateOpened')
        ]}/>
      </li>
      <li className="run">
        <p className="paragraph">The radio build takes one part at a time from its group, and adds the close:
          a click on the radio already chosen clears the part, which a radio on its own will not
          do. The shared name makes the radios one group, so the arrow keys move between them.
          Each radio’s value is its part’s key, which the change handler reads.</p>
        <Snippet label="TS" lines={span(accordionsSource, 'type="radio"\n                  name="exclusive-checkbox-toggle"', 'className="off-screen"/>')}/>
      </li>
      <li className="run">
        <p className="paragraph">A screen reader announces summary’s state for you, but not a checkbox’s part.
          Here the bar’s word is Open or Close, and each input is named by that word and its
          part, such as “Open basalt”. A listener hears which part a press opens, and someone
          using voice control can say the word they see.</p>
        <Snippet label="TS" lines={unit(accordionsSource, 'const toggleWord')}/>
      </li>
      <li className="run">
        <p className="paragraph">Details slides to its content’s height with ::details-content, but only in
          Chromium. A grid row does the same in every browser today. Under the bar, the fold’s
          paragraph is a grid with one row. The fr is a grid unit for a share of the space. In a
          grid sized to its content, a row of 1fr is exactly as tall as its content needs. A row
          of 0fr has no height. The row is 0fr while the fold is closed.
          The <Mdn path="Web/CSS/:has">:has()</Mdn> pseudo-class picks an element by what it
          contains, so :has(:checked) makes that row 1fr when the fold holds a checked input. A
          row in fr is a number, so 0fr to 1fr is a number growing, which a transition can move.
          Grid-template-rows moves between the two over 300 milliseconds with ease-in-out, so the
          fold starts gently and settles. The paragraph’s overflow hidden hides whatever its row
          does not hold. The row always ends at the content’s own height, so there is no guess to
          wait on.</p>
        <Snippet label="CSS" lines={[
          ...unit(accordionsCss, '.fold-clip {'), gap,
          ...unit(accordionsCss, '&:has(:checked) .fold-clip {'), gap,
          ...unit(accordionsCss, '&.animated.reveal .fold-clip {')
        ]}/>
        <RowToItsContent/>
      </li>
      <li className="run">
        <p className="paragraph">A row closes only as far as its item can. The paragraph’s item is a span with
          no minimum height, so the row can shrink to 0. The text’s padding sits on a span inside
          that one, where it cannot hold the row open. A paragraph may hold spans, so the text
          needs no other element. If you put the padding on the item, a strip of text shows under
          every closed bar. If you let the fold’s own row move and the paragraph clip inside it,
          the clip falls behind the row while it moves, and a blank band shows under the text.</p>
        <Snippet label="CSS" lines={[
          ...unit(accordionsCss, '.fold-clip-item {'), gap,
          ...unit(accordionsCss, '.fold-text {\n      display: block;')
        ]}/>
        <PaddingInsideTheClip/>
      </li>
      <li className="run">
        <p className="paragraph">The radio build’s text slides down from under its bar, like a
          drawer. Its paragraph grows from 0fr to 1fr, as the checkbox build’s does. Between the
          two, the row is shorter than the paragraph around it, so align-content: end sets the row
          at the paragraph’s bottom. Align-self: end sets the item at the row’s bottom, as tall as
          its text. So the text’s bottom edge stays on the fold’s edge at every frame, and the
          paragraph’s overflow hides the text above the fold. One transition moves it all, so no
          part can fall behind another. It answers no limit. It is there to show what grid
          alignment does on its own.</p>
        <Snippet label="CSS" lines={unit(accordionsCss, '&.animated.drawer {')}/>
        <RidesTheEdge/>
      </li>
      <li className="run">
        <p className="paragraph">The Animate and Static choice only adds or removes a class. The stylesheet
          decides what moves: Static removes the class that holds the transition, so the row
          changes in a single frame.</p>
        <Snippet label="TS" lines={[
          ...span(accordionsSource, "classNames('exclusive-fold', tab, 'reveal')", "classNames('exclusive-fold', tab, 'reveal')"), gap,
          ...span(accordionsSource, "classNames('exclusive-fold', tab === 'animated'", "classNames('exclusive-fold', tab === 'animated'")
        ]}/>
      </li>
    </ol>
  </section>
  <section aria-labelledby="motion-heading" className="accordion-part">
    <h3 id="motion-heading" className="title bold">How every fold moves</h3>
    <ol className={runs}>
      <li className="run">
        <p className="paragraph">Every fold on this tab moves by transition, never by animation.
          A <Mdn path="Web/CSS/CSS_transitions">transition</Mdn> moves a property from its old value
          to its new one when the value changes. If the value changes back midway, it turns
          around from wherever it is. An <Mdn path="Web/CSS/CSS_animations">animation</Mdn> plays
          a set of keyframes on its own clock, whatever the state does. A fold moves because the
          reader pressed it, and a reader may press again before it lands, so every build here
          uses transitions. A reader who asks their system for less motion gets none of it, as
          the next run explains.</p>
      </li>
      <li className="run">
        <p className="paragraph">A reader who asks their system
          for <Mdn path="Web/CSS/@media/prefers-reduced-motion">less motion</Mdn> gets every fold on
          this tab open at once. The reset, the stylesheet that sets every element’s defaults, has
          a reduced-motion block with three rules. The first uses the universal selector, *, which
          picks every element and reaches their before and after too. It cuts each transition and
          animation to 0.01 milliseconds, plays each animation once, and turns smooth scrolling
          into a jump. The second names ::details-content, the part a details hides, which the
          universal selector cannot reach. The third lets view transitions, the browser’s moves
          from one page state to the next, play nothing. The duration is not zero because a
          transition that never runs never ends, and some scripts wait for a transition to
          end.</p>
        <Snippet label="CSS" lines={unit(resetCss, '@media (prefers-reduced-motion: reduce) {')}/>
      </li>
    </ol>
  </section>
</>;
