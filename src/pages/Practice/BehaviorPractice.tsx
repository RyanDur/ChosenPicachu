import {FC} from 'react';
import {MomentLink} from '@pages/Record/MomentLink';

export const BehaviorPractice: FC = () =>
  <>
    <p className="paragraph">Behavior splits into what is true and what happened. The state is what is
      true: the order the rows are in, the choice the reader made, the thing being dragged. It holds only what
      cannot be worked out from something else. Events are what happened, so I name them in the past tense:
      lifted, dropped, chosen. Each event goes to a pure function that takes the current state and returns the next.
      I keep the state in one place, and replacing it is the only way anything on screen changes.
      AngularJS, in the <MomentLink to="frameworks">2010 moment</MomentLink>, bound model and view both ways. I keep one direction.</p>
    <p className="paragraph">Not every event starts at the pointer. A reply from a server or a price
      arriving over a socket is an event like any other: it says what happened somewhere else, and the state still
      decides what is true when it arrives.
      The <MomentLink to="pageBecomesApplication">2005 moment</MomentLink> is where that pattern got its name, Ajax, and became
      ordinary.</p>
    <p className="paragraph">The core is functional and the shell is imperative. The functions that move
      from one state to the next are pure, so I test them on their own with no page involved. The shell holds
      the state, listens for events, applies the next state and updates the screen. Requests go out through the same
      path that state changes come in. Change the framework, or remove it, and only the shell changes.
      The <MomentLink to="frameworks">2010 moment</MomentLink> names four frameworks in six years; the core should outlast them.</p>
    <p className="paragraph">The platform comes first here too. An accordion on the demos page opens and closes
      with no script, a popover closes itself, and the browser already provides the back button, scroll restoration and
      focus order. Script that rebuilds those takes on their bugs. I write behavior only for what the platform does
      not yet do.
      The <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink> lists what rebuilding them by hand cost.</p>
    <p className="paragraph">Every pointer action has a keyboard equivalent: what a pointer can drag, the
      arrow keys can move, or the feature is not finished. WCAG requires that all functionality is{' '}
    <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">“operable through a keyboard interface”</a>. The page
      announces each change too: a sighted reader watches the order change, and a screen reader user hears the same
      change read out.</p>
    <p className="paragraph">The test is to read the state on its own. If the data does not say what is
      true without the page open beside it, behavior has leaked into presentation. The other two languages take the
      same test: the HTML makes sense with the styles off, and the class list says what the element needs. Each
      language tells its whole story alone.
      The <MomentLink to="documentComesBack">2016 moment</MomentLink> ends on the same point: the work moves, the three responsibilities do not.</p>
  </>;
