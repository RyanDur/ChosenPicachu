import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';

export const DynamicInteraction: FC = () =>
  <section className="door" aria-label="dynamic interaction">
    <h2 className="door-title">Dynamic Interaction</h2>
    <blockquote className="feedback">
      <p className="quote">
        With a scripting language like JS that could touch elements of the page, change
        their properties, and respond to events, we envisioned a much livelier Web
        consisting of pages that acted more like applications.
      </p>
      <footer className="attribution"><a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">Brendan
      Eich, in Computerworld’s A-Z of Programming Languages</a></footer>
    </blockquote>
    <p className="paragraph">
      How things respond: state decides, the languages split the work, and the same
      listeners answer in any world. Every one of{' '}
      <Link className="signpost" to={Paths.demos}>the demos</Link> responds with it.
    </p>
  </section>;
