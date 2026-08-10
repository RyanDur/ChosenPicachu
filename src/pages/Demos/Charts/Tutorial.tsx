import {FC} from 'react';
import {StoryEntry} from '../Recipe/StepList';
import {Mdn, StoryList, aside, plain} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import shapesSource from './Candles/shapes.ts?raw';
import sparklineSource from './sparkline.ts?raw';
import periodSource from './period.ts?raw';
import candlesHook from './usePeriodCandles.ts?raw';
import priceSource from './PriceChart/index.tsx?raw';
import candlesSource from './Candles/index.tsx?raw';
import candlesCss from './Candles/Candles.css?raw';
import pressureSource from './Pressure/shapes.ts?raw';
import pressureComponent from './Pressure/index.tsx?raw';
import pressureCss from './Pressure/Pressure.css?raw';
import moneySource from './money.ts?raw';
import slotsSource from './slots.ts?raw';
import coinbaseSource from './coinbase/index.ts?raw';
import historySource from './coinbase/history.ts?raw';
import liveTradesSource from './useLiveTrades.ts?raw';
import axesSource from './Axes/index.tsx?raw';
import pageSource from '../component.tsx?raw';
import crossingSource from '../DragAndDrop/crossing.ts?raw';
import pageCss from '../DemosPage.css?raw';
import '../Recipe/Recipe.css';

const gap = plain(' ');

export const ChartsTutorial: FC = () =>
  <section className="tutorials">
    <h2 className="tutorials-title">let’s build this feature</h2>
    <p className="overview">
      We are going to build this site’s live charts, feature by feature. Here is how to use
      this page: every card below is a feature, told as a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>. Open a card and you get the plan for that feature and
      the steps that build it, with the real code from this site, so what you read is what
      runs. Each chart above is a doorway too: click it, or press enter on it, and that
      chart’s own tutorial opens. The dashed code is the wrong way you would probably try
      first, and the links go to MDN if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote">
        Numbers tell me where the price is; I need to see where it has been to feel where it
        is going. One glance, the shape of the session. And I arrange my own desk: the charts
        I watch, in the order I watch them.
      </blockquote>
      <figcaption className="attribution">a trader</figcaption>
    </figure>
    <p className="overview">
      If you want the exercise, stop here and build the story yourself first. The charts are
      our interpretation of that; the cards below break the interpretation into features.
      Open one to see how we built it, or to compare it with yours.
    </p>
    <section aria-label="build the charts yourself" className="build-steps">
      <StoryList param="graph" stories={[workspaceStory]}/>
    </section>
  </section>;

export const priceStory: StoryEntry = {id: 'price',
          can: 'The trader can watch the price move, live',
          soThat: 'the session reads at a glance',
          tells: ['We could reach for a chart library, but the promise is one line and two ' +
            'axes; so the line is an SVG polyline whose points are arithmetic over the ' +
            'trades we already hold, and everything the card shows derives fresh on every ' +
            'render.',
            'The stream writes faster than an eye reads; so the trades bucket into windows, ' +
            'one candle per window. History hydrates the left of the line, the live feed ' +
            'writes the right, and the merge keeps a single truth in time order.'],
          steps: [
            {title: 'Open the stream',
              want: 'A live chart starts with a conversation: the exchange speaks in frames, and every frame is a stranger until it proves otherwise.',
              says: [<>The browser opens
                a <Mdn path="Web/API/WebSocket">WebSocket</Mdn> and asks for one product’s
                matches. Every frame then runs a gauntlet: parse, a strict decoder that
                names exactly the shape a match may take, and number conversions that
                refuse NaN. What survives is a Trade; what does not never reaches state.
                And the page keeps only the newest 1500, because the stream never ends and
                the page must not grow with it.</>],
              code: [
                {label: 'JS', foil: true, lines: [
                  plain("socket.addEventListener('message', event =>"),
                  plain('    setTrades([...trades, JSON.parse(event.data)]));'),
                  aside('// every malformed frame is now state, forever')
                ]},
                {label: 'JS', lines: [
                  ...unit(coinbaseSource, 'export const subscribeTo'), gap,
                  ...unit(coinbaseSource, 'export const decodeTrade'), gap,
                  ...unit(liveTradesSource, 'const LATEST_TRADES_CAP'), gap,
                  ...unit(liveTradesSource, 'const appendTrade')
                ]}
              ]},
            {title: 'Hydrate the past',
              want: 'The trader arrives mid-session; the left of the chart existed before they did.',
              says: [<>The exchange also answers
                over <Mdn path="Web/API/Fetch_API">HTTP</Mdn>: recent candles at the
                period’s granularity, decoded with the same suspicion. mergeLive stitches
                the two truths into one: history where the stream has not spoken, the
                stream everywhere it has, capped to what the card can hold.</>],
              code: [
                {label: 'JS', lines: [
                  ...unit(historySource, 'export const periodCandles'), gap,
                  ...unit(candlesHook, 'export const usePeriodCandles'), gap,
                  ...unit(shapesSource, 'export const mergeLive')
                ]}
              ]},
            {title: 'Bucket the stream into candles',
              want: 'Raw trades tick too fast to draw; the line needs one point per window.',
              says: ['bucketTrades folds the live trades into one candle per window: the ' +
                'first price opens it, every trade stretches its reach, and the last one ' +
                'closes it. One candle per window is one point per window, which is all a ' +
                'line needs.'],
              code: [
                {label: 'JS', lines: [
                  ...unit(shapesSource, 'const fold'), gap,
                  ...unit(shapesSource, 'export const bucketTrades')
                ]}
              ]},
            {title: 'Choose the window',
              want: 'A minute of scalping and a session of context are different questions; the trader picks the window, and every measure follows it.',
              says: [<>The period menu rides the card, the same
                native <Mdn path="Web/API/Popover_API">popover</Mdn> chooser the tables
                taught. Each period carries its own bucket size, its cap on how many candles
                a card holds, and how often the time axis speaks; choosing one refetches
                history at that granularity.</>],
              code: [
                {label: 'JS', lines: [
                  ...unit(periodSource, 'export const bucketMs'), gap,
                  ...unit(periodSource, 'export const periodCap')
                ]},
                {label: 'HTML', lines: [
                  ...span(priceSource, '{actions}', '</Menu>')
                ]}
              ]},
            {title: 'Draw the line from arithmetic',
              want: 'The price line must stay smooth while the stream writes, on slow machines too.',
              code: [
                {label: 'JS', foil: true, lines: [
                  plain("import {LineChart} from 'a-chart-library';"),
                  plain('<LineChart data={trades} live smooth/>'),
                  aside('// one line and two axes do not need a dependency')
                ]},
                {label: 'JS', lines: [
                  ...unit(sparklineSource, 'export const sparklinePoints')
                ]},
                {label: 'HTML', lines: [
                  ...span(priceSource, '<svg className="sparkline"', '</svg>')
                ]}
              ],
              says: [<>Every candle becomes a point by proportion: time across the width,
                price down the height. The result feeds one
                SVG <Mdn path="Web/SVG/Element/polyline">polyline</Mdn>; a new trade means new
                points and React paints the new line, nothing is measured and nothing
                animates, which is what keeps a busy stream smooth.</>]},
            {title: 'Let the axes speak',
              want: 'A naked line is a shape, not a chart; the trader needs the high, the low, and the hour under it.',
              says: ['Axes wraps any chart body: the high and low label the vertical reach, ' +
                'and time ticks land every tickEveryMs, patterned per period, so an hour ' +
                'chart speaks minutes and a session chart speaks hours.'],
              code: [
                {label: 'JS', lines: [
                  ...unit(axesSource, 'export const Axes')
                ]}
              ]}
          ]};

export const candlesStory: StoryEntry = {id: 'candles',
          can: 'The trader can read the same trades as candles',
          soThat: 'each window answers open, close, reach, and volume',
          tells: ['A line answers where the price went; a candle answers what each window ' +
            'did: where it opened and closed, how far it reached, and how much traded. The ' +
            'same buckets feed both cards; no new state exists, only new shapes.',
            'No new data exists for it either: the page owns one stream and one history, ' +
            'and every card reads them, so two charts can never tell two stories.'],
          steps: [
            {title: 'Born from the same buckets',
              want: 'A second chart must not mean a second truth; two cards reading the same market have to agree, frame for frame.',
              says: [<>The page owns one stream and hands every card the same trades; this
                card buckets them with the very fold the price line used,
                and mergeLive stitches the same history underneath. The line only ever read
                a corner of each candle; this card finally reads all of it. The period menu
                rides this card too, the
                same <Mdn path="Web/API/Popover_API">popover</Mdn> chooser.</>],
              code: [
                {label: 'JS', foil: true, lines: [
                  plain("const candles = await fetch('/candles?for=the-new-card');"),
                  aside('// two fetches, two clocks, one screen disagreeing with itself')
                ]},
                {label: 'JS', lines: [
                  ...unit(shapesSource, 'const fold'), gap,
                  ...unit(shapesSource, 'export const bucketTrades'), gap,
                  ...unit(shapesSource, 'export const mergeLive')
                ]}
              ]},
            {title: 'Shape each window’s candle',
              want: 'Open, high, low, close: four numbers per window, one honest glyph.',
              says: ['candleShapes turns each candle into a body and a wick by the same ' +
                'proportions the sparkline used; rising and falling wear their own class, ' +
                'and CSS owns the colors.'],
              code: [
                {label: 'JS', lines: [
                  ...unit(slotsSource, 'export const windowSlots'), gap,
                  ...unit(shapesSource, 'export const candleShapes')
                ]},
                {label: 'HTML', lines: [
                  ...span(candlesSource, '<svg className="candlesticks"', '</svg>')
                ]},
                {label: 'CSS', lines: [
                  ...unit(candlesCss, '.wick {'), gap,
                  ...unit(candlesCss, '.up .body {'), gap,
                  ...unit(candlesCss, '.down .body {')
                ]}
              ]},
            {title: 'Bar the traded volume beneath',
              want: 'A price move on no volume and one on heavy volume are different stories; the trader reads both at once.',
              says: ['volumeShapes bars each window’s traded size under the candles, scaled ' +
                'to the busiest window on screen, drawn in the same SVG pass.'],
              code: [
                {label: 'JS', lines: [
                  ...unit(shapesSource, 'export const volumeShapes')
                ]},
                {label: 'HTML', lines: [
                  ...span(candlesSource, '<svg className="volumes"', '</svg>')
                ]},
                {label: 'CSS', lines: [
                  ...unit(candlesCss, '.volume {')
                ]}
              ]},
            {title: 'The axes come free',
              want: 'A cluster of candles is a shape, not a chart; it needs its reach labelled and its hours ticked.',
              says: ['The same Axes wraps this card: the high and the low come from the ' +
                'candles’ own reach, and the time ticks pattern themselves per period. A ' +
                'component that owns one job serves every chart that has that job.'],
              code: [
                {label: 'HTML', lines: [
                  ...span(candlesSource, '<Axes high', 'headroomMs={2 * bucketMs[period]}>')
                ]}
              ]}
          ]};

export const pressureStory: StoryEntry = {id: 'pressure',
          can: 'The trader can see who is driving the move',
          soThat: 'a push and a retreat stop looking alike',
          tells: ['We could infer the driver from the direction of the price, but a rise on ' +
            'heavy buying and a rise on sellers stepping away draw the same line; so the ' +
            'card reads each match’s side, a fact the stream already carries, and folds ' +
            'every minute into bought size and sold size.',
            'History’s candles never say who started a trade; so the card counts only the ' +
            'session it watches, and says so. The heaviest side sets one scale for both ' +
            'directions, which keeps the taller side an honest answer.'],
          steps: [
            {title: 'Split each window by side',
              want: 'Volume alone says how much traded, never who pushed; the split has to survive the bucketing.',
              says: ['Every match names its taker’s side, and the decoder makes that a ' +
                'fact: a frame whose side is not buy or sell never becomes a Trade. The ' +
                'fold mirrors the candles’ bucketing, but keeps two sums per window: ' +
                'bought size and sold size.'],
              code: [
                {label: 'JS', foil: true, lines: [
                  plain("const driver = candle.close > candle.open ? 'buying' : 'selling';"),
                  aside('// sellers stepping away wears the same badge as a stampede')
                ]},
                {label: 'JS', lines: [
                  ...unit(coinbaseSource, 'const MatchDecoder'), gap,
                  ...unit(pressureSource, 'const fold'), gap,
                  ...unit(pressureSource, 'export const bucketPressure')
                ]}
              ]},
            {title: 'One scale, both directions',
              want: 'Comparing the sides only works if both wear the same ruler; a taller bar must mean more size, nothing else.',
              says: ['The heaviest single side sets the scale. Bought rises from the ' +
                'midline, sold falls from it, and a window that bought four and sold two ' +
                'shows bars in exactly that proportion.'],
              code: [
                {label: 'JS', lines: [
                  ...unit(slotsSource, 'export const windowSlots'), gap,
                  ...unit(pressureSource, 'export const heaviestSide'), gap,
                  ...unit(pressureSource, 'export const pressureShapes')
                ]}
              ]},
            {title: 'Bars around a midline',
              want: 'The eye should read dominance at a glance, and the axes must speak size, not dollars.',
              says: ['Two rects per window around a hairline midline, wearing the colors ' +
                'the candles taught: mint above, orange below. Axes learned a second ' +
                'tongue for it: a label prop formats the reach in bitcoin instead of ' +
                'dollars, and the caption claims only what the card can honestly claim: ' +
                'the session it watched.'],
              code: [
                {label: 'HTML', lines: [
                  ...span(pressureComponent, '<svg className="pressures"', '</svg>')
                ]},
                {label: 'CSS', lines: [
                  ...unit(pressureCss, '.midline {'), gap,
                  ...unit(pressureCss, '.bought {'), gap,
                  ...unit(pressureCss, '.sold {')
                ]},
                {label: 'JS', lines: [
                  ...unit(moneySource, 'export const bitcoin')
                ]}
              ]}
          ]};

const workspaceStory: StoryEntry = {id: 'workspace',
          can: 'The trader can lay out the workspace',
          soThat: 'the charts they watch sit where they put them',
          tells: ['One chart is dealt on arrival, and the workspace is the URL: add, sort, ' +
            'remove, refresh, share, and the layout survives all of it, because the address ' +
            'is the state.',
            'Sorting rides a native drag from a grip that only shows itself to a hover. The ' +
            'origin whispers in its seat, the displaced chart slides home on a keyframe, ' +
            'and the swap fires when the hand strays a third of the seat’s height from ' +
            'where it settled, the same distance up as down; every swap re-anchors to the ' +
            'hand, so reversing always costs a fresh third.',
            'The keyboard needs no grip: the card itself is the widget. Arrows walk it and ' +
            'focus rides along, delete removes it, and a lone chart offers neither grip nor ' +
            'remove, because a workspace cannot lose its last window.'],
          steps: [
            {title: 'Deal the workspace from the address',
              want: 'The layout is the trader’s, so it must survive a refresh and travel in a link.',
              says: ['The charts param is a comma list of kinds; absent, the trader starts ' +
                'with one price chart. Adding prepends, so the newest chart lands under the ' +
                'hand, and the plus rides the heading with its menu anchored above it.'],
              code: [
                {label: 'JS', lines: [
                  ...unit(pageSource, 'const isChartKind'), gap,
                  ...unit(pageSource, 'const dealtCharts'), gap,
                  ...unit(pageSource, 'const addChart')
                ]},
                {label: 'HTML', lines: [
                  ...span(pageSource, '<Menu id="add-chart"', '</Menu>')
                ]}
              ]},
            {title: 'Sort by a third’s stray',
              want: 'The card is huge and the hand holds only its grip; the swap has to key on the hand, not the card’s far edge.',
              says: ['The drag anchors where the hand grabbed the seat. A swap fires when ' +
                'the hand strays a third of the seat’s height from that anchor, either ' +
                'direction, and the anchor re-derives at each swap from where the seat ' +
                'lands under the hand: hysteresis by bookkeeping, so mixed chart heights ' +
                'cannot jitter.'],
              code: [
                {label: 'JS', foil: true, lines: [
                  plain('if (event.clientY > neighbour.top) swap();'),
                  aside('// the hand holds the grip; the card is long past it')
                ]},
                {label: 'JS', lines: [
                  ...unit(crossingSource, 'export const strayed'), gap,
                  ...span(pageSource, 'const anchor = seat.top + aloftLead;', 'setAloftChart(to);')
                ]},
                {label: 'CSS', lines: [
                  ...unit(pageCss, '@keyframes chart-pushed')
                ]}
              ]},
            {title: 'The card answers keys',
              want: 'The grip and the remove only show to a hover; the keyboard speaks to the card itself.',
              says: ['Focus the card: arrows walk it seat by seat and focus rides along, so ' +
                'a held arrow keeps moving the same chart. Delete removes it, guarded like ' +
                'everything else by the last-chart rule.'],
              code: [
                {label: 'JS', lines: [
                  ...unit(pageSource, 'const chartKeys')
                ]}
              ]},
            {title: 'Never the last',
              want: 'An empty workspace shows nothing and teaches nothing; the last chart holds its post.',
              says: ['The grip and the remove are dealt only while more than one chart ' +
                'stands. With one left, hover finds nothing, delete falls silent, and only ' +
                'the plus remains.'],
              code: [
                {label: 'JS', lines: [
                  ...unit(pageSource, 'const dismissal'), gap,
                  ...unit(pageSource, 'const grip')
                ]}
              ]}
          ]};
