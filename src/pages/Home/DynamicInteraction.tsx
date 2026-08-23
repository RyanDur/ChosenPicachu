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
      How things respond: state decides, the languages split the work, and the same
      listeners answer in any world.
    </p>
  </section>;
