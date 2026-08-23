import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';

export const Structure: FC = () =>
  <section className="door" aria-label="structure">
    <h2 className="door-title">Structure</h2>
    <blockquote className="feedback">
      <p className="quote">
        It is not a programming language, but rather a language that identifies the meaning,
        purpose, and structure of text within a document.
      </p>
      <footer className="attribution"><a className="signpost" href="https://html.com/html5/">html.com, on HTML</a></footer>
    </blockquote>
    <p className="paragraph">
      What things are: content, meaning, and the order a reader and a screen reader both
      walk. The element chooses itself, and everything else layers on. Every one of{' '}
      <Link className="signpost" to={Paths.demos}>the demos</Link> builds on it.
    </p>
  </section>;
