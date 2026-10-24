import {FC, ReactNode} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World, worldParam} from '../params';
import {TheImplementation} from './steps';
import {StoreStory} from './StoreRecipe';
import exchangeSource from '@pages/Demos/exchange.ts?sample';
import demosSource from '@pages/Demos/store.ts?sample';
import foldSource from '@pages/Demos/Tables/Aggregations/fold.ts?sample';
import dealSource from '../Builds/EagerTable/EagerTable.tsx?sample';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import cellSource from '@components/DragSortableTable/Cell.tsx?sample';
import buildSrc from '../Frame/builds/Eager.ts?sample';
import frameRows from '../Frame/table/rows.ts?sample';
import hydrateSource from '@pages/Demos/Tables/Aggregations/recent-trades.ts?sample';
import widthsSource from '@pages/Demos/Tables/Aggregations.css?sample';
import tableSource from '../Frame/table.html?sample';
import {DataPath} from './DataPath';
import '../../Recipe/Recipe.css';
import {Term} from './Term';

const gap = plain(' ');

const dealPlans: Record<World, ReactNode> = {
  react: <>
    <Says>A class is a name written on an element that a stylesheet’s rules pick out. The columns are declared
      once, each with a name and a class; how wide they open is CSS. You could let the browser size the columns by their content, but a live table
      would never hold still: a column sized by its content widens with a longer number and moves every column beside it. Each time, the browser redoes its layout, the work of deciding every box’s size and place. And you could carry widths in
      the data, but they are layout, not data. So I deal the opening widths from the page’s stylesheet.
      With <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed the header widths govern their whole columns, so the table always fills
      its container and the columns hold still while the values change.</Says>
    <Says>No JavaScript knows these widths, because nothing needs the size until you touch something. The first
      press or focus of a resize handle measures the headers as they stand and creates the{' '}
    <Term word="ledger">ledger</Term> from them; the drag measures them at the lift. A value that changes at
      runtime is state, and until then nothing has changed.</Says>
  </>,
  vanilla: <Says>A class is a name written on an element that a stylesheet’s rules pick out. The columns are
    declared once, each a header cell with a name and a class; how wide they open is CSS. You could let the browser size the columns by their content,
    but a live table would never hold still: a column sized by its content widens with a longer number and moves every column beside it. Each time, the browser redoes its layout, the work of deciding every box’s size and place. And you
    could carry widths in the markup, but they are layout, not content. So I deal the opening widths from the page’s
    stylesheet. With <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed the header widths govern their whole columns, so the table always fills its
    container and the columns
    hold still while the values change.</Says>
};

const suppliedBy: Record<World, ReactNode> = {
  react: <>
    <Says>The page writes the whole table itself: the <code>table</code>, its caption, the head and the body, and after
      it an <code>output</code>, the move report that tells a screen reader what moved, whose <code>for</code> names the
      table it reports on. The two choices the later steps explain, <code>origin</code>, whether a carried row’s or
      column’s cells stay visible in their place, and <code>motion</code>, whether moves animate, are classes on the
      table.</Says>
    <Says>The behaviour arrives through <code>useDragSortable</code>, a hook: a function a component calls while it
      renders, to keep something across renders or to read something kept outside React. The page calls it with its
      columns, its rows and the two choices.</Says>
    <Says>The hook makes the hand, a store of the table’s own. A store is one plain object that holds state and answers
      when asked. It takes actions, records of what happened, through its dispatch, and after each action it calls its
      subscribers, the functions that asked to hear of changes. The hand holds what is held, the widths, and the marks a
      move leaves on the columns or rows it shoves and on the one it drops, which last as long as their slide.</Says>
    <Says>The hook returns what the parts need to know: the hand’s state, the columns and rows, the dispatch, and the
      classes the table wears, since the behaviour’s own sheets read them.</Says>
    <Says>The page wraps the table in a <Term word="provider">provider</Term>, React’s way to give every component
      inside it one value without adding an element to the page, and the headers, rows, grips, handles and menus read
      the hook’s answer from it.</Says>
    <Says>Each row header carries its window as its label, so a screen reader names the row by its window and not by
      the grip inside it.</Says>
  </>,
  vanilla: <>
    <Says>The page writes the whole table as it would for any table: the <code>table</code>, its caption, the head and
      the body, and after it an <code>output</code>, the move report that tells a screen reader what moved,
      whose <code>for</code> names the table it reports on. One attribute, <code>data-drag-sortable</code>, marks the table as
      one that drag-sorts. The two choices the later steps explain, <code>origin</code>, whether a carried row’s or
      column’s cells stay visible in their place, and <code>motion</code>, whether moves animate, are classes on the
      table.</Says>
    <Says>At boot a script finds every table so marked and calls <code>dragSortable</code> on it. There are two builds
      of <code>dragSortable</code>, eager and lazy, one file each, and the pace is which one boot calls.</Says>
    <Says>The call makes the hand, a store of the table’s own. A store is one plain object that holds state and answers
      when asked. It takes actions, records of what happened, through its dispatch, and after each action it calls its
      subscribers, the functions that asked to hear of changes. The hand holds what is held and the
      widths. The call also wires the table’s listeners at once.</Says>
    <Says>The call returns <code>reconcile</code>, the function the page calls whenever its own store changes. Reconcile
      moves the cells to the new order and writes the text that changed.</Says>
    <Says>The table keeps no copy of the order: the page gives <code>dragSortable</code> two functions that read its
      columns and rows, and the table asks them when it needs an answer.</Says>
    <Says>The table itself is the browser’s, so it shows with its rows before the script runs and without it.</Says>
    <Says>Each row header also carries its window as its label, so a screen reader names the row by its window and not
      by the grip inside it.</Says>
  </>
};

const dealCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...span(dealSource, 'const sortable = useDragSortable(', 'const sortable = useDragSortable(')
    ]}/>
    <Snippet label="HTML" lines={[
      ...span(dealSource, 'return <DragSortable value={sortable}>', '</Headers>'), gap,
      ...span(dealSource, '</table>', '</DragSortable>')
    ]}/>
    <Snippet label="CSS" lines={[
      ...unit(widthsSource, '.aggregations {')
    ]}/>
    <Snippet label="HTML" lines={[
      ...span(headerSource, 'return <th {...th}', 'scope="col"'), gap,
      ...span(cellSource, 'return <td {...td}', '</td>;')
    ]}/>
  </Codes>,
  vanilla: <Codes>
    <Snippet label="HTML" lines={[
      ...span(tableSource, '<table class="fancy-table', '</th>'), gap,
      ...span(tableSource, '<tbody class="body">', '</tr>')
    ]}/>
    <Snippet label="CSS" lines={[
      ...unit(widthsSource, '.aggregations {')
    ]}/>
  </Codes>
};

const socketPlans: Record<World, string> = {
  react: 'One connection at page scope, so the stream survives every tab and dial below it.',
  vanilla: 'One connection for the document’s whole life.'
};

const foldSays: Record<World, ReactNode> = {
  react: <Says>Every render folds the same trades into per-window aggregates: counts, volume,
    vwap, the change since the window opened. The fold runs over the same capped trades
    each time, so the windows always match the trades the page holds.</Says>,
  vanilla: <Says>Every arrival refolds the same trades into per-window aggregates. The fold is the same module the
    React world runs. What React did for you ends here: there is no render to catch the change, so the page refolds the trades and calls <code>reconcile</code>, which writes only the cells whose text changed and reseats the rows when the sort ranks them anew. The arrangement is the page’s, and that is the store story.</Says>
};

const foldCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...unit(foldSource, 'export const windows'), gap,
      ...unit(foldSource, 'const aggregate = ')
    ]}/>
  </Codes>,
  vanilla: <Codes>
    <Snippet label="TS" lines={[
      ...unit(foldSource, 'export const windows'), gap,
      ...unit(buildSrc, 'const reconciled = '), gap,
      ...unit(frameRows, 'export const writeCells = ')
    ]}/>
  </Codes>
};

const refolds: Record<World, string> = {
  react: 'Then every render refolds every trade the page holds into the windows, because refolding is simple math and cannot drift out of sync.',
  vanilla: 'Then every arrival refolds every trade the page holds into the windows, and the page calls reconcile, which writes what changed.'
};

const StillStory: FC<{world: World}> = ({world}) =>
  <Story param="living" id="still"
    can="The trader can read the market in a table"
    soThat="the shape is right before anything moves">
    <TheImplementation world={world} react="Aggregations" vanilla="Frame/frame.main.ts"/>
    <Tell>The shape comes from the design, in the element the clues pointed at: a few measures
      across a few time windows, numbers on two axes. That is what a table is for. I build it first as a still, from
      whatever trades the page holds: headers on both axes, and the
      reading order correct before a single interaction exists.</Tell>
    <Steps>
      <Step title="Deal a real HTML table">
        <Words want={<>The table is more than JavaScript holding numbers; it is an
          HTML <Mdn path="Web/HTML/Element/table">table</Mdn>: header cells that declare their
          scope, rows a reader and a screen reader both move through.</>}>
          {dealPlans[world]}
        </Words>
        <Reveal>
          <Says>The markup is the platform’s own.
            A <Mdn path="Web/HTML/Element/thead">thead</Mdn> of th headers, one per column, each
            announcing <Mdn path="Web/HTML/Element/th#scope">scope="col"</Mdn>: that one attribute
            is how a screen reader knows to say the column’s name with every cell below it.
            A <Mdn path="Web/HTML/Element/tbody">tbody</Mdn> of rows built from the trades the page holds;
            each row leads with a th of its own,
            announcing <Mdn path="Web/HTML/Element/th#scope">scope="row"</Mdn> so the window’s name
            travels with every cell beside it, then a td per measure.</Says>
          {suppliedBy[world]}
          <Says>You could build this out of divs and grid, and it would look identical. But the table
            element brings behaviour you would otherwise have to build: readers move through it row by row and cell by
            cell, headers belong to their columns, and everything later, the sorting announcements,
            the drags, the keyboard, builds on these roles instead of reinventing them. This is the
            first rule of <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>: use the native element when one already has the behaviour you
            need.</Says>
          {dealCodes[world]}
        </Reveal>
      </Step>
    </Steps>
  </Story>;

const FlowStory: FC<{world: World}> = ({world}) =>
  <Story param="living" id="flow"
    can="The trader can watch the market live, in windows"
    soThat="the numbers stay current without a single refresh">
    <Tell>The still becomes a stream. The trader arrives mid-session, so the page starts with
      one plain fetch of the recent history. And the numbers have to keep themselves current:
      polling is always a little late and mostly wasted requests. The exchange offers a stream,
      so a socket comes next, and from then on the trades arrive on their own, kept under a cap
      so a long session cannot grow forever. {refolds[world]}</Tell>
    <DataPath/>
    <Steps>
      <Step title="Start with the recent past, in one fetch">
        <Words want="An empty table at open is a lie about the market; the trader arrives mid-session, so the recent past comes first, and it is just a fetch.">
          <Says>The recent past is not a stream problem: it is one request, and the only care is
            the overlap between the fetch and the socket.</Says>
        </Words>
        <Reveal>
          <Says>One GET for the last thousand trades, decoded and cleaned. When the stream is
            also running, the function <Term word="hydrate">hydrated</Term> merges the two, drops whatever the stream already delivered,
            and keeps everything in time order.</Says>
          <Codes>
            <Snippet label="TS" lines={[
              ...unit(hydrateSource, 'export const recentTrades'), gap,
              ...unit(hydrateSource, 'export const hydrated')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
      <Step title="Open a socket to the exchange">
        <Words want={<>The table is only worth sorting if its numbers are the market’s, now:
          a <Mdn path="Web/API/WebSocket">socket</Mdn> to the exchange, subscribed to the product,
          every trade arriving as it happens.</>}>
          <Says>{socketPlans[world]} The open questions are the cap that keeps a long session
            from growing forever, and what to do when the socket closes.</Says>
        </Words>
        <Reveal>
          <Says>The handshake subscribes to the product.
            Every <Mdn path="Web/API/WebSocket/message_event">message</Mdn> decodes into a trade, appended under a cap so a long session never grows without bound.
            A <Mdn path="Web/API/WebSocket/close_event">close</Mdn> marks the feed failed.</Says>
          <Codes>
            <Snippet label="TS" lines={[
              ...unit(exchangeSource, 'const stream = streaming('), gap,
              ...unit(demosSource, 'const tradesReducer')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
      <Step title="Fold the stream into windows">
        <Words want="Raw trades tick too fast to read; the trader reads windows: this minute, the last five, the hour, the whole session.">
          <Says>The windows should be derived, never accumulated: refold every trade the page holds
            each time, so the aggregates cannot drift from the trades that made them.</Says>
        </Words>
        <Reveal>
          {foldSays[world]}
          {foldCodes[world]}
        </Reveal>
      </Step>
    </Steps>
  </Story>;

export const StillTableRecipe: FC = () => {
  const {world = 'react'} = useSearchParamsObject({world: worldParam});
  return <section aria-label="the still table" className="build-steps">
    <Stories><StillStory world={world}/></Stories>
  </section>;
};

export const FlowTableRecipe: FC = () => {
  const {world = 'react'} = useSearchParamsObject({world: worldParam});
  return <section aria-label="the living table" className="build-steps">
    <Stories><FlowStory world={world}/><StoreStory world={world}/></Stories>
  </section>;
};
