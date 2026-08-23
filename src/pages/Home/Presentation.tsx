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
  </section>;
