import {FC} from 'react';

export const Structure: FC = () =>
  <section className="door" aria-labelledby="structure">
    <h2 className="door-title" id="structure">Structure</h2>
    <figure className="feedback">
      <blockquote>
        <p className="quote">
          It is not a programming language, but rather a language that identifies the meaning,
        purpose, and structure of text within a document.
        </p>
      </blockquote>
      <figcaption className="attribution"><a className="signpost" href="https://html.com/html5/">html.com, on HTML</a></figcaption>
    </figure>
    <p className="paragraph">
      What things are: content, meaning, and the order a reader and a screen reader both
      walk. The element chooses itself, and everything else layers on.
    </p>
  </section>;
