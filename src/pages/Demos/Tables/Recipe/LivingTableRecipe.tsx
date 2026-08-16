import {FC, ReactNode} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Codes, Mdn, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World, worldParam} from '../params';
import feedSource from '@pages/Demos/Charts/live-trades.ts?raw';
import foldSource from '@pages/Demos/Tables/Aggregations/fold.ts?raw';
import dealSource from '@pages/Demos/Tables/Aggregations/index.tsx?raw';
import stateSource from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerHideAnimatedTable/Header.tsx?raw';
import rowSource from '@components/DragSortableTable/EagerHideAnimatedTable/Row.tsx?raw';
import hydrateSource from '@pages/Demos/Tables/Aggregations/recent-trades.ts?raw';
import widthsSource from '@pages/Demos/Tables/Aggregations/Aggregations.css?raw';
import tableSource from '../Frame/table.html?raw';
import deskSource from '@components/DragSortableTable/desk.ts?raw';
import frameStand from '../Frame/shell/stand.ts?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

const dealOpeners: Record<World, ReactNode> = {
  react: <>
    <Says>The columns are declared once, each with a name and a class; how wide they open is CSS.
      We could let the browser size the columns by their content, but a live table
      would breathe: every new number re-negotiates the layout. And we could carry widths in
      the data, but they are layout, not data. So the page’s stylesheet deals the opening
      widths, and with <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed, the header
      widths govern their whole columns: the table always fills its container, and the
      columns hold still while the values change.</Says>
    <Says>And no JavaScript knows these widths at all, because we do not need to know the
      size until you touch something. The resize ledger is born at the first touch by
      measuring the headers as they stand, and the drag surveys them at the lift; a value
      that changes at runtime is state, and until then nothing has changed.</Says>
  </>,
  html: <Says>The columns are declared once, each a header cell with a name and a class; how
    wide they open is CSS. We could let the browser size the columns by their content,
    but a live table would breathe: every new number re-negotiates the layout. And we
    could carry widths in the markup, but they are layout, not content. So the page’s
    stylesheet deals the opening widths, and
    with <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed, the header widths
    govern their whole columns: the table always fills its container, and the columns
    hold still while the values change.</Says>
};

const dealCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...unit(dealSource, 'const columns = ')
    ]}/>
    <Snippet label="CSS" lines={[
      ...unit(widthsSource, '.aggregations {')
    ]}/>
    <Snippet label="HTML" lines={[
      ...span(headerSource, 'return <th', 'scope="col"'), gap,
      ...span(rowSource, 'return rowHeader', '<td className={dress} key={column} style={theater}>{cell.display}</td>;')
    ]}/>
  </Codes>,
  html: <Codes>
    <Snippet label="HTML" lines={[
      ...span(tableSource, '<thead class="header">', '</th>'), gap,
      ...span(tableSource, '<tbody class="body">', '</tr>')
    ]}/>
    <Snippet label="CSS" lines={[
      ...unit(widthsSource, '.aggregations {')
    ]}/>
  </Codes>
};

const socketOpeners: Record<World, string> = {
  react: 'One connection at page scope, so the stream survives every tab and dial below it.',
  html: 'One connection for the document’s whole life.'
};

const foldSays: Record<World, ReactNode> = {
  react: <Says>Every render folds the same trades into per-window aggregates: counts, volume,
    vwap, the change since the window opened. The fold runs over the same capped trades
    each time, so the windows are always exactly the stream’s current truth.</Says>,
  html: <Says>Every arrival refolds the same trades into per-window aggregates, because
    refolding is simple math and cannot drift out of sync. The fold is the same module the
    React world runs. What React did for you ends here: there is no render to catch the
    change, so every commit reconciles the page against the desk, writing only the cells
    whose text changed and reseating only the rows whose seat changed.</Says>
};

const foldCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...unit(foldSource, 'export const windows'), gap,
      ...unit(foldSource, 'const aggregate = ')
    ]}/>
  </Codes>,
  html: <Codes>
    <Snippet label="TS" lines={[
      ...unit(foldSource, 'export const windows'), gap,
      ...unit(frameStand, 'const reconciled = ')
    ]}/>
  </Codes>
};

const refolds: Record<World, string> = {
  react: 'Then every render refolds everything we hold into the windows, because refolding is simple math and cannot drift out of sync.',
  html: 'Then every arrival refolds everything we hold into the windows, and the page writes what changed.'
};

const stateSays: Record<World, ReactNode> = {
  react: <>
    <Says>The table’s state is a few cells beside the markup: the ordered columns, the seats,
      and the rule, each born with useState. Nothing ever edits a value in place: a change
      hands a new array or a new rule to the setter, and the old value simply stops being
      rendered.</Says>
    <Says>What follows the state is React’s half of the deal: set a cell and the component
      re-renders, the markup renders through the new value, and React reconciles the real DOM
      to match, moving only the nodes whose place changed. You never touch the DOM; you only
      decide the state.</Says>
  </>,
  html: <>
    <Says>The shell keeps the same state as one value: the desk, which holds order, seats,
      seated, shares, and the rule together, every field readonly. Nothing ever edits the desk in place: a
      change is a pure transition, a function from the old desk to a new one, and the old
      value simply stops being current.</Says>
    <Says>What React did for you is the other half: the shell holds one cell with one write
      path. commit runs your transition and reconciles the page against the new desk, moving
      only the cells whose place changed and writing only the text that differs. The seam
      between the worlds is exactly here: the state model is identical; who owns the cell and
      the reconciliation is the difference.</Says>
  </>
};

const stateCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...unit(stateSource, 'const [ordered, setOrdered]'), gap,
      ...unit(stateSource, 'const [seats, setSeats]'), gap,
      ...unit(stateSource, 'const [rule, setRule]')
    ]}/>
  </Codes>,
  html: <Codes>
    <Snippet label="TS" lines={[
      ...unit(deskSource, 'export type Desk'), gap,
      ...unit(deskSource, 'export const orderedTo'), gap,
      ...unit(deskSource, 'export const baked')
    ]}/>
    <Snippet label="TS" lines={[
      ...unit(frameStand, 'const commit = ')
    ]}/>
  </Codes>
};

const liveStory = (world: World) =>
  <Story param="living" id="live"
         can="The trader can watch the market live, in windows"
         soThat="the numbers stay current without a single refresh">
    <Tell>What the trader reads is a few measures across a few time windows: numbers
      on two axes. That is not a chart and not a feed; that is what a table is for. So
      the table comes first: a real HTML one, semantics for free, dealt from whatever
      trades we hold.</Tell>
    <Tell>Then the trades. The trader arrives mid-session, so we start with one plain fetch
      of the recent history. And the numbers have to keep themselves current: we could
      poll, but polling is always a little late and mostly wasted requests. The exchange
      offers a stream, so a socket comes next, and from then on the trades come to us,
      kept under a cap so a long session cannot grow forever. {refolds[world]}</Tell>
    <Steps>
      <Step title="Deal a real HTML table">
        <Words want={<>The table is more than JavaScript holding numbers; it is an
          HTML <Mdn path="Web/HTML/Element/table">table</Mdn>: header cells that declare their
          scope, rows a reader and a screen reader both walk.</>}>
          {dealOpeners[world]}
          <Says>The markup is the platform’s own.
            A <Mdn path="Web/HTML/Element/thead">thead</Mdn> of th headers, one per column, each
            announcing <Mdn path="Web/HTML/Element/th#scope">scope="col"</Mdn>: that one attribute
            is how a screen reader knows to say the column’s name with every cell below it.
            A <Mdn path="Web/HTML/Element/tbody">tbody</Mdn> of rows dealt from the trades we hold;
            each row leads with a th of its own,
            announcing <Mdn path="Web/HTML/Element/th#scope">scope="row"</Mdn> so the window’s name
            travels with every cell beside it, then a td per measure.</Says>
          <Says>We could build this out of divs and grid, and it would look identical. But the table
            element carries behavior we would otherwise owe: readers walk it row by row and cell by
            cell, headers belong to their columns, and everything later, the sorting announcements,
            the drags, the keyboard, hangs off these roles instead of reinventing them. This is the
            first rule of <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>: prefer the native element,
            and accessibility stops being work you add and becomes behavior you inherit.</Says>
        </Words>
        {dealCodes[world]}
      </Step>
      <Step title="Hold the state in one place">
        <Words want="A live table is state before it is pixels: something must own the order, the seats, and the rule, and the page must follow it.">
          {stateSays[world]}
        </Words>
        {stateCodes[world]}
      </Step>
      <Step title="Hydrate with one fetch">
        <Words want="An empty table at open is a lie about the market; the trader arrives mid-session, so the recent past comes first, and it is just a fetch.">
          <Says>One GET for the last thousand trades, decoded and cleaned. When the stream is
            also running, hydrated merges the two, drops whatever the stream already delivered,
            and keeps everything in time order.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(hydrateSource, 'export const recentTrades'), gap,
            ...unit(hydrateSource, 'export const hydrated')
          ]}/>
        </Codes>
      </Step>
      <Step title="Open a socket to the exchange">
        <Words want={<>The table is only worth sorting if its numbers are the market’s, now:
          a <Mdn path="Web/API/WebSocket">socket</Mdn> to the exchange, subscribed to the product,
          every trade arriving as it happens.</>}>
          <Says>{socketOpeners[world]} The
            handshake subscribes to the product,
            every <Mdn path="Web/API/WebSocket/message_event">message</Mdn> decodes into a trade
            appended under a cap so a long session never grows without bound, and
            a <Mdn path="Web/API/WebSocket/close_event">close</Mdn> marks the feed failed instead of
            pretending.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(feedSource, 'const stream = streaming('), gap,
            ...unit(feedSource, 'const appendTrade = ')
          ]}/>
        </Codes>
      </Step>
      <Step title="Fold the stream into windows">
        <Words want="Raw trades tick too fast to read; the trader reads windows: this minute, the last five, the hour, the whole session.">
          {foldSays[world]}
        </Words>
        {foldCodes[world]}
      </Step>
    </Steps>
  </Story>;

export const LivingTableRecipe: FC = () => {
  const {world = 'react'} = useSearchParamsObject({world: worldParam});
  return <section aria-label="the living table" className="build-steps">
    <Stories>{liveStory(world)}</Stories>
  </section>;
};
