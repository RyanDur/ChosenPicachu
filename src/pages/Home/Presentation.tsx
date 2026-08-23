import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';

export const Presentation: FC = () =>
  <section className="door" aria-label="presentation">
    <h2 className="door-title">Presentation</h2>
    <blockquote className="feedback">
      <p className="quote">
        The separation of HTML from CSS makes it easier to maintain sites, share style
        sheets across pages, and tailor pages to different environments.
      </p>
      <footer className="attribution"><a className="signpost" href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html">the W3C, on HTML and CSS</a></footer>
    </blockquote>
    <p className="paragraph">
      How things show: shared words for shared needs, structure beside the component that
      wears it, and nothing owned that the content already says. Every one of{' '}
      <Link className="signpost" to={Paths.demos}>the demos</Link> wears it.
    </p>
  </section>;
