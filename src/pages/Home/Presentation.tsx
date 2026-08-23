import {FC} from 'react';

export const Presentation: FC = () =>
  <section className="door" aria-labelledby="presentation">
    <h2 className="door-title" id="presentation">Presentation</h2>
    <figure className="feedback">
      <blockquote>
        <p className="quote">
          The separation of HTML from CSS makes it easier to maintain sites, share style
        sheets across pages, and tailor pages to different environments.
        </p>
      </blockquote>
      <figcaption className="attribution"><a className="signpost" href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html">the W3C, on HTML and CSS</a></figcaption>
    </figure>
    <p className="paragraph">
      How things show: shared words for shared needs, structure beside the component that
      wears it, and nothing owned that the content already says.
    </p>
    <details className="door-fold">
      <summary className="prompt">how I organize it</summary>
      <p className="paragraph">I write CSS in two vocabularies. Component sheets own structure:
        the grid, the placement, the bones of one component, named for it and kept beside it.
        Needs live at the top scope as plain words like rounded-corners, lifted, and
        trim: what an element needs, not what it is. Tag selectors are for resets only, and there is no
        atomic scale: a need says why a style is there, a utility only says what it does,
        and a markup full of utilities is the look written back into the structure.</p>
      <p className="paragraph">A class list reads like a sentence: the noun first, then what it
        needs, then what is true right now. The platform already names most states:
        invalid, checked, hover. The sheet listens for those{' '}
        <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes">pseudo-classes</a> first. I add a state
        word only where no native one exists: aloft for the thing mid-drag, anchored for
        the row that stays put. A state can bring its effect along; landed arrives with
        its slide home. The words get reused, too: each
        component’s sheet decides what a word means for its own elements, so a column and a
        row can both be aloft and wear it differently.</p>
      <p className="paragraph">Presentation carries affordances of its own. Motion is a
        preference the reader can state, and the sheet listens for{' '}
        <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion">prefers-reduced-motion</a> before
        it animates. Grid and flex can reorder what the eye sees without changing what a
        keyboard walks, so the source keeps{' '}
        <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">the meaningful sequence</a> and
        the sheet only decorates it.</p>
      <p className="paragraph">Coverings retire as the platform catches up. When an element
        cannot be styled yet, sometimes there is an easy way around: a checkbox can slip
        off screen, spoken but unseen, while its label wears the design and the checked
        state re-dresses it on every change. Select options
        had no easy way around, and now they need none: stylable via{' '}
        <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select">appearance: base-select</a> in
        Chromium, with a non-supporting browser promised to{' '}
        <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select">“fall back to a classic select experience”</a>,
        the new styles failing gracefully until the rest arrive.</p>
      <p className="paragraph">Constants live in the stylesheet; only runtime values ride
        inline, crossing on a{' '}
        <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">custom property</a> the
        sheet is already listening for: a measured height, a dealt position, a number the
        page computed. If a value is known before the page runs, it belongs in a class. If it
        is born at runtime, it earns the channel. Everything sits on one scale: every size
        a multiple of a single base, every color a named token on the root.</p>
      <p className="paragraph">The test of the organization is reading
        the class list cold: if it does not say what the element is and what it needs, in words
        the design speaks, the sheet has stopped being a stylesheet and become a bag of
        overrides.</p>
    </details>
  </section>;
