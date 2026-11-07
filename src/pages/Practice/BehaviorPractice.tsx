import {FC} from 'react';
import {Link} from 'react-router';
import {directoryInRepository, fileInRepository} from '@pages/Paths';
import {MomentLink} from '@pages/Record/MomentLink';
import {demoAddress, DemoTopics} from '@pages/Demos';
import {
  BuildsCarve,
  CarryCarve,
  ConditionCarve,
  DecodeTradeCarve,
  EventsCarve,
  ExchangeCarve,
  HistoryCarve,
  MiddlewareCarve,
  MoveReportCarve,
  PreludeCarve,
  RecentTradesCarve,
  ReducerCarve,
  SheetQuestionsCarve,
  TableEventsCarve,
  TableReducerCarve,
  TradeDecoderCarve,
  WalkCaseCarve,
  WalksCarve
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
const focusOrder = 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html';
const statusMessages = 'https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html';
const output = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output';

export const BehaviorPractice: FC = () =>
  <>
    <h3 className="paragraph bold">What is true and what happened</h3>
    <p className="paragraph">Behavior splits into what is true and what happened. The state is what is
      true: the order the rows are in, the choice the reader made, the thing being dragged. It holds only what
      the code cannot work out from something else. Events are what happened, so I name them in the past tense:
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
    <p className="paragraph">Names and types like these let the code read as sentences to the next reader, who was not
      there when I wrote it. I wrote small functions so a condition reads in
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
    <p className="paragraph">I like to trust my boundaries. A value from a socket or a fetch is unknown until a decoder
      checks it, so I check it once, where it enters, and the code after that takes it at its type.</p>
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
      decoder of their own, and each response takes its type from its decoder.</p>
    <h3 className="paragraph bold">When something fails</h3>
    <p className="paragraph">A fetch can fail, and I don’t want every step after it to check.
      sand’s <code className="monospaced">Result</code> is either a success or a failure, and its README says the
      failure <a className="signpost" href={sand}>“rides along untouched until you decide what to do with it”</a>.{' '}
    <code className="monospaced">map</code> and <code className="monospaced">mBind</code> work on a success and let
      a failure pass.</p>
    <TwoTracks/>
    <p className="paragraph">Here is the request for recent trades. <code className="monospaced">recentTrades</code>
      fetches the response, checks it against its decoder and turns it into trades. If a step fails, the steps after it
      do not run:</p>
    <RecentTradesCarve/>
    <p className="paragraph">The exchange takes the result that <code className="monospaced">recentTrades</code>{' '}
      returns. A success goes to the reducer as <code className="monospaced">historyArrived</code>. A failure goes to
      the edge, the code that decides what the page says:</p>
    <HistoryCarve/>
    <p className="paragraph">In the React build, the edge turns the failure into a sentence and shows it in a banner.
      The reducer never sees why a step failed.</p>
    <p className="paragraph">Scott Wlaschin’s 2014 talk <a className="signpost" href={railway}>Railway Oriented
      Programming</a> draws the same idea as a railway, with the success track as
      the <a className="signpost" href={railway}>“happy path”</a>.</p>
    <p className="paragraph">The boundary, the types and the two tracks work together. A decoder checks each value where
      it enters, the types refuse what cannot be, and a failure rides its own track to the edge. So everything the
      reducer gets is already true, and nothing in it can fail. It may still hear that a fetch was refused or the feed
      failed, as <code className="monospaced">candlesRefused</code> and <code className="monospaced">feedFailed</code>,
      but never why.</p>
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
      also provides the back button, scroll restoration and focus order. Rebuilding them in script means getting them
      right a second time, and the <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink> lists what that
      cost when pages rebuilt the back button and scroll restoration by hand.</p>
    <p className="paragraph">Where the platform is new, I write a small fallback and run it only where a browser lacks
      the feature. The feedback dialog holds the site’s two. Its buttons open and close it with invoker commands, and
      where a browser has none, a click handler does it instead. Its <code className="monospaced">closedby</code>{' '}
      attribute closes it on a click outside, and where a browser lacks that, a click handler closes it too.</p>
    <p className="paragraph">Any other behavior the platform lacks, I attach with script. The plain-script build finds
      the element that needs it by a data attribute, like the tables demo’s{' '}
    <code className="monospaced">data-drag-sortable</code>, and React uses a component.</p>
    <h3 className="paragraph bold">Every gesture has a key</h3>
    <p className="paragraph">Every pointer action has a keyboard equivalent: what a pointer can drag, the
      arrow keys can move, or the feature is not finished. WCAG requires that all functionality is{' '}
    <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">“operable through a
      keyboard interface”</a>.</p>
    <p className="paragraph">On the tables demo, an arrow key walks a column or a row: each press moves it one place.
      The table names each walk for what happened:</p>
    <WalksCarve/>
    <p className="paragraph">A walk and a drag that passes a neighbour share one case of the reducer, so a key and
      a pointer move the other columns by the same rule:</p>
    <WalkCaseCarve/>
    <p className="paragraph">The focus stays on the column or row being walked, so the next key press reaches it
      again. WCAG 2.4.3 asks that focus moves{' '}
    <a className="signpost" href={focusOrder}>“in an order that preserves meaning and operability”</a>.</p>
    <p className="paragraph">The page also says what moved. A sighted reader watches the order change, and a screen
      reader user hears where the column or row went. The report is a type, and{' '}
    <code className="monospaced">moveReport</code> turns it into words:</p>
    <MoveReportCarve/>
    <p className="paragraph">Both builds write those words into an <code className="monospaced">output</code> named
      move report. An output is a status, and MDN says a screen reader announces what is posted in
      it <a className="signpost" href={output}>“without requiring that focus is switched away from the controls that
        produce those results”</a>. That is what WCAG 4.1.3 asks of
      a <a className="signpost" href={statusMessages}>status message</a>.</p>
    <h3 className="paragraph bold">The test the state has to pass</h3>
    <p className="paragraph">The test is to read the state on its own. If the data does not say what is
      true without the page open beside it, behavior has leaked into presentation. The other two languages take the
      same test: the HTML makes sense with the styles off, and the class list says what the element needs. Each
      language tells its whole story alone.
      The <MomentLink to="documentComesBack">2016 moment</MomentLink> ends on the same point: the work moves, the three
      responsibilities do not.</p>
    <p className="paragraph">Nobody checks the state test by eye. Three gates hold the site to it, and the review holds
      one more rule.</p>
    <ul className="practice-list">
      <li className="paragraph">The specs test the core as functions, because it is functions.{' '}
        <a className="signpost" href={directoryInRepository('src/components/DragSortableTable/__tests__')}>Four
          specs</a>, <code className="monospaced">sorting</code>, <code className="monospaced">travel</code>,{' '}
        <code className="monospaced">survey</code> and <code className="monospaced">tableStore</code>, call the
        table’s code with no page at all, and they run on every commit.
      </li>
      <li className="paragraph">The journeys test the shell, because it touches the world. They drive the tables by
        pointer and by key in three browsers, and check the order a reader sees and the move report a screen reader
        hears. AGENTS.md sets one rule for them:{' '}
      <a className="signpost" href={fileInRepository('AGENTS.md')}>“Journeys run as a reader who asks for less
        motion, and none is retried or skipped.”</a>
      </li>
      <li className="paragraph">The pre-commit hook runs <code className="monospaced">tsc -b</code>{' '}
        <a className="signpost" href={fileInRepository('scripts/git-hooks/pre-commit')}>before every commit</a> and
        refuses one that lets a forbidden state into a type.
      </li>
    </ul>
    <p className="paragraph">The rule the review holds is one line in AGENTS.md:{' '}
      <a className="signpost" href={fileInRepository('AGENTS.md')}>“A <code className="monospaced">useRef</code> is
        allowed only (1) to hold a <code className="monospaced">dialog</code> the component shows as a modal
        with <code className="monospaced">showModal()</code>, or (2) to read the element’s own details, such as its
        measured size, when nothing else gives them, such as an event.”</a> A ref keeps a value outside the state,
      where no reducer sees it and no test reads it. Two files hold one today, both for the second
      reason: <code className="monospaced">MeasuredPanel</code> reads the height its panel stands at,
      and <code className="monospaced">DialGroup</code> reads whether each dial’s name and pills fit side by side.</p>
  </>;
