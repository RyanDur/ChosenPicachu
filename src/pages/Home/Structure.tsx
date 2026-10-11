import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {FromTheRecord} from './FromTheRecord';

export const Structure: FC = () =>
  <section className="door trim-rule-above" aria-labelledby="structure">
    <h2 className="door-title title" id="structure">Structure</h2>
    <Quotation voice="paragraph" source={<a className="signpost" href="https://html.com/html5/">html.com, on HTML</a>}>
      It is not a programming language, but rather a language that identifies the meaning,
      purpose, and structure of text within a document.
    </Quotation>
    <p className="paragraph">
      HTML says what each thing on the page is: a heading, a list, a button, a form. Choose the element that means
      what the content is, and add the look and the behaviour on top of it.
    </p>
    <FromTheRecord language="Structure" keys={['need', 'structureArrives', 'webGoesPublic', 'htmlTwo', 'needOutrunsStandards', 'browsersTakePen', 'someoneNeedsComponents', 'html5SaysIt', 'documentComesBack']}/>
    <details className="door-fold">
      <summary className="prompt caption">how I organize it</summary>
      <p className="paragraph muted-ink">I start from what the content is and pick the element for it. The platform
        has more elements than most pages use: a{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search">search</a> landmark,
        a{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress">progress</a> element,
        an <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output">output</a> for
        a computed result. The answer to "what is this?" is usually an element’s name.</p>
      <p className="paragraph muted-ink">The skeleton comes first: one header, one main, one footer, and a nav for the
        links that move you around the site. Landmarks are the page’s table of contents, so every landmark gets a name
        and no two are the same. A section is named by its heading; if there is nothing to name it by, it is not a
        section.</p>
      <p className="paragraph muted-ink">The elements mean something beyond how they look. A nav tells a screen reader
        these links are for getting around; a button tells it a press will do something. The right element gives you
        that for free, with{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">“built-in keyboard accessibility, roles and states”</a> in
        MDN’s words. Use a meaningless element instead and you rebuild all of it in script. The field has a saying,{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">“No ARIA is better than bad ARIA”</a>: WebAIM
        found pages using ARIA had{' '}
      <a className="signpost" href="https://webaim.org/projects/million/">41 percent more detected errors</a> than
        pages without.</p>
      <p className="paragraph muted-ink">A div is for when I want an element that says nothing. Sometimes that is
        right, but the standard still calls it an element{' '}
      <a className="signpost" href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element">“of last resort, for when no other element is suitable”</a>:{' '}
      <a className="signpost" href="https://webaim.org/projects/screenreadersurvey10/">WebAIM’s survey</a> found 71.6
        percent of screen reader users move through a long page by its headings, and a page built of divs gives them
        nothing to move by. Everywhere else the element says what it is: a figure has its caption, a list is a list, a
        button is a button even when it looks like a link.</p>
      <p className="paragraph muted-ink">The test is to read the page with the styles turned off. It should still say
        everything it means, in order, because that is what search engines, reader modes and assistive technology
        read. If the meaning only appears once the CSS loads, it is in the wrong language.</p>
    </details>
  </section>;
