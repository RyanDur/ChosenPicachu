import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const SomeoneNeedsComponents: FC = () =>
  <Moment of={moments.someoneNeedsComponents}
    tells={<>Interfaces had grown into applications, and their builders needed components:
      self-contained pieces that carry structure, style, and behavior together, and styles
      that stay where they are put. The platform did not have them yet, so JavaScript built
      them first.</>}>
    <p className="paragraph muted-ink hyphenated">JavaScript answered. Components arrived in script, and the single-page
      application moved the whole document there with them: the server sent an empty body
      and a bundle, and until the script ran there was no page. The single-page application inverted the premise: the document no longer carried the application, the
      application emitted the document.</p>
    <p className="paragraph muted-ink hyphenated">Style followed structure into script as CSS-in-JS, the term arriving with{' '}
      <a className="signpost" href="https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html">Christopher
        Chedeau’s 2014 talk</a> cataloguing CSS-at-scale problems at Facebook. The web had run this experiment before, as JavaScript Style Sheets, when Netscape 4
      rendered style by translating it into script; this time the industry’s weight was behind it.</p>
    <p className="paragraph muted-ink hyphenated">The answer had a price: blank first paints, fragile crawls, a document that
      cannot be read without executing a program. And the document’s own habits had to be
      rebuilt by hand: links became components, the back button became state, scroll
      restoration and URL fragments became libraries, the frameworks growing routers and
      scroll managers to re-create behaviors the browser had shipped for twenty years.</p>
    <p className="paragraph muted-ink hyphenated">The platform has been answering the need ever since, absorbing what script
      proved: custom properties took over the theme variables,{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM">shadow DOM</a> gave
      styles a boundary to stay inside,{' '}
    <a className="signpost" href="https://html.spec.whatwg.org/multipage/custom-elements.html">custom elements</a> gave
      components a home in markup itself, and @scope is the newest arrival in the same
      direction.</p>
  </Moment>;
