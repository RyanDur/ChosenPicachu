import {FC} from 'react';
import {MomentLink} from '@pages/Record/MomentLink';
import {ConditionCarve, EventsCarve, PreludeCarve, ReducerCarve, SheetQuestionsCarve, TableReducerCarve} from './BehaviorCarves';
import {OneDirectionLoop} from './OneDirectionLoop';

export const BehaviorPractice: FC = () =>
  <>
    <p className="paragraph">Behavior splits into what is true and what happened. The state is what is
      true: the order the rows are in, the choice the reader made, the thing being dragged. It holds only what
      cannot be worked out from something else. Events are what happened, so I name them in the past tense:
      lifted, dropped, chosen. Each event goes to a pure function that takes the current state and returns the next.
      I keep the state in one place, and replacing it is the only way anything on screen changes.</p>
    <p className="paragraph">A reducer is that pure function, and its type says so: it takes the state and an event and
      returns the state.</p>
    <ReducerCarve/>
    <p className="paragraph">Two events come from the reader’s hands, and one from a server:</p>
    <EventsCarve/>
    <p className="paragraph">The table’s reducer is small reducers combined, and it ignores any event that is not the
      table’s:</p>
    <TableReducerCarve/>
    <p className="paragraph">The demos store holds the column order, as its arrangement.{' '}
      <code className="monospaced">selectColumns</code> works out the columns on screen from it, so nothing stores them
      twice.</p>
    <p className="paragraph">AngularJS, in the <MomentLink to="frameworks">2010 moment</MomentLink>, bound model and view both ways. I keep one
      direction, the <MomentLink to="oneDirection">July 2014 moment</MomentLink>’s answer.</p>
    <OneDirectionLoop/>
    <p className="paragraph">An event is a name for what happened. The state’s type is a name for what is true, and it
      refuses what cannot be. So the code reads as sentences to the next reader, who was not there when it was written.</p>
    <p className="paragraph">I wrote small functions so a condition reads in words: <code className="monospaced">has</code>,{' '}
      <code className="monospaced">not</code>, <code className="monospaced">empty</code> and{' '}
      <code className="monospaced">is</code>, from my own library,{' '}
      <a className="signpost" href="https://github.com/RyanDur/sand">sand</a>. Each is a line or two:</p>
    <PreludeCarve/>
    <p className="paragraph">So the table asks whether a drag is under way and a column is settling the way I would say
      it:</p>
    <ConditionCarve/>
    <p className="paragraph">The style sheet asks its questions in the same words. <code className="monospaced">:has()</code> asks
      whether an element holds something, <code className="monospaced">:not()</code> turns a question round,
      and <code className="monospaced">:is()</code> asks whether any of a list is true:</p>
    <SheetQuestionsCarve/>
    <p className="paragraph">Nobody reading either should have to turn a symbol round in their head to learn what was
      asked.</p>
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
