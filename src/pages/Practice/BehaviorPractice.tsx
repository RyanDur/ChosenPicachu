import {FC} from 'react';
import {Link} from 'react-router';
import {MomentLink} from '@pages/Record/MomentLink';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {
  BuildsCarve,
  CarryCarve,
  ConditionCarve,
  DecodeTradeCarve,
  EventsCarve,
  ExchangeCarve,
  HistoryCarve,
  MiddlewareCarve,
  PreludeCarve,
  RecentTradesCarve,
  ReducerCarve,
  SheetQuestionsCarve,
  TableEventsCarve,
  TableReducerCarve,
  TradeDecoderCarve
} from './BehaviorCarves';
import {OneDirectionLoop} from './OneDirectionLoop';
import {TwoTracks} from './TwoTracks';
import {elementsPart} from './StructurePractice';
import {practiceAddress} from './types';

const eventSourcing = 'https://martinfowler.com/eaaDev/EventSourcing.html';
const customEvent = 'https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent';
const schemawax = 'https://github.com/michaljanocko/schemawax';
const illegalStates = 'https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/';
const sand = 'https://github.com/RyanDur/sand';
const railway = 'https://fsharpforfunandprofit.com/rop/';

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
      refuses what cannot be.</p>
    <p className="paragraph">Here is what that refusal looks like. A drag carries a column or a row, never both and never
      neither, so <code className="monospaced">Carry</code> takes one of two shapes. Each shape names its axis and what
      it holds:</p>
    <CarryCarve/>
    <p className="paragraph">Two booleans, one for a held column and one for a held row, would let the state say both at
      once. The union has no way to say it.</p>
    <p className="paragraph">A sort runs one of two ways, so <code className="monospaced">Direction</code> is those two
      words, <code className="monospaced">'ascending' | 'descending'</code>, and a misspelled direction is an error
      before the page runs. Every field of the table’s state is <code className="monospaced">readonly</code>, so the
      type checker refuses an edit to an old state, and the reducer has to return a new one. The report is missing
      before anything has moved, and the selector that reads it returns sand’s{' '}
    <code className="monospaced">Maybe</code>.</p>
    <p className="paragraph">Scott Wlaschin calls this using the type system to{' '}
      <a className="signpost" href={illegalStates}>“make illegal states unrepresentable”</a>, a phrase he credits to
      Yaron Minsky.</p>
    <p className="paragraph">The pre-commit hook runs the type checker as <code className="monospaced">tsc -b</code>,
      and refuses a commit that lets a forbidden state into a type.</p>
    <p className="paragraph">Names and types like these let the code read as sentences to the next reader, who was not
      there when it was written. I wrote small functions so a condition reads in
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
      checked, so I check it once, where it enters, and the code after that takes it at its type.</p>
    <p className="paragraph"><a className="signpost" href={schemawax}>schemawax</a>,{' '}
      <a className="signpost" href={schemawax}>“Tiny typed data decoder”</a>, lets me write the shape once. The decoder
      checks a value against that shape, and the type of whatever passes comes from the decoder, so the check and the
      type cannot drift apart. Here is the decoder for a trade as Coinbase’s feed sends it:</p>
    <TradeDecoderCarve/>
    <p className="paragraph">A trade passes three gates on its way in. The text has to parse, the parsed value has to
      match the decoder, and its price, size and time, which the feed sends as text, have to read as numbers. The last
      gate, <code className="monospaced">toTrade</code>, turns what passed into the page’s own{' '}
    <code className="monospaced">Trade</code>. <code className="monospaced">decodeTrade</code> returns a{' '}
    <code className="monospaced">Maybe</code>, a trade or nothing, and it is nothing when any gate fails, so the
      reducer only ever sees a trade:</p>
    <DecodeTradeCarve/>
    <p className="paragraph">The one place this boundary can throw is <code className="monospaced">JSON.parse</code>,
      and <code className="monospaced">attempt</code>, from sand, turns that throw into nothing.</p>
    <p className="paragraph">The trade is not the only value checked this way. The gallery’s four museums each have a
      decoder of their own, and each response is typed from its decoder.</p>
    <h3 className="paragraph bold">When something fails</h3>
    <p className="paragraph">A fetch can fail, and I don’t want every step after it to check.
      sand’s <code className="monospaced">Result</code> is either a success or a failure, and its README says the
      failure <a className="signpost" href={sand}>“rides along untouched until you decide what to do with it”</a>.{' '}
    <code className="monospaced">map</code> and <code className="monospaced">mBind</code> work on a success and let
      a failure pass.</p>
    <TwoTracks/>
    <p className="paragraph">Here is the request for recent trades. The response is fetched, checked against its
      decoder and turned into trades. If a step fails, the steps after it do not run:</p>
    <RecentTradesCarve/>
    <p className="paragraph">The exchange takes the result that <code className="monospaced">recentTrades</code>{' '}
      returns. A success goes to the reducer as <code className="monospaced">historyArrived</code>. A failure goes to
      the edge, the code that decides what the page says:</p>
    <HistoryCarve/>
    <p className="paragraph">In the React build, the edge turns the failure into a sentence and shows it in a banner.
      The reducer never sees the failure.</p>
    <p className="paragraph">Scott Wlaschin’s 2014 talk <a className="signpost" href={railway}>Railway Oriented
      Programming</a> draws the same idea as a railway, with the success track as
      the <a className="signpost" href={railway}>“happy path”</a>.</p>
    <p className="paragraph">The boundary, the types and the two tracks work together. Each value is checked where it
      enters, and the types refuse what cannot be. A failure rides its own track to the edge. The reducer may hear that
      a fetch was refused or the feed failed, as <code className="monospaced">candlesRefused</code>{' '}
      and <code className="monospaced">feedFailed</code>, but never why. So everything the reducer gets is already true,
      and nothing in it can fail.</p>
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
    <p className="paragraph">The platform comes first here too. The Structure tab’s
      part <Link className="signpost" to={`${practiceAddress('Structure')}#${elementsPart}`}>From the content to the
        element</Link> lists what the elements do on their own. A details opens and shuts, a modal dialog holds focus, a
      popover closes on Escape, and a form refuses an empty required field, so I don’t script any of it. The browser
      also provides the back button, scroll restoration and focus order. Script that rebuilds those takes on their
      bugs, and the <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink> lists what rebuilding them by hand
      cost.</p>
    <p className="paragraph">Where the platform is new, I write a small fallback and run it only where a browser lacks
      the feature. The feedback dialog holds the site’s two. Its buttons open and close it with invoker commands, and
      where a browser has none, a click handler does it instead. It closes on a click outside it
      with <code className="monospaced">closedby</code>, and where a browser lacks that, a click handler closes it too.
      Any other behavior the platform lacks I attach with script: by a data attribute in plain HTML, like the tables
      demo’s <code className="monospaced">data-drag-sortable</code>, and by a component in React.</p>
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
