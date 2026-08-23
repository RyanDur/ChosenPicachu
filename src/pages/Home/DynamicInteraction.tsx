import {FC} from 'react';

export const DynamicInteraction: FC = () =>
  <section className="door" aria-labelledby="dynamic-interaction">
    <h2 className="door-title" id="dynamic-interaction">Dynamic Interaction</h2>
    <figure className="feedback">
      <blockquote>
        <p className="quote">
          With a scripting language like JS that could touch elements of the page, change
        their properties, and respond to events, we envisioned a much livelier Web
        consisting of pages that acted more like applications.
        </p>
      </blockquote>
      <figcaption className="attribution"><a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">Brendan Eich, in Computerworld’s A-Z of Programming Languages</a></figcaption>
    </figure>
    <p className="paragraph">
      How things respond: state decides what is true, events say what happened, and the
      page follows from both.
    </p>
    <details className="door-fold">
      <summary className="prompt">how I organize it</summary>
      <p className="paragraph">Behavior splits in two: what is true, and what happened. State
        is what is true: the order the rows stand in, the choice the reader has made, the
        thing held mid-drag. It holds only what cannot be derived; anything the page can
        compute from it is a view, computed when asked. Events are what happened, so they
        are named in the past tense: lifted, dropped, chosen, and each one goes to a pure
        transition that takes the current truth and returns the next. The truth lives in
        one place, and committing the next one is the only way anything moves. Everything
        on screen follows from it: events in, state change, projection out.</p>
      <p className="paragraph">The core is functional and the shell is imperative. Transitions
        are pure functions from state to state, tested alone with no page in sight; the
        shell holds the state, listens, commits, and reconciles what stands on screen. The
        same core can wear any shell: every feature on this site is built twice, once with
        React and once with no framework standing anywhere, and only the shell changes.</p>
      <p className="paragraph">The platform answers first here, too. The folds on this page
        open and close with no script anywhere; a popover dismisses itself; the browser
        already ships the back button, scroll restoration, and focus order, and script that
        re-implements them buys their bugs back. I write behavior only for what the
        platform does not yet do.</p>
      <p className="paragraph">Every gesture gets its keyboard twin: what a pointer can drag,
        arrows can move, or the feature is not done. WCAG states it as a floor, all
        functionality{' '}
        <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">“operable through a keyboard interface”</a>. And
        changes announce themselves: when a table’s order changes, the page says so to ears
        as well as eyes.</p>
      <p className="paragraph">The test of the organization is reading the state cold: if the
        data does not say what is true without the page open beside it, behavior has leaked
        into presentation. That is the same test the other two languages take, the markup
        read with the styles off, the class list read without the design: each language
        should hold its whole story alone.</p>
    </details>
  </section>;
