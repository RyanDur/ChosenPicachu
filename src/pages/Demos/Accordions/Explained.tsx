import {FC} from 'react';
import {classNames} from '@components/class-names';
import {
  ExclusiveAccordion,
  ExclusiveCheckboxToggleAccordion,
  ExclusiveRadioToggleAccordion,
  ExclusiveToggleAccordion,
  Fold,
  InclusiveAccordion
} from './Accordions';
import {Mdn} from '../Recipe';
import './Explained.css';

export type Contents = {
  checkbox: Fold[];
  radio: Fold[];
  details: Fold[];
  checkboxWithState: Fold[];
  radioWithState: Fold[];
};
const exhibit = 'card rounded-corners lifted padded';

export const AccordionsExplained: FC<{contents: Contents}> = ({contents}) => <>
  <section aria-labelledby="old-way-heading" className="accordion-part">
    <h3 id="old-way-heading" className="title bold">How we used to build a fold</h3>
    <ul className="accordions">
      <li><InclusiveAccordion className={exhibit} content={contents.checkbox}/></li>
      <li><ExclusiveAccordion className={exhibit} content={contents.radio}/></li>
    </ul>
    <p className={classNames('paragraph', exhibit)}>A heading that shows or hides the part beneath it is a disclosure,
      and for years no element for one worked in every browser. So you borrowed.
      A <Mdn path="Web/HTML/Element/input/checkbox">checkbox</Mdn> holds a yes: move the box off
      screen, where the keyboard still reaches it, style its label as the bar, and let :checked
      show the text beneath it. It works before any script arrives, but every box is its own, so
      it cannot close the others. A <Mdn path="Web/HTML/Element/input/radio">radio</Mdn> holds
      one of several: give every part the same name, and opening one closes the last. The arrow
      keys move the choice, so a keyboard opens each part it passes. But a chosen radio stays
      chosen, so the build adds a Close radio to give the reader a way out. And each bar is
      announced as what the markup says it is, a radio, one of six, not a disclosure. Both slide
      with a guess. Height did not animate to auto, so max-height stands in, set taller than any
      text should be, and text taller than the guess is cut off.</p>
  </section>
  <section aria-labelledby="platform-way-heading" className="accordion-part">
    <h3 id="platform-way-heading" className="title bold">What the platform gives now</h3>
    <ExclusiveToggleAccordion className={exhibit} content={contents.details}/>
    <p className={classNames('paragraph', exhibit)}><Mdn path="Web/HTML/Element/details">details</Mdn> holds a
      disclosure. With summary, it is a heading that opens and closes, announced as a
      disclosure, and it works from the keyboard with nothing added. Give every details the
      same name and the browser keeps one open, which is the radio’s promise without the
      radio. The slide needs no guess either. <Mdn path="Web/CSS/::details-content">::details-content</Mdn> is
      the part a closed details hides, and <Mdn path="Web/CSS/interpolate-size">interpolate-size</Mdn> lets
      a page animate it to auto. A browser that cannot animate it opens the fold at once, and
      the fold still works.</p>
  </section>
  <section aria-labelledby="together-heading" className="accordion-part">
    <h3 id="together-heading" className="title bold">The two together</h3>
    <ul className="accordions">
      <li><ExclusiveCheckboxToggleAccordion className={exhibit} content={contents.checkboxWithState}/></li>
      <li><ExclusiveRadioToggleAccordion className={exhibit} content={contents.radioWithState}/></li>
    </ul>
    <p className={classNames('paragraph', exhibit)}>When a fold must do more than open and
      close, you build on what each element was made for. These two builds keep a checkbox and
      a radio for what they hold, and add a little state for what each cannot promise alone:
      the checkbox build’s state keeps one part open at a time, which boxes on their own do
      not; the radio build’s state lets a second press close, which a chosen radio on its own
      cannot. The slide comes from a grid row that animates from 0fr to 1fr, and the row’s
      content decides how tall 1fr is, so there is no guess. The second build adds a flourish,
      not a limit answered: its text slides down under its bar with a transform. The cost is
      that the fold is a React component, not the platform’s disclosure, and closing needs
      state the platform gives for free. Reach for this when a fold must slide in every browser
      today, or must do what details does not; reach for details when it does.</p>
  </section>
</>;
