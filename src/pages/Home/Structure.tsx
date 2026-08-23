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
    <details className="door-fold">
      <summary className="prompt">how I organize it</summary>
      <p className="paragraph">I start with the need and let it pick the element. That is the
        whole method. The platform ships more vocabulary than most pages ever use: a{' '}
        <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search">search</a> landmark,
        a <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress">progress</a> element,
        an <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output">output</a> for
        computed results. Before I write anything I ask what the content is, and the answer
        is usually already an element’s name.</p>
      <p className="paragraph">The skeleton comes first: one header, one main, one footer, nav
        where wayfinding lives. Landmarks are the page’s table of contents; a screen reader
        walks them the way eyes scan headings, so every landmark gets a name and no two names
        collide. Sections name themselves through their headings, and if a section has nothing
        to be named by, that is the page telling me it is not a section.</p>
      <p className="paragraph">The div is a last resort, not a default. It says nothing, which
        is occasionally the point: when the content model forbids anything better, a div
        carries the class and stays silent. Everything else has a name: figures carry their
        captions, lists admit they are lists, buttons are buttons even when they look like
        links.</p>
      <p className="paragraph">The test of a structure is reading it with the styles off.
        Naked, the page should still say everything it means, in order: that reading is what
        search engines, reader modes, and assistive tech consume. If the meaning only appears
        when the CSS arrives, the meaning is living in the wrong language.</p>
    </details>
  </section>;
