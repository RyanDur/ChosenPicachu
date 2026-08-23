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
      <p className="paragraph">The elements mean something, and not just visually: a nav
        announces wayfinding and a button promises a press to readers whose way in
        differs from mine. The right tag hands most of that over for free,{' '}
        <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">“built-in keyboard accessibility, roles and states”</a> in
        MDN’s words; repurpose a meaningless tag instead, and I become responsible for
        rebuilding all of it in script. The field even has a saying,{' '}
        <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">“No ARIA is better than bad ARIA”</a>; WebAIM
        found pages using ARIA averaged{' '}
        <a className="signpost" href="https://webaim.org/projects/million/">41 percent more detected errors</a> than
        pages without.</p>
      <p className="paragraph">The div is for when I want an element to say nothing: it is
        invisible to a screen reader, and sometimes silence is the right answer. Still an
        element <a className="signpost" href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element">“of last resort, for when no other element is suitable”</a>,
        the standard’s own words, because the silence cuts both ways:{' '}
        <a className="signpost" href="https://webaim.org/projects/screenreadersurvey10/">WebAIM’s screen reader survey</a> finds
        71.6 percent of users navigate a long page by its headings, and a page built of
        divs gives them nothing to navigate by. Everywhere else the name holds: figures
        carry their captions, lists admit they are lists, buttons are buttons even when
        they look like links.</p>
      <p className="paragraph">The test of the organization is reading the markup with the styles off.
        Naked, the page should still say everything it means, in order: that reading is what
        search engines, reader modes, and assistive tech consume. If the meaning only appears
        when the CSS arrives, the meaning is living in the wrong language.</p>
    </details>
  </section>;
