import {FC} from 'react';
import {Mdn, StepEntry, StoryList, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import feedSource from '@pages/Demos/Charts/useLiveTrades.ts?raw';
import foldSource from '@pages/Demos/Tables/Aggregations/fold.ts?raw';
import dealSource from '@pages/Demos/Tables/Aggregations/index.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerHideAnimatedTable/Header.tsx?raw';
import rowSource from '@components/DragSortableTable/EagerHideAnimatedTable/Row.tsx?raw';
import hydrateSource from '@pages/Demos/Tables/Aggregations/useRecentTrades.ts?raw';
import widthsSource from '@pages/Demos/Tables/Aggregations/Aggregations.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

const living: StepEntry[] = [
  {
    title: 'Deal a real HTML table',
    want: <>The table is more than JavaScript holding numbers; it is an
      HTML <Mdn path="Web/HTML/Element/table">table</Mdn>: header cells that declare their
      scope, rows a reader and a screen reader both walk.</>,
    says: [<>The columns are declared once, each with a name and a class; how wide they open
      is CSS. We could let the browser size the columns by their content, but a live table
      would breathe: every new number re-negotiates the layout. And we could carry widths in
      the data, but they are layout, not data. So the page’s stylesheet deals the opening
      widths, and with <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed, the header
      widths govern their whole columns: the table always fills its container, and the
      columns hold still while the values change.</>,
      <>And no JavaScript knows these widths at all, because we do not need to know the
      size until you touch something. The resize ledger is born at the first touch by
      measuring the headers as they stand, and the drag surveys them at the lift; a value
      that changes at runtime is state, and until then nothing has changed.</>,
      <>The markup is the platform’s own.
      A <Mdn path="Web/HTML/Element/thead">thead</Mdn> of th headers, one per column, each
      announcing <Mdn path="Web/HTML/Element/th#scope">scope="col"</Mdn>: that one attribute
      is how a screen reader knows to say the column’s name with every cell below it.
      A <Mdn path="Web/HTML/Element/tbody">tbody</Mdn> of rows dealt from the trades we hold;
      each row leads with a th of its own,
      announcing <Mdn path="Web/HTML/Element/th#scope">scope="row"</Mdn> so the window’s name
      travels with every cell beside it, then a td per measure.</>,
      <>We could build this out of divs and grid, and it would look identical. But the table
      element carries behavior we would otherwise owe: readers walk it row by row and cell by
      cell, headers belong to their columns, and everything later, the sorting announcements,
      the drags, the keyboard, hangs off these roles instead of reinventing them. This is the
      first rule of <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>: prefer the native element,
      and accessibility stops being work you add and becomes behavior you inherit.</>],
    code: [
      {label: 'JS', lines: [
        ...unit(dealSource, 'const columns = ')
      ]},
      {label: 'CSS', lines: [
        ...unit(widthsSource, '.aggregations {')
      ]},
      {label: 'HTML', lines: [
        ...span(headerSource, 'return <th', 'scope="col"'), gap,
        ...span(rowSource, 'return rowHeader', '<td className={dress} key={column} style={theater}>{cell.display}</td>;')
      ]}
    ]
  },
  {
    title: 'Hydrate with one fetch',
    want: 'An empty table at open is a lie about the market; the trader arrives mid-session, so the recent past comes first, and it is just a fetch.',
    says: ['One GET for the last thousand trades, decoded and cleaned. When the stream is ' +
      'also running, hydrated merges the two, drops whatever the stream already delivered, ' +
      'and keeps everything in time order.'],
    code: [
      {label: 'JS', lines: [
        ...unit(hydrateSource, 'export const useRecentTrades'), gap,
        ...unit(hydrateSource, 'export const hydrated')
      ]}
    ]
  },
  {
    title: 'Open a socket to the exchange',
    want: <>The table is only worth sorting if its numbers are the market’s, now:
      a <Mdn path="Web/API/WebSocket">socket</Mdn> to the exchange, subscribed to the product,
      every trade arriving as it happens.</>,
    says: [<>One connection at page scope, so the stream survives every tab and dial below it.
      The handshake subscribes to the product,
      every <Mdn path="Web/API/WebSocket/message_event">message</Mdn> decodes into a trade
      appended under a cap so a long session never grows without bound, and
      a <Mdn path="Web/API/WebSocket/close_event">close</Mdn> marks the feed failed instead of
      pretending.</>],
    code: [
      {label: 'JS', lines: [
        ...unit(feedSource, 'const beginStreaming = '), gap,
        ...unit(feedSource, 'const appendTrade = ')
      ]}
    ]
  },
  {
    title: 'Fold the stream into windows',
    want: 'Raw trades tick too fast to read; the trader reads windows: this minute, the last five, the hour, the whole session.',
    says: ['Every render folds the same trades into per-window aggregates: counts, volume, ' +
      'vwap, the change since the window opened. The fold runs over the same capped trades ' +
      'each time, so the windows are always exactly the stream’s current truth.'],
    code: [
      {label: 'JS', lines: [
        ...unit(foldSource, 'export const windows'), gap,
        ...unit(foldSource, 'const aggregate = ')
      ]}
    ]
  }
];

export const LivingTable: FC = () =>
  <section aria-label="the living table" className="build-steps">
    <StoryList param="living" stories={[{
      can: 'The trader can watch the market live, in windows',
      soThat: 'the numbers stay current without a single refresh',
      tells: ['What the trader reads is a few measures across a few time windows: numbers ' +
        'on two axes. That is not a chart and not a feed; that is what a table is for. So ' +
        'the table comes first: a real HTML one, semantics for free, dealt from whatever ' +
        'trades we hold.',
        'Then the trades. The trader arrives mid-session, so we start with one plain fetch ' +
        'of the recent history. And the numbers have to keep themselves current: we could ' +
        'poll, but polling is always a little late and mostly wasted requests. The exchange ' +
        'offers a stream, so a socket comes next, and from then on the trades come to us, ' +
        'kept under a cap so a long session cannot grow forever. Then every render refolds ' +
        'everything we hold into the windows, because refolding is simple math and cannot ' +
        'drift out of sync.'],
      steps: living
    }]}/>
  </section>;
