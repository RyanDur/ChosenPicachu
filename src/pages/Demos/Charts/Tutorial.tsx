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
import drawingCss from '../../../styles/drawing.css?sample';
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
    <Tell>Trades arrive faster than anyone can read, so they are grouped into equal spans of time. Each span becomes one
      candle: a record of where the price opened, how high and how low it reached, and where it closed.</Tell>
    <Tell>The past is fetched as candles and fills the left of the line. The live feed fills the right. The two are joined
      in time order.</Tell>
    <Tell>The page stores the trades and the fetched candles. The candles made from live trades, the joined series and the
      points are not stored: every time React redraws the chart, they are worked out again.</Tell>
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
    soThat="each span of time shows its open, its close, its high and low, and its volume">
    <Tell>A line shows where the price went. A candle shows what each span of time did: where the price opened and
      closed, how high and how low it reached, and how much was traded.</Tell>
    <Tell>This chart needs no new data and keeps none of its own. It is given the same trades as the price line, and it
      groups and joins them with the same two functions.</Tell>
    <Tell>So two charts set to the same period are drawn from the same candles and cannot disagree.</Tell>
    <Steps>
      <Step title="Make the candles the way the price line does">
        <Words want="A second chart must not mean a second version of the market. Two charts of the same trades have to agree.">
          <Says>The page has one live feed and hands every chart the same trades. This chart groups them into candles with
            bucketTrades and joins the fetched past with mergeLive, the same two functions the price line uses.</Says>
          <Says>The price line takes one price from each candle, its close. This chart draws all of it.</Says>
          <Says>The period menu is on this chart too, the same <Mdn path="Web/API/Popover_API">popover</Mdn> as on the price
            line.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(shapesSource, 'const fold'), gap,
            ...unit(shapesSource, 'export const bucketTrades'), gap,
            ...unit(shapesSource, 'export const mergeLive')
          ]}/>
        </Codes>
      </Step>
      <Step title="Draw each candle as a body, a wall and a wick">
        <Words want="Open, high, low, close: four numbers for each span, drawn as one mark.">
          <Says>candleShapes turns each candle into two shapes. The body runs from the open to the close, and the wick, a
            thin line through the body, runs from the high to the low. The chart adds a third, the wall: a copy of the body
            moved 1 right and 1.5 down, which gives the body an edge.</Says>
          <Says>Prices are placed by the same proportion the price line uses, with the highest high at the top and the
            lowest low at the bottom. Across the chart, windowSlots gives each candle an equal slot and makes the body 60%
            of the slot wide, so two candles never touch.</Says>
          <Says>A candle that closed at or above its open gets the class up, and one that closed lower gets down.</Says>
          <Says>Some of what a candle looks like is shared with the rest of the site. A shared class is a look that lives
            in the site’s shared sheet and that an element wears by name; the chart’s own sheet keeps what is not a look:
            the chart’s size, the wick’s hairline width and how the shapes move.</Says>
          <Says>Each candle wears a side beside its class: a candle that went up wears buy-side and one that went down
            wears sell-side, shared classes that set a side’s colours. The body wears side-face and the wall side-wall,
            so the shared sheet paints them, and the wick wears drawn, which gives it its charcoal stroke.</Says>
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
            ...unit(drawingCss, '.drawn {'), gap,
            ...unit(drawingCss, '.buy-side {'), gap,
            ...unit(drawingCss, '.sell-side {'), gap,
            ...unit(drawingCss, '.side-face {'), gap,
            ...unit(drawingCss, '.side-wall {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Draw the volume under each candle">
        <Words want="A price move on little trading and one on heavy trading mean different things. The trader reads both at once.">
          <Says>volumeShapes draws a bar under each candle for how much was traded in that span. The tallest bar is the
            busiest span on the chart, and every other bar is in proportion to it.</Says>
          <Says>The bars are a second SVG under the candles, in the same slots, so each bar sits under its candle.</Says>
          <Says>The volume bars wear volume-side with side-face and side-wall. A side’s colours travel as custom
            properties, values a stylesheet names once and other rules read, and a side class sets them: volume-side
            sets leather for the bar and drab for its edge, and the bars read them through side-face and side-wall.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(shapesSource, 'export const volumeShapes')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(candlesSource, '<svg className="volumes volume-side"', '</svg>')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(candlesCss, '.volume,\n    .volume-wall {'), gap,
            ...unit(drawingCss, '.volume-side {'), gap,
            ...unit(drawingCss, '.side-face {'), gap,
            ...unit(drawingCss, '.side-wall {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Use the same axes">
        <Words want="Candles with no labels are a shape, not a chart. They need their prices labelled and their time marked.">
          <Says>The same Axes wraps this chart. Its prices come from the highest high and the lowest low of the candles on
            show, and its time marks follow the period, as on the price line.</Says>
          <Says>Axes does one job, so every chart that has that job uses it.</Says>
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
    <Tell>We could guess who is pushing from the direction of the price. But a rise on heavy buying and a rise because
      sellers stepped back draw the same line.</Tell>
    <Tell>So this chart reads something the feed already carries. Every trade has an order that was waiting and one that
      came and took it, and Coinbase marks each trade with the side of the one that was waiting. A trade marked sell is
      one a buyer took. The chart sums each minute into the size buyers took and the size sellers took.</Tell>
    <Tell>The fetched past is candles, and a candle doesn’t say who took a trade. So the chart counts only the trades that
      arrive while it is open, and its caption says so. The larger side sets one scale for both directions, so a taller
      bar always means more size.</Tell>
    <Steps>
      <Step title="Sum each minute by who took the trade">
        <Words want="Volume says how much was traded, never who pushed. The split has to survive the grouping.">
          <Says>The decoder accepts a match only if its side is buy or sell, so every Trade has one. takerBought says what
            the mark means: Coinbase marks the waiting order’s side, so a buyer took the trade when the mark is sell.</Says>
          <Says>bucketPressure groups the trades into minutes the way the candles are grouped, and keeps two sums for each
            minute: the size buyers took and the size sellers took. The chart shows the newest 60 minutes.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(coinbaseSource, 'const MatchDecoder'), gap,
            ...unit(coinbaseSource, 'export const takerBought'), gap,
            ...unit(pressureSource, 'const fold'), gap,
            ...unit(pressureSource, 'export const bucketPressure')
          ]}/>
        </Codes>
      </Step>
      <Step title="Scale both sides by the larger one">
        <Words want="The two sides can only be compared on one scale. A taller bar has to mean more size and nothing else.">
          <Says>heaviestSide finds the largest single side of any minute on the chart, and that sets the scale. Bought
            rises from the middle line and sold falls from it. A minute that bought four and sold two shows bars in that
            proportion.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(slotsSource, 'export const windowSlots'), gap,
            ...unit(pressureSource, 'export const heaviestSide'), gap,
            ...unit(pressureSource, 'export const pressureShapes')
          ]}/>
        </Codes>
      </Step>
      <Step title="Draw the bars, and label them in bitcoin">
        <Words want="The reader should see which side is larger at a glance, and the labels should give size, not dollars.">
          <Says>Each minute is a bar above a thin middle line for bought and a bar below it for sold: green above, orange
            below. The bought bars wear buy-side and the sold bars sell-side. Those are shared classes, looks that live in
            the site’s shared sheet and that an element wears by name.</Says>
          <Says>A side class sets a side’s colours as custom properties, values a stylesheet names once and other rules
            read. side-face reads the face colour for the bar. side-wall reads the wall colour for the second rectangle
            set just behind it, which gives it an edge. The middle line wears drawn, which gives it its charcoal
            stroke.</Says>
          <Says>When a minute’s sums change, its bars grow to their new size over 300 milliseconds.</Says>
          <Says>Axes takes a function for its labels on this chart, so the scale reads in bitcoin instead of dollars. The
            caption says how many minutes are on show, and that the count began when you arrived.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(pressureComponent, '<svg className="pressures"', '</svg>')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(pressureCss, '.midline {'), gap,
            ...unit(drawingCss, '.drawn {'), gap,
            ...unit(drawingCss, '.buy-side {'), gap,
            ...unit(drawingCss, '.sell-side {'), gap,
            ...unit(drawingCss, '.side-face {'), gap,
            ...unit(drawingCss, '.side-wall {')
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
    <Tell>The pressure chart answers minute by minute. The pie answers for the whole visit: everything traded since you
      arrived, one slice for the size buyers took and one for the size sellers took.</Tell>
    <Tell>It reads the same trades with the same rule for who took each one, and like the pressure chart it counts only
      what arrives while it is open.</Tell>
    <Tell>The circle has to move as the split changes, and move smoothly. So each slice is made of two half-discs that are
      only ever rotated, and a share is how far they have turned into view.</Tell>
    <Steps>
      <Step title="Add up each side">
        <Words want="One number for each side, for the whole visit. The pie asks nothing about time.">
          <Says>sideTotals goes through every trade and adds its size to one of two sums, bought or sold, using
            takerBought. There are no minutes and no spans here: the pie is the whole visit as a pair of totals.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(coinbaseSource, 'export const takerBought'), gap,
            ...unit(pieSource, 'export const sideTotals')
          ]}/>
        </Codes>
      </Step>
      <Step title="Cut the circle with rotations only">
        <Words want="The shares have to become shapes that can move. A split that changes with every trade should turn smoothly, not jump.">
          <Says>You could paint the split with a conic gradient, a background that sweeps colour round a point. But a
            painted background has no parts: nothing to give a class, nothing to label, nothing for a test to find.</Says>
          <Says>Arc paths were the next try. An SVG arc carries a flag that flips when the arc passes half the circle, and a
            flag can’t be moved gradually, so a split that crosses half jumps.</Says>
          <Says>A dashed stroke on a circle can be moved gradually, but the browser has to draw the stroke again on every
            frame.</Says>
          <Says>A rotation asks for less: the shape stays the same, and only where it is drawn changes. So the cut is built
            from rotation alone.</Says>
          <Says>Each slice is two half-discs. Each half-disc sits behind its own window, a
            nested <Mdn path="Web/SVG/Element/svg">SVG viewport</Mdn>, that shows one half of the circle and hides the
            other.</Says>
          <Says>The first window shows the first half-turn of the slice, and the second shows the rest. A share is how far
            the two half-discs have turned into their windows, in degrees. A slice of less than half a turn leaves its
            second half-disc turned out of sight.</Says>
          <Says>A side that took everything is both half-discs fully in view. Nothing changes shape. Everything that moves is
            a rotation or a shift, each over 300 milliseconds.</Says>
          <Says>Each slice is also pushed a little way out from the centre, along its own middle, unless it is the whole
            pie. And each is drawn twice, once a little lower, which gives the pie its edge.</Says>
          <Says>The markup hands each number to the stylesheet as a custom property: a value set by name on the element,
            such as <code>--turn</code>, and read back in the sheet with <code>var()</code>. The sheet declares each one
            with <code>@property</code>, a rule that gives a custom property a type and a starting value. The turn and the
            swing are angles, and the push out from the centre is two lengths. Before the markup sets them, a slice sits
            unturned at the centre.</Says>
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
            ...unit(pieCss, '@property --explode-x {'), gap,
            ...unit(pieCss, '@property --explode-y {'), gap,
            ...unit(pieCss, '@property --turn {'), gap,
            ...unit(pieCss, '@property --swing {'), gap,
            ...unit(pieCss, '.slice {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Print each share">
        <Words want="A circle without numbers is only an impression. The trader wants the split in figures.">
          <Says>The legend prints each share as a whole percentage, in its slice’s colour. The caption says what the pie is:
            the size traded on each side since you arrived.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(pieComponent, '<ul className="legend caption">', '</ul>')
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
    <h2 id={titled} className="title">let’s build this feature</h2>
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
      <blockquote className="quote paragraph italic trim-bar-beside">
        Numbers tell me where the price is; I need to see where it has been to feel where it
        is going. One glance, the shape of the session. And I arrange my own desk: the charts
        I watch, in the order I watch them.
      </blockquote>
      <figcaption className="attribution caption muted-ink">a trader</figcaption>
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
