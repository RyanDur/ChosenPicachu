import {FC} from 'react';
import {MomentLink} from '@pages/Home/MomentLink';

export const PresentationPractice: FC = () =>
  <>
    <p className="paragraph">I write CSS in two kinds of sheet. A component’s sheet holds its structure,
      the grid and placement of that one component, named for it and kept beside it. Shared looks live in the site’s
      shared sheets as plain class names such as rounded-corners, lifted and trim, each saying what the element
      needs, not what it is. Element selectors appear only in the reset.
      There is no utility scale: lifted says why a style is there, and mt-4 says only what it does. Markup full of
      utilities is the look written back into the structure.
      The separation is the <MomentLink to="presentationLeavesHome">1994 draft</MomentLink>’s, and the Zen Garden in the <MomentLink to="zenGarden">2003 moment</MomentLink> shows what it is for.</p>
    <p className="paragraph">A class list reads like a sentence: the element’s own name first, then what
      it needs, then what is true right now. The platform already names most states, such as invalid, checked and
      hover, so the sheet uses those{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes">pseudo-classes</a> first.
      I add a state name only where there is no native one: carried for the thing being dragged, settling for the
      one sliding back into place, shoved for a neighbour pushed aside. One sheet, the table’s, says what each does.
      Carried and settling use the same rules for a column and a row; only the lengths handed in differ. Shoved has
      a rule per direction: two across for columns, two down for rows.</p>
    <p className="paragraph">Presentation has duties of its own. Motion is a preference the reader can
      set, so the sheet checks{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion">prefers-reduced-motion</a> before
      it animates. Grid and flex can change the order the eye sees without changing the order a keyboard moves
      through, so the HTML keeps{' '}
    <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">the meaningful sequence</a> and
      the sheet only changes the picture.</p>
    <p className="paragraph">Workarounds go away as the platform catches up. I can move a checkbox off
      screen, where a screen reader still reads it and no one sees it. Its label then carries the design, and the
      checked state changes it. Select options had no such way round, and now they need none: they can be styled with{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select">appearance: base-select</a> in
      Chromium, and a browser without it will{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select">“fall back to a classic select experience”</a>.
      That is the record’s pattern since the <MomentLink to="needOutrunsStandards">1996 moment</MomentLink>: a workaround, and then the platform.</p>
    <p className="paragraph">Constants live in the stylesheet. Only values the code works out at
      runtime are written inline, mostly as{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">custom properties</a> the
      sheet already reads: a measured height, a position after a drag, the direction of a slide. Every size is a multiple of one base, and
      every colour is a named token on the root.
      Custom properties are the <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink>’s lesson: theme variables started in
      script and now live in CSS.</p>
    <p className="paragraph">The test is to read a class list on its own. If it does not say what the
      element is and what it needs, in the names the design uses, the sheet has become a pile of overrides.
      This test guards isolation, the last of the seven problems in Chedeau’s talk; the concert quotes his list.</p>
  </>;
