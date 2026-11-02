import {FC} from 'react';
import {Link} from 'react-router';
import {MomentLink} from '@pages/Record/MomentLink';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {
  BuildsCarve,
  ConditionCarve,
  DecodeTradeCarve,
  EventsCarve,
  ExchangeCarve,
  MiddlewareCarve,
  PreludeCarve,
  ReducerCarve,
  SheetQuestionsCarve,
  TableEventsCarve,
  TableReducerCarve,
  TradeDecoderCarve
} from './BehaviorCarves';
import {OneDirectionLoop} from './OneDirectionLoop';

const eventSourcing = 'https://martinfowler.com/eaaDev/EventSourcing.html';
const customEvent = 'https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent';
const schemawax = 'https://github.com/michaljanocko/schemawax';

export const BehaviorPractice: FC = () =>
  <>
    <h3 className="paragraph bold">What is true and what happened</h3>
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
    <p className="paragraph">The demos store holds the column order in its{' '}
      <code className="monospaced">arrangement</code>. <code className="monospaced">selectColumns</code> works out the
      columns on screen from it, so nothing stores them twice.</p>
    <p className="paragraph">AngularJS, in the <MomentLink to="frameworks">2010 moment</MomentLink>, bound model and
      view both ways. I keep one direction, the <MomentLink to="oneDirection">July 2014 moment</MomentLink>’s
      answer.</p>
    <OneDirectionLoop/>
    <h3 className="paragraph bold">Code that reads as sentences</h3>
    <p className="paragraph">An event is a name for what happened. The state’s type is a name for what is true, and it
      refuses what cannot be. So the code reads as sentences to the next reader, who was not there when it was
      written.</p>
    <p className="paragraph">I wrote small functions so a condition reads in
      words: <code className="monospaced">has</code>,{' '}
    <code className="monospaced">not</code>, <code className="monospaced">is</code> and{' '}
    <code className="monospaced">notEmpty</code>, from my own library,{' '}
    <a className="signpost" href="https://github.com/RyanDur/sand">sand</a>. Each is a line or two:</p>
    <PreludeCarve/>
    <p className="paragraph">Here the table asks, in words I would say aloud, whether a drag is under way and a column
      is settling:</p>
    <ConditionCarve/>
    <p className="paragraph">The style sheet asks its questions in the same
      words. <code className="monospaced">:has()</code> asks
      whether an element holds something, <code className="monospaced">:not()</code> turns a question round,
      and <code className="monospaced">:is()</code> asks whether any of a list is true:</p>
    <SheetQuestionsCarve/>
    <p className="paragraph">I would rather the next reader meet a word than work out what a{' '}
      <code className="monospaced">!</code> asks. The cost is that they learn sand’s words first.</p>
    <h3 className="paragraph bold">Where the world comes in</h3>
    <p className="paragraph">Not every event starts at the pointer. A reply from a server or a price
      arriving over a socket is an event like any other: it says what happened somewhere else, and the state still
      decides what is true when it arrives.
      The <MomentLink to="pageBecomesApplication">2005 moment</MomentLink> is where that pattern got its name, Ajax, and
      became ordinary.</p>
    <p className="paragraph">The shell is where the world comes in. A middleware is code the store lets stand
      between an event and the reducer:</p>
    <MiddlewareCarve/>
    <p className="paragraph">The demos page’s middleware holds the socket and the fetches. What arrives becomes an
      event, and it goes to the same reducer a key press reaches:</p>
    <ExchangeCarve/>
    <p className="paragraph">Martin Fowler’s <a className="signpost" href={eventSourcing}>Event Sourcing</a>, in 2005,
      goes further: <a className="signpost" href={eventSourcing}>“Capture all changes to an application state as a
        sequence of events.”</a> It keeps every event, so the history can be replayed. This store keeps only the state
      each event leaves, so it cannot replay anything, but every change still arrives as an event.</p>
    <h3 className="paragraph bold">Trusted at the boundary</h3>
    <p className="paragraph">I like to trust my boundaries. A value from a socket or a fetch is unknown until it is
      checked, so I check it once, where it enters, and nothing after that has to wonder.</p>
    <p className="paragraph"><a className="signpost" href={schemawax}>schemawax</a>,{' '}
      <a className="signpost" href={schemawax}>“Tiny typed data decoder”</a>, lets me write the shape once. The decoder
      checks a value against it, and the type comes from the decoder, so the two cannot drift apart. Here is the
      decoder for a trade from Coinbase’s feed:</p>
    <TradeDecoderCarve/>
    <p className="paragraph">A trade passes three gates on its way in. The text has to parse, the parsed value has to
      match the decoder, and its numbers have to be numbers. Whatever fails a gate comes out as nothing, so the
      reducer only ever sees a trade:</p>
    <DecodeTradeCarve/>
    <p className="paragraph">The one place this boundary can throw is <code className="monospaced">JSON.parse</code>,
      and <code className="monospaced">attempt</code>, from sand, turns that throw into nothing. The gallery’s four
      museums each have a decoder of their own, and each response is typed from its decoder the same way.</p>
    <h3 className="paragraph bold">The core and the shell</h3>
    <p className="paragraph">The core is functional and the shell is imperative. The functions that move
      from one state to the next are pure, so I test them on their own with no page involved. The shell holds
      the state, listens for events, applies the next state and updates the screen. Requests go out through the same
      path that state changes come in. Change the framework, or remove it, and only the shell changes.
      The <MomentLink to="frameworks">2010 moment</MomentLink> names four frameworks in six years; the core should
      outlast them.</p>
    <p className="paragraph">The <Link className="signpost" to={demoAddress(DemoTopics.tables)}>tables demo</Link> shows
      the split. Its React build and its plain-script build take the same table store, so the same reducer answers
      both:</p>
    <BuildsCarve/>
    <p className="paragraph">The plain-script build finds its tables by their data attribute and listens for the
      table’s own events, each named for what happened. A{' '}
    <a className="signpost" href={customEvent}>CustomEvent</a> is how a page names one:</p>
    <TableEventsCarve/>
    <h3 className="paragraph bold">The platform first</h3>
    <p className="paragraph">The platform comes first here too. An accordion on the demos page opens and closes
      with no script, a popover closes itself, and the browser already provides the back button, scroll restoration and
      focus order. Script that rebuilds those takes on their bugs. I write behavior only for what the platform does
      not yet do.
      The <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink> lists what rebuilding them by hand cost.</p>
    <h3 className="paragraph bold">Every gesture has a key</h3>
    <p className="paragraph">Every pointer action has a keyboard equivalent: what a pointer can drag, the
      arrow keys can move, or the feature is not finished. WCAG requires that all functionality is{' '}
    <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">“operable through a
      keyboard interface”</a>. The page
      announces each change too: a sighted reader watches the order change, and a screen reader user hears the same
      change read out.</p>
    <h3 className="paragraph bold">The test the state has to pass</h3>
    <p className="paragraph">The test is to read the state on its own. If the data does not say what is
      true without the page open beside it, behavior has leaked into presentation. The other two languages take the
      same test: the HTML makes sense with the styles off, and the class list says what the element needs. Each
      language tells its whole story alone.
      The <MomentLink to="documentComesBack">2016 moment</MomentLink> ends on the same point: the work moves, the three
      responsibilities do not.</p>
  </>;
