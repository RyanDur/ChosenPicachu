import {FC, ReactNode} from 'react';
import {ChartKind} from './kinds';
import {Codes, Mdn, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, aside, plain} from '../Recipe';
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
import pieSource from './Pie/shapes.ts?raw';
import pieComponent from './Pie/index.tsx?raw';
import pieCss from './Pie/Pie.css?raw';
import moneySource from './money.ts?raw';
import slotsSource from './slots.ts?raw';
import coinbaseSource from './coinbase/index.ts?raw';
import historySource from './coinbase/history.ts?raw';
import liveTradesSource from './useLiveTrades.ts?raw';
import axesSource from './Axes/index.tsx?raw';
import workspaceSource from './Workspace.tsx?raw';
import travelSource from './useChartTravel.ts?raw';
import deskSource from './desk.ts?raw';
import kindsSource from './kinds.ts?raw';
import crossingSource from '../DragAndDrop/crossing.ts?raw';
import workspaceCss from './Workspace.css?raw';
import '../Recipe/Recipe.css';

const gap = plain(' ');

const priceStory =
  <Story param="graph" id="price"
         can="The trader can watch the price move, live"
         soThat="the session reads at a glance">
    <Tell>We could reach for a chart library, but the promise is one line and two axes; so
      the line is an SVG polyline whose points are arithmetic over the trades we already
      hold, and everything the card shows derives fresh on every render.</Tell>
    <Tell>The stream writes faster than an eye reads; so the trades bucket into windows,
      one candle per window. History hydrates the left of the line, the live feed writes
      the right, and the merge keeps a single truth in time order.</Tell>
    <Steps>
      <Step title="Open the stream">
        <Words want="A live chart starts with a conversation: the exchange speaks in frames, and every frame is a stranger until it proves otherwise.">
          <Says>The browser opens
            a <Mdn path="Web/API/WebSocket">WebSocket</Mdn> and asks for one product’s
            matches. Every frame then runs a gauntlet: parse, a strict decoder that
            names exactly the shape a match may take, and number conversions that
            refuse NaN. What survives is a Trade; what does not never reaches state.
            And the page keeps only the newest 1500, because the stream never ends and
            the page must not grow with it.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain("socket.addEventListener('message', event =>"),
            plain('    setTrades([...trades, JSON.parse(event.data)]));'),
            aside('// every malformed frame is now state, forever')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(coinbaseSource, 'export const subscribeTo'), gap,
            ...unit(coinbaseSource, 'export const decodeTrade'), gap,
            ...unit(liveTradesSource, 'const LATEST_TRADES_CAP'), gap,
            ...unit(liveTradesSource, 'const appendTrade')
          ]}/>
        </Codes>
      </Step>
      <Step title="Hydrate the past">
        <Words want="The trader arrives mid-session; the left of the chart existed before they did.">
          <Says>The exchange also answers
            over <Mdn path="Web/API/Fetch_API">HTTP</Mdn>: recent candles at the
            period’s granularity, decoded with the same suspicion. mergeLive stitches
            the two truths into one: history where the stream has not spoken, the
            stream everywhere it has, capped to what the card can hold.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(historySource, 'export const periodCandles'), gap,
            ...unit(candlesHook, 'export const usePeriodCandles'), gap,
            ...unit(shapesSource, 'export const mergeLive')
          ]}/>
        </Codes>
      </Step>
      <Step title="Bucket the stream into candles">
        <Words want="Raw trades tick too fast to draw; the line needs one point per window.">
          <Says>bucketTrades folds the live trades into one candle per window: the first
            price opens it, every trade stretches its reach, and the last one closes it.
            One candle per window is one point per window, which is all a line
            needs.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(shapesSource, 'const fold'), gap,
            ...unit(shapesSource, 'export const bucketTrades')
          ]}/>
        </Codes>
      </Step>
      <Step title="Choose the window">
        <Words want="A minute of scalping and a session of context are different questions; the trader picks the window, and every measure follows it.">
          <Says>The period menu rides the card, the same
            native <Mdn path="Web/API/Popover_API">popover</Mdn> chooser the tables
            taught. Each period carries its own bucket size, its cap on how many candles
            a card holds, and how often the time axis speaks; choosing one refetches
            history at that granularity.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(periodSource, 'export const bucketMs'), gap,
            ...unit(periodSource, 'export const periodCap')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(priceSource, '{actions}', '</Menu>')
          ]}/>
        </Codes>
      </Step>
      <Step title="Draw the line from arithmetic">
        <Words want="The price line must stay smooth while the stream writes, on slow machines too.">
          <Says>Every candle becomes a point by proportion: time across the width,
            price down the height. The result feeds one
            SVG <Mdn path="Web/SVG/Element/polyline">polyline</Mdn>; a new trade means new
            points and React paints the new line, nothing is measured and nothing
            animates, which is what keeps a busy stream smooth.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain("import {LineChart} from 'a-chart-library';"),
            plain('<LineChart data={trades} live smooth/>'),
            aside('// one line and two axes do not need a dependency')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(sparklineSource, 'export const sparklinePoints')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(priceSource, '<svg className="sparkline"', '</svg>')
          ]}/>
        </Codes>
      </Step>
      <Step title="Let the axes speak">
        <Words want="A naked line is a shape, not a chart; the trader needs the high, the low, and the hour under it.">
          <Says>Axes wraps any chart body: the high and low label the vertical reach,
            and time ticks land every tickEveryMs, patterned per period, so an hour
            chart speaks minutes and a session chart speaks hours.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(axesSource, 'export const Axes')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const candlesStory =
  <Story param="graph" id="candles"
         can="The trader can read the same trades as candles"
         soThat="each window answers open, close, reach, and volume">
    <Tell>A line answers where the price went; a candle answers what each window did:
      where it opened and closed, how far it reached, and how much traded. The same
      buckets feed both cards; no new state exists, only new shapes.</Tell>
    <Tell>No new data exists for it either: the page owns one stream and one history,
      and every card reads them, so two charts can never tell two stories.</Tell>
    <Steps>
      <Step title="Born from the same buckets">
        <Words want="A second chart must not mean a second truth; two cards reading the same market have to agree, frame for frame.">
          <Says>The page owns one stream and hands every card the same trades; this
            card buckets them with the very fold the price line used,
            and mergeLive stitches the same history underneath. The line only ever read
            a corner of each candle; this card finally reads all of it. The period menu
            rides this card too, the
            same <Mdn path="Web/API/Popover_API">popover</Mdn> chooser.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain("const candles = await fetch('/candles?for=the-new-card');"),
            aside('// two fetches, two clocks, one screen disagreeing with itself')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(shapesSource, 'const fold'), gap,
            ...unit(shapesSource, 'export const bucketTrades'), gap,
            ...unit(shapesSource, 'export const mergeLive')
          ]}/>
        </Codes>
      </Step>
      <Step title="Shape each window’s candle">
        <Words want="Open, high, low, close: four numbers per window, one honest glyph.">
          <Says>candleShapes turns each candle into a body and a wick by the same
            proportions the sparkline used; rising and falling wear their own class,
            and CSS owns the colors.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(slotsSource, 'export const windowSlots'), gap,
            ...unit(shapesSource, 'export const candleShapes')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(candlesSource, '<svg className="candlesticks"', '</svg>')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(candlesCss, '.wick {'), gap,
            ...unit(candlesCss, '.up .body {'), gap,
            ...unit(candlesCss, '.down .body {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Bar the traded volume beneath">
        <Words want="A price move on no volume and one on heavy volume are different stories; the trader reads both at once.">
          <Says>volumeShapes bars each window’s traded size under the candles, scaled
            to the busiest window on screen, drawn in the same SVG pass.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(shapesSource, 'export const volumeShapes')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(candlesSource, '<svg className="volumes"', '</svg>')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(candlesCss, '.volume {')
          ]}/>
        </Codes>
      </Step>
      <Step title="The axes come free">
        <Words want="A cluster of candles is a shape, not a chart; it needs its reach labelled and its hours ticked.">
          <Says>The same Axes wraps this card: the high and the low come from the
            candles’ own reach, and the time ticks pattern themselves per period. A
            component that owns one job serves every chart that has that job.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(candlesSource, '<Axes high', 'headroomMs={2 * bucketMs[period]}>')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const pressureStory =
  <Story param="graph" id="pressure"
         can="The trader can see who is driving the move"
         soThat="a push and a retreat stop looking alike">
    <Tell>We could infer the driver from the direction of the price, but a rise on
      heavy buying and a rise on sellers stepping away draw the same line; so the
      card reads each match’s side, a fact the stream already carries, and folds
      every minute into bought size and sold size.</Tell>
    <Tell>History’s candles never say who started a trade; so the card counts only the
      session it watches, and says so. The heaviest side sets one scale for both
      directions, which keeps the taller side an honest answer.</Tell>
    <Steps>
      <Step title="Split each window by side">
        <Words want="Volume alone says how much traded, never who pushed; the split has to survive the bucketing.">
          <Says>Every match names its taker’s side, and the decoder makes that a
            fact: a frame whose side is not buy or sell never becomes a Trade. The
            fold mirrors the candles’ bucketing, but keeps two sums per window:
            bought size and sold size.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain("const driver = candle.close > candle.open ? 'buying' : 'selling';"),
            aside('// sellers stepping away wears the same badge as a stampede')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(coinbaseSource, 'const MatchDecoder'), gap,
            ...unit(pressureSource, 'const fold'), gap,
            ...unit(pressureSource, 'export const bucketPressure')
          ]}/>
        </Codes>
      </Step>
      <Step title="One scale, both directions">
        <Words want="Comparing the sides only works if both wear the same ruler; a taller bar must mean more size, nothing else.">
          <Says>The heaviest single side sets the scale. Bought rises from the
            midline, sold falls from it, and a window that bought four and sold two
            shows bars in exactly that proportion.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(slotsSource, 'export const windowSlots'), gap,
            ...unit(pressureSource, 'export const heaviestSide'), gap,
            ...unit(pressureSource, 'export const pressureShapes')
          ]}/>
        </Codes>
      </Step>
      <Step title="Bars around a midline">
        <Words want="The eye should read dominance at a glance, and the axes must speak size, not dollars.">
          <Says>Two rects per window around a hairline midline, wearing the colors
            the candles taught: mint above, orange below. Axes learned a second
            tongue for it: a label prop formats the reach in bitcoin instead of
            dollars, and the caption claims only what the card can honestly claim:
            the session it watched.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(pressureComponent, '<svg className="pressures"', '</svg>')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(pressureCss, '.midline {'), gap,
            ...unit(pressureCss, '.bought {'), gap,
            ...unit(pressureCss, '.sold {')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(moneySource, 'export const bitcoin')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const pieStory =
  <Story param="graph" id="pie"
         can="The trader can see who owns the session"
         soThat="the whole pot reads in one circle">
    <Tell>Pressure answers minute by minute; the pie answers the whole pot:
      everything traded since arrival, one slice per side. The same decoded
      stream feeds it, and like pressure it counts only the session it watched,
      because history never says who started a trade.</Tell>
    <Tell>The circle is cut by arithmetic that can move: each slice is two half-discs
      behind two fixed gates, and a share is how far its halves swing open. Swings,
      turns, and the explode are all transforms, one of the few properties the
      compositor animates without repainting, so a shifting split glides for free.</Tell>
    <Steps>
      <Step title="Total the sides">
        <Words want="One number per side for the whole session; the pie asks nothing about time.">
          <Says>sideTotals folds every trade into two sums, bought size and sold
            size, the same side the decoder proved. No buckets, no windows: the pie
            is the session’s aggregate, which is exactly why it stays honest as a
            pair of totals.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(pieSource, 'export const sideTotals')
          ]}/>
        </Codes>
      </Step>
      <Step title="Cut the circle">
        <Words want="Shares must become drawable shapes that can move; a split that shifts with every trade must glide, not jump, and glide cheaply.">
          <Says>You could paint the split with a conic gradient, but a painted
            background has no parts: nothing to class, nothing to label, nothing for a
            test to find. Honest arc paths came next, and the stream taught us better:
            an arc’s large-arc flag flips at half and cannot tween, so a moving split
            jumps. A dashed circle stroke tweens, but stroke geometry repaints every
            frame on the main thread. The compositor animates only a few properties
            without repainting — translate, rotate, scale,
            and <Mdn path="Web/CSS/opacity">opacity</Mdn> — so the cut is built from
            rotation alone: each slice is two half-discs behind two fixed gates, each a
            nested <Mdn path="Web/SVG/Element/svg">SVG viewport</Mdn> that shows only
            its own half-plane. The first gate owns the first half-turn, the second
            owns the rest, and a share is how far its halves swing open, in plain
            degrees; a slice under half a turn parks its closing half where its gate
            cannot see it, because a half-disc's span wraps. Nothing changes shape;
            everything that moves is a transform. A side that took everything is
            both gates fully open: no special case survives.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain("background: conic-gradient(green 0 75%, orange 75%);"),
            aside('/* one painted background, zero parts to name or announce */')
          ]}/>
          <Snippet label="JS" foil lines={[
            plain('const d = `M ${cx} ${cy} L ${ax} ${ay} A ${r} ${r} 0 ${large} 1 ${bx} ${by} Z`;'),
            aside('// honest arcs, but the large-arc flag cannot tween: every trade lands as a jump')
          ]}/>
          <Snippet label="JS" foil lines={[
            plain('<circle strokeDasharray={`${share * circumference} ${circumference}`}/>'),
            aside('// tweens, but stroke geometry repaints every frame; the compositor never helps')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(pieSource, 'export const slices'), gap,
            ...unit(pieSource, 'export const sweepGates')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(pieComponent, 'const layer = (drop', '</g>;')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(pieCss, '.slice {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Name the shares">
        <Words want="A circle without numbers is an impression; the trader wants the split spoken.">
          <Says>The legend prints each share as a percentage in the slice’s own
            color class, and the caption claims only what the card can honestly
            claim: the session’s volume by side, since you arrived.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(pieComponent, '<p className="legend">', '</p>')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const workspaceStory =
  <Story param="graph" id="workspace"
         can="The trader can lay out the workspace"
         soThat="the charts they watch sit where they put them">
    <Tell>One chart is dealt on arrival, and the workspace is the URL: add, sort,
      remove, refresh, share, and the layout survives all of it, because the address
      is the state.</Tell>
    <Tell>Sorting rides a native drag from a grip that only shows itself to a hover. The
      origin whispers in its seat, the displaced chart slides home on a keyframe,
      and the swap fires when the hand strays a third of the seat’s height from
      where it settled, the same distance up as down; every swap re-anchors to the
      hand, so reversing always costs a fresh third.</Tell>
    <Tell>The keyboard needs no grip: the card itself is the widget. Arrows walk it and
      focus rides along, delete removes it, and a lone chart offers neither grip nor
      remove, because a workspace cannot lose its last window.</Tell>
    <Steps>
      <Step title="Deal the workspace from the address">
        <Words want="The layout is the trader’s, so it must survive a refresh and travel in a link.">
          <Says>The charts param is a comma list of kinds; absent, the trader starts
            with one price chart. Adding prepends, so the newest chart lands under the
            hand, and the plus rides the heading with its menu anchored above it.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(kindsSource, 'export const isChartKind'), gap,
            ...unit(deskSource, 'export const dealt'), gap,
            ...unit(deskSource, 'export const added')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(workspaceSource, '<Menu id="add-chart"', '</Menu>')
          ]}/>
        </Codes>
      </Step>
      <Step title="Sort by a third’s stray">
        <Words want="The card is huge and the hand holds only its grip; the swap has to key on the hand, not the card’s far edge.">
          <Says>The drag anchors where the hand grabbed the seat. A swap fires when
            the hand strays a third of the seat’s height from that anchor, either
            direction, and the anchor re-derives at each swap from where the seat
            lands under the hand: hysteresis by bookkeeping, so mixed chart heights
            cannot jitter.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain('if (event.clientY > neighbour.top) swap();'),
            aside('// the hand holds the grip; the card is long past it')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(crossingSource, 'export const strayedTo'), gap,
            ...unit(travelSource, 'const travel = (event'), gap,
            ...unit(travelSource, 'const swap = (held')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(workspaceCss, '@keyframes chart-pushed')
          ]}/>
        </Codes>
      </Step>
      <Step title="The card answers keys">
        <Words want="The grip and the remove only show to a hover; the keyboard speaks to the card itself.">
          <Says>Focus the card: arrows walk it seat by seat and focus rides along, so
            a held arrow keeps moving the same chart. Delete removes it, guarded like
            everything else by the last-chart rule.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(travelSource, 'const keys')
          ]}/>
        </Codes>
      </Step>
      <Step title="Never the last">
        <Words want="An empty workspace shows nothing and teaches nothing; the last chart holds its post.">
          <Says>The grip and the remove are dealt only while more than one chart
            stands. With one left, hover finds nothing, delete falls silent, and only
            the plus remains.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(workspaceSource, 'const plural'), gap,
            ...unit(workspaceSource, 'const actions')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const chartStories: Record<ChartKind, ReactNode> = {
  price: priceStory,
  candles: candlesStory,
  pressure: pressureStory,
  pie: pieStory
};

export const ChartStories: FC<{kind: ChartKind}> = ({kind}) =>
  <Stories>{chartStories[kind]}</Stories>;

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
      <Stories>{workspaceStory}</Stories>
    </section>
  </section>;
