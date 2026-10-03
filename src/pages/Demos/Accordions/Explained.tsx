import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {
  ExclusiveAccordion,
  ExclusiveMeasuredAccordion,
  ExclusiveRadioToggleAccordion,
  ExclusiveToggleAccordion,
  Fold,
  InclusiveAccordion,
  InclusiveCheckboxToggleAccordion,
  InclusiveMeasuredAccordion,
  InclusiveToggleAccordion
} from './Accordions';
import {Mdn, plain, Snippet} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import accordionsSource from './Accordions.tsx?raw';
import accordionsCss from './Accordions.css?raw';
import measuredSource from './measured.ts?raw';
import htmlAloneSource from './HtmlAlone.tsx?raw';
import {HtmlAloneAccordion} from './HtmlAlone';
import placementCss from '../../../styles/placement.css?raw';
import resetCss from '../../../styles/reset.css?raw';
import {
  FocusOnTheBar,
  OffScreenNotGone,
  OneJobTwoWays,
  OneNameOneChoice,
  PaddingInsideTheClip,
  RidesTheEdge,
  RowToItsContent,
  SizedToTheText,
  TheKnownHeight,
  OneGuessTwoParts,
  TheSheetReadsTheBox,
  ThreeBecomeTwo,
  TwoBordersTurned,
  WhatEachPromises
} from './Diagrams';
import {FoldInput, FoldType} from './fold-type';
import {FoldMotion} from './fold-motion';
import '../Recipe/Runs.css';
import './Explained.css';

export type Contents = {
  measuredCheckbox: Fold[];
  measuredRadio: Fold[];
  knownCheckbox: Fold[];
  knownRadio: Fold[];
  inclusiveDetails: Fold[];
  exclusiveDetails: Fold[];
  inclusiveCheckboxes: Fold[];
  exclusiveRadios: Fold[];
};

const exhibit = 'card rounded-corners lifted padded';
const gap = plain(' ');
const runs = 'runs card rounded-corners lifted padded';
const toldRun = 'run card rounded-corners lifted padded';
const inputOf: Record<FoldType, FoldInput> = {inclusive: 'checkbox', exclusive: 'radio'};
const foldTypes = [{display: 'Inclusive', value: 'inclusive'}, {display: 'Exclusive', value: 'exclusive'}] as const;
const foldMotions = [{display: 'Reveal', value: 'reveal'}, {display: 'Drawer', value: 'drawer'}, {display: 'Static', value: 'static'}] as const;

type Props = {
  contents: Contents;
  type: FoldType;
  onTypeChosen: (type: FoldType) => void;
  motion: FoldMotion;
  onMotionChosen: (motion: FoldMotion) => void;
};

export const AccordionsExplained: FC<Props> = ({contents, type, onTypeChosen, motion, onMotionChosen}) => {
  const input = inputOf[type];
  return <>
    <header className="tab-introduction">
      <p className="paragraph">An accordion is a list of parts. Each part has a bar you press to show or hide the text
        under it. This page calls one part a fold.</p>
      <p className="paragraph">Showing and hiding is easy. The motion is hard. A fold should slide open to the height
        of its own text, at an even pace. For years, CSS could move a height to a number but not to the height the text
        needs. So the older ways each worked around it: guess a height, measure it with script, or set one in advance.
        Each has a cost, and a guess is the one that makes the motion uneven.</p>
      <p className="paragraph">A web page is written in three languages. HTML says what is on the page, CSS says how it
        looks and moves, and script says what happens when you act. This page starts with HTML alone, and brings in CSS
        and then script only where they are needed.</p>
      <p className="paragraph">By the end you can build an accordion in HTML alone, make it slide with CSS, keep one fold
        open at a time, and say what each older way costs. The first accordion below is HTML alone.</p>
    </header>
    <section aria-labelledby="html-alone-heading" className="accordion-part">
      <h3 id="html-alone-heading" className="title bold">An accordion in HTML alone</h3>
      <ol className={runs}>
        <li className="run">
          <HtmlAloneAccordion/>
          <Snippet label="HTML" lines={span(htmlAloneSource, '<ul>', '</ul>')}/>
        </li>
        <li className="run">
          <p className="paragraph">An HTML page is made of elements. Each is a pair of tags, such as {'<details>'} and
            {' </details>'}, around what it holds. A <Mdn path="Web/HTML/Element/details">details</Mdn> element holds
            a <Mdn path="Web/HTML/Element/summary">summary</Mdn> and the content it hides. The summary is the bar. Press
            it and the browser shows the rest. Press it again and the browser hides it.</p>
        </li>
        <li className="run">
          <p className="paragraph">The browser also remembers whether each fold is open, and says so to a screen reader,
            which is software that reads the page aloud. It does not slide. The parts below are about making it slide,
            starting with how it was done before the browser could.</p>
        </li>
      </ol>
    </section>
    <PillGlider label="fold type" name="fold-type" options={foldTypes} chosen={type} onChosen={onTypeChosen}/>
    <PillGlider label="fold motion" name="fold-motion" options={foldMotions} chosen={motion} onChosen={onMotionChosen}/>
    <section aria-labelledby="old-way-heading" className="accordion-part">
      <h3 id="old-way-heading" className="title bold">How we used to build a fold</h3>
      <section className={toldRun} aria-labelledby="max-height-guess-heading">
        <h4 id="max-height-guess-heading" className="run-title sub-title bold">The max-height guess</h4>
        <p className="paragraph">Before a known height, most of us slid a fold open with a guess. A transition
          can move a height to a number but not to auto, the height the text needs, so we moved
          the panel’s <Mdn path="Web/CSS/max-height">max-height</Mdn> instead: from 0 to a number taller
          than any part would ever need, like 1000px. The panel stopped at its own text, so nothing
          scrolled and nothing was left empty. The cost was the timing. The transition spent its whole
          time crossing the guess, and the text filled only the start of it. So a short part opened in a
          rush and then sat still. On closing, it waited, unmoving, while the guess fell to its text,
          then shut at once. The bigger the guess, the worse the rush and the wait. A guess too small
          cut the text off.</p>
        <Snippet label="CSS" lines={[
          plain('.info {'),
          plain('  max-height: 0;'),
          plain('  overflow: hidden;'),
          plain('  transition: max-height .3s ease-in-out;'),
          plain('}'),
          gap,
          plain('.info-toggle:checked ~ .info {'),
          plain('  max-height: 1000px;'),
          plain('}')
        ]}/>
        <OneGuessTwoParts/>
      </section>
      {type === 'inclusive'
        ? <InclusiveMeasuredAccordion className={exhibit} content={contents.measuredCheckbox} motion={motion}/>
        : <ExclusiveMeasuredAccordion className={exhibit} content={contents.measuredRadio} motion={motion}/>}
      <ol className={runs}>
        <li className="run">
          <p className="paragraph">Most of us reached next for script. A transition can move a height to a number,
            so the script supplies the number: when a part opens, it measures the text’s real height and gives
            the panel that height, and the stylesheet’s transition moves the panel from 0 to it. Every part
            moves the same way, short or tall, because the target is the text’s own height. When the motion
            ends, the script takes the number away, and the panel is auto again. A number left in place goes
            stale: narrow the window, the text wraps onto more lines, and a fixed height cuts it off.</p>
          <Snippet label="TS" lines={[
            ...unit(measuredSource, 'const opened'), gap,
            ...unit(measuredSource, 'const settled'), gap,
            ...unit(measuredSource, 'const letsGo')
          ]}/>
        </li>
        <li className="run">
          <p className="paragraph">Closing runs the other way. The script hands each height to the stylesheet
            through a custom property, a value the stylesheet can read, named --measured-height, and while the
            class sized is on, the panel’s height reads it. To close, the script sets the open height, then 0, and
            the transition moves between them. Firefox and Safari have already applied a pressed box’s new style
            when the change event fires, so the script first pins where the motion starts, with a second class,
            unmoving, that switches the height’s transition off for that moment.</p>
          <Snippet label="TS" lines={[
            ...unit(measuredSource, 'const setsHeight'), gap,
            ...unit(measuredSource, 'const startsAt'), gap,
            ...unit(measuredSource, 'const closed')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(accordionsCss, '.info-toggle ~ .info-measured.sized {'), gap,
            ...unit(accordionsCss, '.info-toggle ~ .info-measured.unmoving {')
          ]}/>
        </li>
        <li className="run">
          <p className="paragraph">A press while the panel moves keeps sized on and only sets a new end, so the
            panel turns around from where it is. If that end is where the panel already stands, no motion is left
            to run, and the script takes the number away at once.</p>
          <Snippet label="TS" lines={[
            ...unit(measuredSource, 'const movesTo'), gap,
            ...unit(measuredSource, 'const stillMoving')
          ]}/>
        </li>
        <li className="run">
          <p className="paragraph">{type === 'exclusive' && <>A radio that loses its check gets no event at all, so
            the script asks the whole list which parts are open. </>}This page lets its other folds move to auto,
            and this build turns that off with <Mdn path="Web/CSS/interpolate-size">interpolate-size</Mdn>, because
            the trick was for browsers that could only move between numbers.</p>
          {type === 'exclusive' && <Snippet label="TS" lines={unit(measuredSource, 'export const foldMeasured')}/>}
          <Snippet label="CSS" lines={unit(accordionsCss, '.info-measured {')}/>
        </li>
        <li className="run">
          <p className="paragraph">The cost was script. The motion needs it, but whether a part is open does not:
            the checkbox and the stylesheet own that, so if the script fails, a part still opens and closes, at
            once.</p>
          <Snippet label="CSS" lines={[
            ...unit(accordionsCss, ':is(.reveal, .drawer) & .info-measured {'), gap,
            ...unit(accordionsCss, '.info-toggle:not(:checked) ~ .info-measured {')
          ]}/>
        </li>
      </ol>
      {type === 'inclusive'
        ? <InclusiveAccordion className={exhibit} content={contents.knownCheckbox} motion={motion}/>
        : <ExclusiveAccordion className={exhibit} content={contents.knownRadio} motion={motion}/>}
      <ol className={runs}>
        <li className="run">
          <p className="paragraph">This build is a disclosure: a bar you press to show the text under it. It has
            no script. Everything below is HTML and CSS:
            what the elements hold, and what the stylesheet can read.</p>
        </li>
        <li className="run">
          {type === 'inclusive'
            ? <p className="paragraph">To open and close a part, something has to remember which way it is.
              A <Mdn path="Web/HTML/Element/input/checkbox">checkbox</Mdn> remembers: it is either
              checked or not, and pressing it switches between the two. So each part is a list item
              holding three things, in this order: the checkbox, its label, and the text. The
              label’s <Mdn path="Web/HTML/Attributes/for">for</Mdn> attribute names the checkbox’s
              id. That link makes a press anywhere on the label press the checkbox. Each id includes
              the part’s place in the list, so no two checkboxes share one.</p>
            : <p className="paragraph">To open and close a part, something has to remember which way it is.
              A <Mdn path="Web/HTML/Element/input/radio">radio</Mdn> remembers: it is either checked or
              not. Radios that share a name form a group, and checking one unchecks the others. So each
              part is a list item holding three things, in this order: the radio, its label, and the
              text. The label’s <Mdn path="Web/HTML/Attributes/for">for</Mdn> attribute names the
              radio’s id. That link makes a press anywhere on the label press the radio. Each id
              includes the part’s place in the list, so no two radios share one.</p>}
          <Snippet label="TS" lines={type === 'inclusive'
            ? span(accordionsSource, '<li key={key} className="fold">', '</li>')
            : span(accordionsSource, '<li className="fold" key={key}>', '</li>')}/>
        </li>
        <li className="run">
          <p className="paragraph">You want the reader to see a bar, not a {input}, so you hide the {input}.
            Position absolute takes it out of the page’s flow, so it leaves no gap. A vw is a
            hundredth of the window’s width, so a right offset of 1000vw puts the {input} ten
            window widths to the left, far off the page. Display none would hide it too, but it
            would also take the {input} out of the tab order, and a keyboard could no longer open
            the part. Focus is the element the keyboard will act on. Off screen, the {input} still
            takes focus, still answers the space bar, and
            is still named by its label.</p>
          <Snippet label="CSS" lines={unit(placementCss, '.off-screen {')}/>
          <OffScreenNotGone/>
        </li>
        <li className="run">
          <p className="paragraph">Now the stylesheet needs to know whether the {input} is checked. A selector
            is the part of a CSS rule that picks which elements the rule styles. A pseudo-class is a
            selector that picks an element by its state rather than by its name,
            and <Mdn path="Web/CSS/:checked">:checked</Mdn> picks a checked {input}. Elements with
            the same parent are siblings. A combinator is a symbol between two selectors that says
            how their elements relate. The ~ is
            the <Mdn path="Web/CSS/Subsequent-sibling_combinator">subsequent-sibling
              combinator</Mdn>: it picks the siblings that come after the first element. That is why
            the order is fixed, because the stylesheet can only look forward from the {input}. While
            the {input} is not checked, this rule collapses the text. No script watches the {input};
            the stylesheet reads it.</p>
          <Snippet label="CSS" lines={unit(accordionsCss, '.info-toggle:not(:checked) ~ .info {')}/>
          <TheSheetReadsTheBox/>
        </li>
        <li className="run">
          <p className="paragraph">Each bar shows an arrow that points right while its part is closed and down
            while it is open. The label is a flex row, which lays its children side by side: the
            part’s name sits at one end and the arrow at the other, both centred on the bar’s height.
            The arrow is an empty box drawn after the label’s words, with only its top and right
            borders, turned 45 degrees so the corner points right. When the {input} is checked, the
            ~ combinator picks the label after it, and the corner turns to 135 degrees and points
            down. A transition moves a property from its old value to its new one over a set time,
            whenever the value changes.
          {motion === 'static'
            ? ' With static there is none, so the corner turns in a single frame.'
            : ' With reveal and the drawer, one sits on every bar, not on one state, so opening and closing both turn the arrow over 500 milliseconds with ease.'}
          {' '}A transform, such as this turn, moves pixels the browser has already painted, without laying out the page again,
            so a turn is cheap. The bar has a set height and side padding, so every bar is the same
            size whatever its word, and its colours are the page’s, inverted. The arrow’s width and
            height size the box its borders outline, and its right margin keeps the corner off the
            bar’s edge.</p>
          <Snippet label="CSS" lines={[
            ...unit(accordionsCss, '&:not(.close) .info-label {'), gap,
            ...unit(accordionsCss, '.info-toggle:checked ~ .info-label::after {'), gap,
            ...unit(accordionsCss, ':is(.reveal, .drawer) &:not(.close) .info-toggle ~ .info-label::after {')
          ]}/>
          <TwoBordersTurned/>
        </li>
        <li className="run">
          <p className="paragraph">A keyboard user needs to see which bar they are on. Here the {input} has the focus, but the label is what the reader
            sees, so the stylesheet carries one to the other. The :focus-visible pseudo-class picks
            the {input} while it has keyboard focus, and :focus-visible ~ .info-label gives the
            bar the approach colour and a ring inside its edge. The browser treats hovering a label
            as hovering its {input}, so :hover on the {input} lights the bar too. That rule sits
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
            height to auto, the height the content needs. Before grid, the way to move evenly with no
            script was a height you knew. Each part’s panel is ten lines tall. The lh unit is the height of one line,
            so the panel grows with the text size. It is the one size in the sheet off the page’s
            spacing scale, because it is counted in the text’s own lines. Closed, the panel’s height is 0, and overflow
            hidden hides the text. Inside it, a section of the same height holds the paragraph and
            scrolls what does not fit. The paragraph is at least as tall as the section and pads
            its text with the page’s spacing on every side. Whether a tall part’s last line is cut at
            the foot depends on where its lines fall, so the section paints the sign in its background
            instead: a soft shadow held at its foot, and a cover in the panel’s colour that scrolls with
            the text and hides the shadow at the end, or when the text fits.
            The section’s tabindex of 0 puts it in the tab order, so a keyboard can reach it and
            scroll it, and aria-labelledby names it by its bar, so a screen reader says which part
            it is reading. Closed, visibility hidden takes the text out of the tab order and out of
            what a screen reader reads. Every part travels the same distance, so a short part moves
            like a tall one. The cost is that a short part leaves room under its text, and a tall
            one makes you scroll.
          {{
            reveal: ' With reveal, the panel’s height moves over 300 milliseconds with ease-in-out, which starts slowly, speeds up and slows to a stop, opening and closing. Visibility moves on the same 300 milliseconds and changes at the visible end, so a closing panel keeps its text until it is shut. The section sits at the panel’s top, so the text is uncovered from its first line down.',
            drawer: ' With the drawer, the height and visibility move on the same 300 milliseconds, and the panel lays the section out as a column set at its end. So the section’s bottom stays on the fold’s edge, and the text slides down from under the bar.',
            static: ' With static, nothing moves: the panel is at its full height or at 0, in a single frame.'
          }[motion]}</p>
          <Snippet label="CSS" lines={[
            ...unit(accordionsCss, '.info,\n    .info-text {'), gap,
            ...unit(accordionsCss, '.info {\n      overflow: hidden;'), gap,
            ...unit(accordionsCss, '.info-text {\n      overflow-y'), gap,
            ...unit(accordionsCss, '.info-paragraph {'), gap,
            ...unit(accordionsCss, '.info-toggle:not(:checked) ~ .info {'), gap,
            ...{
              reveal: unit(accordionsCss, '& .info {\n      transition: height'),
              drawer: [
                ...unit(accordionsCss, '& .info {\n      transition: height'), gap,
                ...unit(accordionsCss, '.drawer & .info {'), gap,
                ...unit(accordionsCss, '.drawer & .info-text {')
              ],
              static: []
            }[motion]
          ]}/>
          <TheKnownHeight/>
        </li>
        {type === 'exclusive' && <li className="run">
          <p className="paragraph">Every radio in the build has the name group, so checking a part unchecks the
            last one, and the rule that collapses unchecked text closes it. The arrow keys move the
            choice within a group, so a keyboard opens each part it passes.</p>
          <OneNameOneChoice/>
        </li>}
        {type === 'exclusive' && <li className="run">
          <p className="paragraph">A checked radio stays checked when you press it again, so a part cannot close
            itself. So the list starts with a Close radio, checked at first, and choosing it unchecks
            whichever part was open.</p>
          <Snippet label="TS" lines={span(accordionsSource, '<li className="fold close">', '</li>')}/>
        </li>}
        {type === 'exclusive' && <li className="run">
          <p className="paragraph">The Close bar is shorter than the others and has no text beneath it, so it
            gets its own rule: a flex row that centres its one word. Its label fills the whole bar,
            so a press anywhere on the bar counts.</p>
          <Snippet label="CSS" lines={unit(accordionsCss, '&.close {')}/>
        </li>}
        <li className="run">
          <p className="paragraph">A screen reader announces each part as what its markup says it is:
            {type === 'inclusive' ? ' a checkbox, checked or not checked.' : ' a radio, one of six.'}</p>
        </li>
      </ol>
    </section>
    <section aria-labelledby="platform-way-heading" className="accordion-part">
      <h3 id="platform-way-heading" className="title bold">What the platform gives now</h3>
      {type === 'inclusive'
        ? <InclusiveToggleAccordion className={exhibit} content={contents.inclusiveDetails} motion={motion}/>
        : <ExclusiveToggleAccordion className={exhibit} content={contents.exclusiveDetails} motion={motion}/>}
      <ol className={runs}>
        <li className="run">
          <p className="paragraph">This build uses details and summary, the two elements from the first accordion. Each
            piece of the {input} build has a native
            piece in its place. Summary is the bar and the control at once, so there is no label,
            no for and no id. Details remembers whether it is open, so there is no {input} to
            hide and no sibling selector to read it. The keyboard comes with it, and a screen
            reader announces the bar as a disclosure, collapsed or expanded.
          {type === 'inclusive' && ' With nothing more, each part opens and closes on its own, as the checkbox build’s parts do. That is the inclusive build.'}</p>
          <Snippet label="TS" lines={type === 'inclusive'
            ? span(accordionsSource, '<details className="fold">', '</details>')
            : span(accordionsSource, '<details className="fold" name=', '</details>')}/>
          <OneJobTwoWays input={input}/>
          <ThreeBecomeTwo/>
        </li>
        {type === 'exclusive' && <li className="run">
          <p className="paragraph">This replaces the radio group. Give every details the
            same <Mdn path="Web/HTML/Element/details#name">name</Mdn>, and the browser closes the
            others when one opens. Pressing the open one closes it, so no Close radio is needed.</p>
        </li>}
        <li className="run">
          <p className="paragraph">The bar is the same flex row as the label in the {input} build, now on
            summary, in the same colours. Summary takes focus and hover itself, where the {input}
            build carried focus from the hidden {input} to the label. Summary also draws its own
            arrow, called a marker, where the {input} build drew one from two borders. List-style
            none removes that marker, because this bar shows open and closed by its word alone. The
            hairline border draws the line between one bar and the next.</p>
          <Snippet label="CSS" lines={unit(accordionsCss, '.info-label {\n      display: flex;\n      padding')}/>
        </li>
        <li className="run">
          <p className="paragraph">This replaces the three old ways: the max-height guess, the height measured
            by script, and the known height. A pseudo-element is a part of an element
            that CSS can style as if it were an element of its
            own. <Mdn path="Web/CSS/::details-content">::details-content</Mdn> is the part a closed
            details hides. Closed, its block size, its height, is 0. Open, it is auto. Auto is a
            keyword, not a number, and a transition cannot move to a keyword on its
            own. <Mdn path="Web/CSS/interpolate-size">interpolate-size</Mdn> in the reset lets a size
            move to and from keywords like auto, and overflow hidden hides the text the size does not
            hold yet.
          {{
            reveal: ' With reveal, the size moves over 300 milliseconds with ease-in-out, which starts slowly, speeds up, and settles, and the text shows from its top down. Content-visibility, which hides the closed content, has no values between on and off, so allow-discrete lets it switch at the end of a close and at the start of an open. That keeps the text visible for the whole slide. Today only Chromium moves the size; Firefox and WebKit open the fold at once, and it still works.',
            drawer: ' With the drawer, the size moves on the same 300 milliseconds, and the part a details hides lays its text out as a column set at its end. The text is set not to shrink, so what the size does not hold yet is the text’s top, and its bottom stays on the fold’s edge as it slides down from under the bar. Allow-discrete keeps the text visible for the whole slide. Today only Chromium moves the size; Firefox and WebKit open the fold at once, and it still works.',
            static: ' With static, the part a details hides has no transition, so the fold opens in a single frame, in every browser.'
          }[motion]}</p>
          <Snippet label="CSS" lines={[
            ...unit(accordionsCss, '&::details-content {'), gap,
            ...unit(accordionsCss, '&[open]::details-content {'), gap,
            ...unit(accordionsCss, ':is(.reveal, .drawer) &::details-content {'), gap,
            ...(motion === 'drawer' ? [...unit(accordionsCss, '.drawer &::details-content {'), gap, ...unit(accordionsCss, '.info {\n      flex-shrink: 0;'), gap] : []),
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
      {type === 'inclusive'
        ? <InclusiveCheckboxToggleAccordion className={exhibit} content={contents.inclusiveCheckboxes} motion={motion}/>
        : <ExclusiveRadioToggleAccordion className={exhibit} content={contents.exclusiveRadios} motion={motion}/>}
      <ol className={runs}>
        {type === 'inclusive' && <li className="run">
          <p className="paragraph">The inclusive build is a checkbox build again, with no script. Each bar is a
            label holding the part’s name and its checkbox, and the checkbox remembers whether the
            part is open, as it did in part one. What is new is the way the text opens, below.</p>
          <Snippet label="TS" lines={span(accordionsSource, '<fieldset>\n    <legend className="off-screen">parts</legend>\n    <ul className="new-accordion">', '<input type="checkbox" className="off-screen"/>')}/>
        </li>}
        <li className="run">
          <p className="paragraph">The bar is named by its part. The label holds the part’s name, and that
            name is what the {input} is called. Its checked state is the part’s state, so a listener
            hears the part and whether it is open, such as “basalt, {input}, checked”. The
            stylesheet writes Open or Close at the bar’s end, for the eye, to say what a press will
            do. It marks the word as decoration with an empty alternative, so the word is not read.
            Someone using voice control says the part’s name.</p>
          <Snippet label="CSS" lines={[
            ...unit(accordionsCss, '&::before {\n        order: 1;'), gap,
            ...unit(accordionsCss, '&:has(:checked) .info-label::before {')
          ]}/>
        </li>
        {type === 'exclusive' && <li className="run">
          <p className="paragraph">The exclusive build is a radio group. Radios that share a name keep one part
            open on their own, which checkboxes cannot do without script. What a radio cannot do is
            close itself: pressed again, it stays checked. So the list adds that, with a little
            script, and the radios stay plain. A press on a radio bubbles up to the list, which
            remembers which radio is open. A press on that radio unchecks it and forgets it, and a
            press on any other remembers the new one. The arrow keys move the choice and press as
            they go, so each move is remembered too.</p>
          <Snippet label="TS" lines={[
            ...unit(accordionsSource, 'const openAfter'), gap,
            ...unit(accordionsSource, 'const radioPressed'), gap,
            ...unit(accordionsSource, 'const radioClicked'), gap,
            ...span(accordionsSource, '<ul className="new-accordion" onClick', '<ul className="new-accordion" onClick')
          ]}/>
          <WhatEachPromises/>
        </li>}
        {type === 'exclusive' && <li className="run">
          <p className="paragraph">The space bar is the keyboard’s press, but on a checked radio most browsers do
            nothing with it, so no press reaches the list. So the list listens for the space bar
            too, and closes the part when the key lands on the open radio.</p>
          <Snippet label="TS" lines={unit(accordionsSource, 'const spacePressed')}/>
        </li>}
        <li className="run">
          {type === 'inclusive'
            ? <p className="paragraph">This build has no script to lose.</p>
            : <p className="paragraph">Without the list’s script, the build still works as a radio group: it keeps one
              part open. Only the second press that closes a part is lost.</p>}
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
            The paragraph’s overflow hidden hides whatever its row does not hold. The row always ends at the
            content’s own height, so nothing is guessed, nothing is measured by script, nothing is fixed, and no
            text has to scroll.</p>
          <Snippet label="CSS" lines={[
            ...unit(accordionsCss, '.fold-clip {'), gap,
            ...unit(accordionsCss, '&:has(:checked) .fold-clip {')
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
          <p className="paragraph">The fold motion above chooses how the folds here move, and each build wears
            the choice as a class.
          {{
            reveal: ' Reveal moves the row on a transition, 300 milliseconds of ease-in-out, which starts gently and settles. The text shows from its top down as the row grows.',
            drawer: ' Drawer moves the row on the same transition, 300 milliseconds of ease-in-out, and sets the text at the row’s bottom, as the next run explains.',
            static: ' Static matches neither class in the rule for the transition, so the build has none, and the row changes in a single frame.'
          }[motion]}</p>
          <Snippet label="CSS" lines={unit(accordionsCss, '&:is(.reveal, .drawer) .grid-fold .fold-clip {')}/>
        </li>
        {motion === 'drawer' && <li className="run">
          <p className="paragraph">With the drawer, the text slides down from under its bar. Its paragraph grows
            from 0fr to 1fr, as above. Between the two, the row is shorter than the paragraph
            around it, so align-content: end sets the row at the paragraph’s bottom. Align-self: end
            sets the item at the row’s bottom, as tall as its text. So the text’s bottom edge stays
            on the fold’s edge at every frame, and the paragraph’s overflow hides the text above the
            fold. One transition moves it all, so no part can fall behind another. It answers no
            limit. It is there to show what grid alignment does on its own.</p>
          <Snippet label="CSS" lines={unit(accordionsCss, '&.drawer .grid-fold {')}/>
          <RidesTheEdge/>
        </li>}
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
};
