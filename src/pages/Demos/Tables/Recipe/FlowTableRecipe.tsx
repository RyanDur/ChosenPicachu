import {FC, ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, lines, carve} from '../../Recipe';
import {useControls} from '../../Controls';
import type {World} from '../../Controls';
import {StoreStory} from './StoreRecipe';
import exchangeSource from '@pages/Demos/Market/exchange.ts?sample';
import marketSliceSource from '@pages/Demos/Market/marketSlice.ts?sample';
import foldSource from '@pages/Demos/Market/fold.ts?sample';
import buildSrc from '../Frame/builds/Eager.ts?sample';
import frameRows from '../Frame/table/rows.ts?sample';
import hydrateSource from '@pages/Demos/Market/recent-trades.ts?sample';
import {DataPath} from './DataPath';
import '../../Recipe/Recipe.css';
import {Term} from './Term';

const gap = lines.plain(' ');

const socketPlans: Record<World, string> = {
  react: 'One connection at page scope, so the stream survives every tab and dial below it.',
  vanilla: 'One connection for the document’s whole life.'
};

const foldSays: Record<World, ReactNode> = {
  react: <Says>Every render folds the same trades into per-window aggregates: counts, volume,
    vwap, the change since the window opened. The fold runs over the same capped trades
    each time, so the windows always match the trades the page holds.</Says>,
  vanilla: <Says>Every arrival refolds the same trades into per-window aggregates. The fold is the same module the
    React world runs. What React did for you ends here: there is no render to catch the change, so the page refolds the
    trades and calls <code className="monospaced">reconcile</code>, which writes only the cells whose text changed and
    reseats the rows when the sort ranks them anew. The arrangement is the page’s, and that is the store story.</Says>
};

const foldCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...carve.unit(foldSource, 'export const windows'), gap,
      ...carve.unit(foldSource, 'const aggregate = ')
    ]}/>
  </Codes>,
  vanilla: <Codes>
    <Snippet label="TS" lines={[
      ...carve.unit(foldSource, 'export const windows'), gap,
      ...carve.unit(buildSrc, 'const reconciled = '), gap,
      ...carve.unit(frameRows, 'export const writeCells = ')
    ]}/>
  </Codes>
};

const refolds: Record<World, string> = {
  react: 'Then every render refolds every trade the page holds into the windows, because refolding is simple math and cannot drift out of sync.',
  vanilla: 'Then every arrival refolds every trade the page holds into the windows, and the page calls reconcile, which writes what changed.'
};

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
            also running, the function <Term word="hydrate">hydrated</Term> merges the two, drops whatever the stream
            already delivered, and keeps everything in time order.</Says>
          <Codes>
            <Snippet label="TS" lines={[
              ...carve.unit(hydrateSource, 'export const recentTrades'), gap,
              ...carve.unit(hydrateSource, 'export const hydrated')
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
            Every <Mdn path="Web/API/WebSocket/message_event">message</Mdn> decodes into a trade, appended under a cap
            so a long session never grows without bound. A <Mdn path="Web/API/WebSocket/close_event">close</Mdn> marks
            the feed failed.</Says>
          <Codes>
            <Snippet label="TS" lines={[
              ...carve.unit(exchangeSource, 'const stream = streaming('), gap,
              ...carve.unit(marketSliceSource, 'const tradesReducer')
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

export const FlowTableRecipe: FC = () => {
  const {world} = useControls();
  return <section aria-label="the living table" className="build-steps">
    <Stories><FlowStory world={world}/><StoreStory world={world}/></Stories>
  </section>;
};
