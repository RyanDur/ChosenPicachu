import {FC} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import tableSource from '../Frame/table.html?raw';
import frameSource from '../Frame/shell.ts?raw';
import widthsSource from '@pages/Demos/Tables/Aggregations/Aggregations.css?raw';
import hydrateSource from '@pages/Demos/Tables/Aggregations/recent-trades.ts?raw';
import feedSource from '@pages/Demos/Charts/live-trades.ts?raw';
import foldSource from '@pages/Demos/Tables/Aggregations/fold.ts?raw';
import sortingSource from '@components/DragSortableTable/sorting.ts?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

const dealtStory =
  <Story param="dealt" id="dealt"
         can="The trader can read the market in windows"
         soThat="every measure has a seat before a single trade arrives">
    <Tell>What the trader reads is a few measures across a few time windows: numbers
      on two axes. That is not a chart and not a feed; that is what a table is for. So
      the table comes first: a real HTML one, semantics for free, written by hand.</Tell>
    <Tell>The trades come in the next card: a fetch for the recent past, a socket for the
      rest. First the table stands.</Tell>
    <Steps>
      <Step title="Deal a real HTML table">
        <Words want={<>The table is more than JavaScript holding numbers; it is an
          HTML <Mdn path="Web/HTML/Element/table">table</Mdn>: header cells that declare their
          scope, rows a reader and a screen reader both walk.</>}>
          <Says>The columns are declared once, each a header cell with a name and a class; how
            wide they open is CSS. We could let the browser size the columns by their content,
            but a live table would breathe: every new number re-negotiates the layout. And we
            could carry widths in the markup, but they are layout, not content. So the page’s
            stylesheet deals the opening widths, and
            with <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed, the header widths
            govern their whole columns: the table always fills its container, and the columns
            hold still while the values change.</Says>
          <Says>The markup is the platform’s own.
            A <Mdn path="Web/HTML/Element/thead">thead</Mdn> of th headers, one per column, each
            announcing <Mdn path="Web/HTML/Element/th#scope">scope="col"</Mdn>: that one attribute
            is how a screen reader knows to say the column’s name with every cell below it.
            A <Mdn path="Web/HTML/Element/tbody">tbody</Mdn> of rows; each row leads with a th of
            its own, announcing <Mdn path="Web/HTML/Element/th#scope">scope="row"</Mdn> so the
            window’s name travels with every cell beside it, then a td per measure.</Says>
          <Says>We could build this out of divs and grid, and it would look identical. But the table
            element carries behavior we would otherwise owe: readers walk it row by row and cell by
            cell, headers belong to their columns, and everything later, the sorting announcements,
            the drags, the keyboard, hangs off these roles instead of reinventing them. This is the
            first rule of <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>: prefer the native element,
            and accessibility stops being work you add and becomes behavior you inherit.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(tableSource, '<thead class="header">', '</th>'), gap,
            ...span(tableSource, '<tbody class="body">', '</tr>')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(widthsSource, '.aggregations {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const liveStory =
  <Story param="living" id="living"
         can="The trader can watch the market live, in windows"
         soThat="the numbers stay current without a single refresh">
    <Tell>The trader arrives mid-session, so the recent past comes first: one plain fetch.
      And the numbers have to keep themselves current: we could poll, but polling is always
      a little late and mostly wasted requests. The exchange offers a stream, so a socket
      comes next, and from then on the trades come to us, kept under a cap so a long session
      cannot grow forever.</Tell>
    <Tell>These modules are the same ones the React world runs; nothing about fetching,
      streaming, or folding cares who renders. What this world writes by hand is the last
      step: when the numbers change, you walk the cells and write them.</Tell>
    <Steps>
      <Step title="Hydrate with one fetch">
        <Words want="An empty table at open is a lie about the market; the trader arrives mid-session, so the recent past comes first, and it is just a fetch.">
          <Says>One GET for the last thousand trades, decoded and cleaned. When the stream is
            also running, hydrated merges the two, drops whatever the stream already delivered,
            and keeps everything in time order. This is the same module the React table calls;
            here the page subscribes with a plain function and repaints when the history
            lands.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(hydrateSource, 'export const recentTrades'), gap,
            ...unit(hydrateSource, 'export const hydrated'), gap,
            ...unit(frameSource, 'if (env.tradeHistory) {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Open a socket to the exchange">
        <Words want={<>The table is only worth sorting if its numbers are the market’s, now:
          a <Mdn path="Web/API/WebSocket">socket</Mdn> to the exchange, subscribed to the product,
          every trade arriving as it happens.</>}>
          <Says>One connection for the document’s whole life. The handshake subscribes to the
            product, every <Mdn path="Web/API/WebSocket/message_event">message</Mdn> decodes
            into a trade appended under a cap, and
            a <Mdn path="Web/API/WebSocket/close_event">close</Mdn> marks the feed failed instead
            of pretending. The chain is the same live-trades module the React world subscribes;
            the shell hands it two callbacks, and the trouble one stays empty: this world has no
            banner to raise yet.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(feedSource, 'const stream = streaming('), gap,
            ...unit(feedSource, 'const appendTrade = '), gap,
            ...unit(frameSource, 'if (env.tradeFeed) {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Fold the stream into windows">
        <Words want="Raw trades tick too fast to read; the trader reads windows: this minute, the last five, the hour, the whole session.">
          <Says>Every arrival refolds everything we hold into the windows, because refolding is
            simple math and cannot drift out of sync. The fold is the same module as ever. What
            React did for you ends here: there is no render to catch the change, so paint walks
            the rows and writes each cell’s text, then seats the rows by whatever rule
            stands.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(foldSource, 'export const windows'), gap,
            ...unit(frameSource, 'const paint = ')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const sortStory =
  <Story param="ranked" id="ranked"
         can="The trader can sort by any measure"
         soThat="what matters most reads from the top">
    <Tell>Sorting is a menu on each measure: ascending, descending, or as dealt. We could
      re-sort the data and rebuild the tbody, but the rows already stand in the document;
      ranking is just deciding their order and letting the platform move them. So the sort
      is one shared function that returns an order, and the shell appends the rows in that
      order; appending an element that is already in the document moves it.</Tell>
    <Steps>
      <Step title="Hang a menu on every measure">
        <Words want="Each measure needs its three choices without stealing space from the numbers: a popover menu on the header, anchored to its toggle.">
          <Says>The markup is the same dress the React menu wears: a button
            with <Mdn path="Web/HTML/Element/button#popovertarget">popovertarget</Mdn>, a menu
            with <Mdn path="Web/API/Popover_API">popover</Mdn>, three items. The platform owns
            the opening, the light dismiss, and the top layer; no JavaScript in sight yet.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(tableSource, '<button type="button" class="menu-toggle rounded-corners"', '</menu>')
          ]}/>
        </Codes>
      </Step>
      <Step title="Rank with the shared rule">
        <Words want="When the trader picks a direction, the rows must stand in that order, and keep standing in it as new numbers land.">
          <Says>ranked is the same module the React table sorts with: given rows, their birth
            order, and a rule, it returns the standing order. The shell listens on the three
            items, builds the rule, and seats the rows; every paint re-ranks, so a fresh trade
            cannot break the order the trader chose.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(sortingSource, 'export const ranked'), gap,
            ...unit(frameSource, 'const wireMenu = '), gap,
            ...unit(frameSource, 'const choose = ')
          ]}/>
        </Codes>
      </Step>
      <Step title="Announce the rule">
        <Words want="A sorted column must say so, to the eye and to assistive tech, without a second source of truth appearing anywhere.">
          <Says>The glyph and <Mdn path="Web/Accessibility/ARIA/Attributes/aria-sort">aria-sort</Mdn> both
            derive from the one rule: the sorted column wears its direction’s arrow and announces
            aria-sort; every other column returns to rest. Derive, never store, and the header
            cannot lie.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(frameSource, 'const announce = ')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

export const HtmlTableRecipe: FC = () =>
  <section aria-label="the dealt table" className="build-steps">
    <Stories>{dealtStory}{liveStory}{sortStory}</Stories>
  </section>;
