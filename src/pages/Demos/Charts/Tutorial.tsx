import {FC, ReactNode, useId} from 'react';
import {ChartKind} from './kinds';
import {Codes, Mdn, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, plain} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import {AThirdFromTheHand} from './Diagrams';
import shapesSource from './Candles/shapes.ts?sample';
import sparklineSource from './sparkline.ts?sample';
import periodSource from './period.ts?sample';
import candlesHook from './usePeriodCandles.ts?sample';
import priceSource from './PriceChart/PriceChart.tsx?sample';
import candlesSource from './Candles/Candles.tsx?sample';
import candlesCss from './Candles/Candles.css?sample';
import pressureSource from './Pressure/shapes.ts?sample';
import pressureComponent from './Pressure/Pressure.tsx?sample';
import pressureCss from './Pressure/Pressure.css?sample';
import pieSource from './Pie/shapes.ts?sample';
import pieComponent from './Pie/Pie.tsx?sample';
import pieCss from './Pie/Pie.css?sample';
import moneySource from './money.ts?sample';
import slotsSource from './slots.ts?sample';
import coinbaseSource from './coinbase/index.ts?sample';
import historySource from './coinbase/history.ts?sample';
import demosSource from '@pages/Demos/store.ts?sample';
import axesSource from './Axes/Axes.tsx?sample';
import workspaceSource from './Workspace.tsx?sample';
import travelSource from './useChartTravel.ts?sample';
import deskSource from './desk.ts?sample';
import kindsSource from './kinds.ts?sample';
import crossingSource from '../DragAndDrop/crossing.ts?sample';
import workspaceCss from './Workspace.css?sample';
import '../Recipe/Recipe.css';

const gap = plain(' ');

const priceStory =
  <Story param="graph" id="price"
    can="The trader can watch the price move, live"
    soThat="the session reads at a glance">
    <Tell>We could reach for a chart library, but this chart is one line and two axes. So the line is drawn with SVG, the
      browser’s own format for shapes, and its points are arithmetic over the trades the page already holds.</Tell>
    <Tell>The candles and the points are never stored. Every time React redraws the chart, they are worked out again
      from the trades.</Tell>
    <Tell>Trades arrive faster than anyone can read, so they are grouped into equal spans of time. Each span becomes one
      candle: a record of where the price opened, how high and how low it reached, and where it closed. The past is
      fetched and fills the left of the line, the live feed fills the right, and the two are joined in time order.</Tell>
    <Steps>
      <Step title="Open a socket, and keep only what decodes">
        <Words want="A live chart starts with a connection to the exchange, and nothing it sends is trusted until it has been checked.">
          <Says>The browser opens a <Mdn path="Web/API/WebSocket">WebSocket</Mdn>, a connection the server can keep sending
            on, and asks the exchange for one product’s matches. A match is one trade.</Says>
          <Says>Each message is checked three ways before it counts. It has to parse as JSON. It has to have the fields a
            match has, each of the right kind. And its price, its size and its time have to turn into real numbers. What
            passes is a Trade. What fails never reaches the page’s state.</Says>
          <Says>The page keeps only the newest 1,500 trades, because the feed never ends and the page must not grow with
            it.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(coinbaseSource, 'export const subscribeTo'), gap,
            ...unit(coinbaseSource, 'export const decodeTrade'), gap,
            ...unit(demosSource, 'const LATEST_TRADES_CAP'), gap,
            ...unit(demosSource, 'const tradesReducer')
          ]}/>
        </Codes>
      </Step>
      <Step title="Fetch the recent past, and join it to the live trades">
        <Words want="The trader arrives mid-session. The left of the chart happened before they came.">
          <Says>The exchange also answers plain requests over <Mdn path="Web/API/Fetch_API">HTTP</Mdn>. The page asks it for
            recent candles, each the size the chosen period uses, and checks them as it checks the live messages.</Says>
          <Says>mergeLive joins the two. It takes the fetched candles up to where the live ones begin, then the live ones,
            and keeps only as many as the chart shows.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(historySource, 'export const periodCandles'), gap,
            ...unit(demosSource, 'const candlesReducer'), gap,
            ...unit(candlesHook, 'export const usePeriodCandles'), gap,
            ...unit(shapesSource, 'export const mergeLive')
          ]}/>
        </Codes>
      </Step>
      <Step title="Group the live trades into candles">
        <Words want="Raw trades arrive too fast to draw. The line needs one point for each span of time.">
          <Says>bucketTrades goes through the live trades in order and makes one candle for each span. The first trade in a
            span opens the candle. Each later one raises its high or lowers its low if it has to, becomes its close, and
            adds to its volume.</Says>
          <Says>One candle for each span is one point for each span, which is all a line needs.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(shapesSource, 'const fold'), gap,
            ...unit(shapesSource, 'export const bucketTrades')
          ]}/>
        </Codes>
      </Step>
      <Step title="Let the trader choose the period">
        <Words want="A trader watching the last few minutes and one reading the whole week are asking different questions. The trader picks the period, and everything on the chart follows it.">
          <Says>The period menu sits on the chart. It is a <Mdn path="Web/API/Popover_API">popover</Mdn>, the kind of menu
            the z-index tab explains.</Says>
          <Says>Each period has its own span for a candle, its own limit on how many candles the chart holds, and its own
            spacing for the marks on the time axis. The hour has candles of a minute, 60 of them, marked every ten minutes.
            The day has candles of an hour, 24 of them, marked every hour. The week has candles of six hours, 28 of them,
            marked every day.</Says>
          <Says>Choosing a period fetches the past again at that period’s candle size.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(periodSource, 'export const bucketMs'), gap,
            ...unit(periodSource, 'export const periodCap')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(priceSource, '{actions}', '</menu>')
          ]}/>
        </Codes>
      </Step>
      <Step title="Turn each candle into a point on the line">
        <Words want="The line has to stay smooth while trades keep arriving, on a slow machine too.">
          <Says>Each candle becomes a point by proportion. Its time sets how far across the point is, and its closing price
            sets how far down, with the highest price at the top.</Says>
          <Says>The points go to one SVG <Mdn path="Web/SVG/Element/polyline">polyline</Mdn>, a line drawn through a list of
            points. A new trade means new points, and React draws the new line. Nothing on the page is measured, and the line is
            never animated: it is drawn again. Only the dot on the newest point moves, sliding to its new place over 300
            milliseconds.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(sparklineSource, 'export const sparklinePoints')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(priceSource, '<svg className="sparkline"', '</svg>')
          ]}/>
        </Codes>
      </Step>
      <Step title="Label the prices and the time">
        <Words want="A line with no labels is a shape, not a chart. The trader needs the high, the low and the time under it.">
          <Says>Axes wraps the body of any chart. At the side it labels the highest price, the lowest, and the one midway
            between them. Along the bottom it marks the time.</Says>
          <Says>How far apart the time marks sit comes from the period: every ten minutes on the hour chart, every hour on the
            day chart, every day on the week chart.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
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
          <Snippet label="TS" lines={[
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
          <Snippet label="TS" lines={[
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
          <Snippet label="TS" lines={[
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
            ...span(candlesSource, 'const range = rangeOf(', '  );'), gap,
            ...span(candlesSource, '<Axes range', 'headroomMs={2 * bucketMs[period]}>')
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
          <Snippet label="TS" lines={[
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
          <Snippet label="TS" lines={[
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
          <Snippet label="TS" lines={[
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
          <Snippet label="TS" lines={[
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
          <Snippet label="TS" lines={[
            ...unit(pieSource, 'export const slices'), gap,
            ...unit(pieSource, 'export const sweepGates')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(pieComponent, "{['wall', 'face'].map(dressed", '}))}')
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
    <Tell>Adding a chart, sorting, removing one and choosing a period are each written into the page’s address.
      That is all a reload or a shared link needs to bring the layout back.</Tell>
    <Tell>Sorting uses the browser’s own drag and drop, which HTML turns on with the draggable attribute, a setting written on
      the element. A chart is draggable only while its grip is pressed, and the grip shows when the pointer is over the
      chart. While a chart is held it fades almost to nothing where it sits, and the browser draws a copy of it under the
      hand. It swaps with its neighbour once the hand has moved a third of the chart’s height from where it grabbed, up
      or down, and the neighbour slides into the place it left.</Tell>
    <Tell>The keyboard does not need the grip. With a chart in focus, meaning it is the one the keyboard is on, the up
      and down arrows move it one place and focus stays on it. Delete removes it. When one chart is left it has no
      grip and no remove button, and Delete does nothing, so the workspace always has a chart.</Tell>
    <Steps>
      <Step title="Read the charts from the address">
        <Words want="The layout is the trader’s, so it has to come back after a reload and travel in a link.">
          <Says>The address’s query string, the part after the question mark, carries a value named charts: a list
            of chart names with commas between them. A name the page doesn’t know is skipped, a name given twice
            counts once, and with no list the page shows one price chart. A new chart goes to the front of the list,
            so it appears at the top, next to the + that added it. The + opens a menu of the charts not yet on the
            page.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(kindsSource, 'export const isChartKind'), gap,
            ...unit(deskSource, 'export const dealt'), gap,
            ...unit(deskSource, 'export const added')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(workspaceSource, '<menu id="add-chart"', '</menu>')
          ]}/>
        </Codes>
      </Step>
      <Step title="A chart swaps once the hand has moved a third of its height">
        <Words want="A chart is large and the hand holds only its grip. So the swap is measured from the hand, not from the chart’s far edge.">
          <Says>On dragstart, the event the browser sends when a drag begins, the code marks where the hand is on
            the page. On every dragover, the event it sends as the hand moves over a chart, the code compares the hand
            with that mark. A third of the held chart’s height below the mark, the chart swaps with the one under it;
            a third above, with the one over it. Then the mark is set again to where the hand is.</Says>
          <Says>That matters when the charts differ in height. A short chart that passes a tall one drops by the tall
            one’s height. A mark left on the chart would now be far from the hand, and the two would swap straight
            back.</Says>
          <AThirdFromTheHand/>
          <Says>The neighbour’s slide is a keyframe animation, one whose start is written in an @keyframes rule. It
            starts its own height away and runs to its new place in 150 milliseconds. A chart cannot be swapped
            with one that is still sliding.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(crossingSource, 'export const strayedTo'), gap,
            ...unit(travelSource, 'const travel = (event'), gap,
            ...unit(travelSource, 'const swap = (held')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(workspaceCss, '@keyframes chart-pushed')
          ]}/>
        </Codes>
      </Step>
      <Step title="The arrow keys move a chart, and Delete removes it">
        <Words want="The grip and the remove button show only under a pointer. A keyboard works on the chart itself.">
          <Says>Each chart is a link, so Tab reaches it. With a chart in focus, the up and down arrows move it one
            place, stopping at the ends, and focus stays on it, so holding an arrow keeps moving the same chart.
            Delete or Backspace removes it, unless it is the last chart.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(travelSource, 'const keys')
          ]}/>
        </Codes>
      </Step>
      <Step title="The last chart can’t be removed">
        <Words want="An empty workspace shows nothing and teaches nothing, so one chart always stays.">
          <Says>The grip and the remove button are drawn only while there is more than one chart. With one chart left
            there is no grip and no remove button, and Delete does nothing. The + is still there.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
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

export const ChartsTutorial: FC = () => {
  const titled = `tutorials${useId()}`;
  return <section aria-labelledby={titled} className="tutorials">
    <h2 id={titled} className="tutorials-title">let’s build this feature</h2>
    <p className="overview paragraph">
      We are going to build this site’s live charts, feature by feature. Here is how to use
      this page: every card below is a feature, told as a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>. Open a card and you get the plan for that feature and
      the steps that build it, with the real code from this site, so what you read is what
      runs. Each chart above opens its own tutorial: click it, or press Enter on it. The links go to MDN, Mozilla’s
      web reference, if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic">
        Numbers tell me where the price is; I need to see where it has been to feel where it
        is going. One glance, the shape of the session. And I arrange my own desk: the charts
        I watch, in the order I watch them.
      </blockquote>
      <figcaption className="attribution">a trader</figcaption>
    </figure>
    <p className="overview paragraph">
      If you want the exercise, stop here and build the story yourself first. The charts are
      our interpretation of that; the cards below break the interpretation into features.
      Open one to see how we built it, or to compare it with yours.
    </p>
    <section aria-label="build the charts yourself" className="build-steps">
      <Stories>{workspaceStory}</Stories>
    </section>
  </section>;
};
