import {FC} from 'react';
import {Moment} from './Moment';

export const SomeoneNeedsComponents: FC = () =>
  <Moment year="2013"
          title="Someone needs components"
          tells={<>Interfaces had grown into applications, and their builders needed components:
            self-contained pieces that carry structure, style, and behavior together, and styles
            that stay where they are put. The platform did not have them yet, so JavaScript built
            them first.</>}>
    <p className="paragraph">Interfaces had grown too big to build as one document. Teams wanted
    self-contained pieces, structure, style, and behavior traveling together, that could
    be composed, reused, and reasoned about alone. The platform had no element for that.</p>
    <p className="paragraph">JavaScript answered. Components arrived in script, and the single-page
    application moved the whole document there with them: the server sent an empty body
    and a bundle, and until the script ran there was no page. The livelier web had quietly
    inverted its own premise: the document no longer carried the application, the
    application emitted the document.</p>
    <p className="paragraph">Style followed structure into script as CSS-in-JS, the term arriving with{' '}
    <a className="signpost" href="https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html">Christopher
    Chedeau’s 2014 talk</a> cataloguing CSS-at-scale problems at Facebook. The web had run
    this experiment before: Netscape 4 rendering style by translating it into script,
    JavaScript Style Sheets’ second coming, this time with the industry’s weight behind
    it.</p>
    <p className="paragraph">The answer had a price: blank first paints, fragile crawls, a document that
    cannot be read without executing a program. And the document’s own habits had to be
    rebuilt by hand: links became components, the back button became state, scroll
    restoration and URL fragments became libraries, the frameworks growing routers and
    scroll managers to re-create behaviors the browser had shipped for twenty years.</p>
    <p className="paragraph">The platform has been answering the need ever since, absorbing what script
    proved: custom properties took over the theme variables,{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM">shadow DOM</a> gave
    styles a boundary to stay inside,{' '}
    <a className="signpost" href="https://html.spec.whatwg.org/multipage/custom-elements.html">custom elements</a> gave
    components a home in markup itself, and @scope is the newest arrival in the same
    direction. The lesson was not that script was wrong; it was that the need was real.</p>
  </Moment>;
