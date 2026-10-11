import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {FromTheRecord} from './FromTheRecord';

export const Presentation: FC = () =>
  <section className="door trim-rule-above" aria-labelledby="presentation">
    <h2 className="door-title title" id="presentation">Presentation</h2>
    <Quotation voice="paragraph" source={<a className="signpost" href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html">the W3C, on HTML and CSS</a>}>
      The separation of HTML from CSS makes it easier to maintain sites, share style
      sheets across pages, and tailor pages to different environments.
    </Quotation>
    <p className="paragraph">
      CSS says how things look. Shared looks get shared class names, each component’s layout lives in its own sheet,
      and nothing is styled to say what the HTML already says.
    </p>
    <FromTheRecord language="Presentation" keys={['presentationLeavesHome', 'cascadeSettlement', 'needOutrunsStandards', 'browsersAgree', 'zenGarden', 'someoneNeedsComponents']}/>
    <details className="door-fold">
      <summary className="prompt caption">how I organize it</summary>
      <p className="paragraph muted-ink">I write CSS in two kinds of sheet. A component’s sheet holds its structure,
        the grid and placement of that one component, named for it and kept beside it. Shared looks live in the site’s
        shared sheets as plain class names such as rounded-corners, lifted and trim, each saying what the element
        needs, not what it is. Element selectors are used only in the reset, and there is no utility scale: lifted
        says why a style is there, mt-4 says only what it does, and markup full of utilities is the look written back
        into the structure.</p>
      <p className="paragraph muted-ink">A class list reads like a sentence: the element’s own name first, then what
        it needs, then what is true right now. The platform already names most states, such as invalid, checked and
        hover, so the sheet uses those{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes">pseudo-classes</a> first.
        I add a state name only where there is no native one: aloft for the thing being dragged, anchored for the row
        that stays put. Each component’s sheet decides what aloft does to its own elements, so a column and a row can
        both be aloft and look different.</p>
      <p className="paragraph muted-ink">Presentation has duties of its own. Motion is a preference the reader can
        set, so the sheet checks{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion">prefers-reduced-motion</a> before
        it animates. Grid and flex can change the order the eye sees without changing the order a keyboard moves
        through, so the HTML keeps{' '}
      <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">the meaningful sequence</a> and
        the sheet only changes the picture.</p>
      <p className="paragraph muted-ink">Workarounds go away as the platform catches up. A checkbox can be placed off
        screen, still read by a screen reader but unseen, while its label carries the design and the checked state
        changes it. Select options had no such way round, and now they need none: they can be styled with{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select">appearance: base-select</a> in
        Chromium, and a browser without it will{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select">“fall back to a classic select experience”</a>.</p>
      <p className="paragraph muted-ink">Constants live in the stylesheet. Only a value computed at runtime is written
        inline, as a{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">custom property</a> the
        sheet already reads: a measured height, a position after a drag. Every size is a multiple of one base, and
        every colour is a named token on the root.</p>
      <p className="paragraph muted-ink">The test is to read a class list on its own. If it does not say what the
        element is and what it needs, in the names the design uses, the sheet has become a pile of overrides.</p>
    </details>
  </section>;
