import {TabLink} from '@pages/Demos/TabLink';
import {FC, ReactNode} from 'react';
import {DemoTopics} from '../demo-topics';
import {ChartKind} from './chart-kinds';
import {Codes, Mdn, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, lines, carve} from '../Recipe';
import candleShapesSource from './Candles/candle-shapes.ts?sample';
import candleSeriesSource from '@pages/Demos/Market/candles.ts?sample';
import sparklineSource from './sparkline.ts?sample';
import periodSource from '@pages/Demos/Market/periods.ts?sample';
import candlesHook from './usePeriodCandles.ts?sample';
import priceSource from './PriceChart/PriceChart.tsx?sample';
import candlesSource from './Candles/Candles.tsx?sample';
import candlesCss from './Candles/Candles.css?sample';
import barSource from './Bar.tsx?sample';
import shapeAtSource from './shape-at.ts?sample';
import shapeCss from './shape.css?sample';
import pressureShapesSource from './Pressure/pressure-shapes.ts?sample';
import pressureComponent from './Pressure/Pressure.tsx?sample';
import pressureCss from './Pressure/Pressure.css?sample';
import pieSource from './Pie/pie-shapes.ts?sample';
import pieComponent from './Pie/Pie.tsx?sample';
import pieCss from './Pie/Pie.css?sample';
import drawingCss from '../../../styles/drawing.css?sample';
import moneySource from '@pages/Demos/Market/money.ts?sample';
import bucketPlacesSource from './bucket-places.ts?sample';
import coinbaseSource from '@pages/Demos/Market/coinbase.ts?sample';
import historySource from '@pages/Demos/Market/coinbase-history.ts?sample';
import marketSliceSource from '@pages/Demos/Market/marketSlice.ts?sample';
import liveTradesSource from '@pages/Demos/Market/live-trades.ts?sample';
import axesSource from './Axes/Axes.tsx?sample';
import axesCss from './Axes/Axes.css?sample';
import '../Recipe/Recipe.css';

const PriceStory: FC = () =>
  <Story param="graph" id="price"
    can="The trader can watch the price move, live"
    soThat="the session reads at a glance">
    <Tell>I could have reached for a chart library, but this chart is one line and two axes. So I draw the line with
      SVG, the browser’s own format for shapes, and its points are arithmetic over the trades the page already
      holds.</Tell>
    <Tell>Trades arrive faster than anyone can read, so they are grouped into equal buckets of time. Each bucket becomes
      one candle: a record of where the price opened, how high and how low it reached, and where it closed.</Tell>
    <Tell>The past is fetched as candles and fills the left of the line. The live feed fills the right. The two are
      joined in time order.</Tell>
    <Tell>The page stores the trades and the fetched candles. React is the library this site’s script is written in, as
      the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> says. Every time it redraws the chart, the candles made
      from live trades, the joined series and the points are worked out again. None of them is stored.</Tell>
    <Steps>
      <Step title="Open a socket, and keep only what decodes">
        <Words want="A live chart starts with a connection to the exchange, and nothing it sends is trusted until it has been checked.">
          <Says>The browser opens a <Mdn path="Web/API/WebSocket">WebSocket</Mdn>, a connection the server can keep
            sending on, and asks the exchange for one product’s matches. A match is one trade.</Says>
          <Says>Each message is checked three ways before it counts. It has to parse as JSON. It has to have the fields
            a match has, each of the right kind. And its price, its size and its time have to turn into real numbers.
            What passes is a Trade. What fails never reaches the page’s state, the values the page holds and draws from,
            as the{' '}
          <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> says.</Says>
          <Says>The page keeps only the newest 1,500 trades, because the feed never ends and the page must not grow with
            it, so the live part of the price line and the candles reaches back as far as those trades do.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(coinbaseSource, 'const subscribeTo'), lines.blank,
            ...carve.unit(coinbaseSource, 'const decodeTrade'), lines.blank,
            ...carve.unit(liveTradesSource, 'export const liveTrades'), lines.blank,
            ...carve.unit(marketSliceSource, 'const tradesReducer')
          ]}/>
        </Codes>
      </Step>
      <Step title="Fetch the recent past, and join it to the live trades">
        <Words want="The trader arrives mid-session. The left of the chart happened before they came.">
          <Says>The exchange also answers plain requests over <Mdn path="Web/API/Fetch_API">HTTP</Mdn>. The page asks it
            for recent candles, each the size the chosen period uses, and checks them as it checks the live
            messages.</Says>
          <Says>mergeLive joins the two. It takes the fetched candles up to where the live ones begin, then the live
            ones, and keeps only as many as the chart shows.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(historySource, 'const periodCandles'), lines.blank,
            ...carve.unit(marketSliceSource, 'const candlesReducer'), lines.blank,
            ...carve.unit(candlesHook, 'export const usePeriodCandles'), lines.blank,
            ...carve.unit(candleSeriesSource, 'const mergeLive')
          ]}/>
        </Codes>
      </Step>
      <Step title="Group the live trades into candles">
        <Words want="Raw trades arrive too fast to draw. The line needs one point for each bucket of time.">
          <Says><code className="monospaced">bucketTrades</code> goes through the live trades in order and makes one
            candle for each bucket. <code className="monospaced">bucketOpening</code> finds a trade’s bucket by
            rounding its time down to the start of the bucket. The first trade in a bucket opens the candle. Each
            later one raises its high or lowers its low if it has to, becomes its close, and adds to its volume.</Says>
          <Says>One candle for each bucket is one point for each bucket, which is all a line needs.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(candleSeriesSource, 'const fold'), lines.blank,
            ...carve.unit(candleSeriesSource, 'const bucketOpening'), lines.blank,
            ...carve.unit(candleSeriesSource, 'const bucketTrades')
          ]}/>
        </Codes>
      </Step>
      <Step title="Let the trader choose the period">
        <Words want="A trader watching the last few minutes and one reading the whole week are asking different questions. The trader picks the period, and everything on the chart follows it.">
          <Says>The period menu sits on the chart. It is a <Mdn path="Web/API/Popover_API">popover</Mdn>, the kind of
            menu the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> explains.</Says>
          <Says>Each period has a length of time, a bucket length for a candle, and its own spacing for the marks on
            the time axis. The most candles the chart holds follows from the first two: the period’s length divided by
            its bucket. The hour has candles of a minute, at most 60 of them, marked every ten minutes. The day has
            candles of an hour, at most 24 of them, marked every hour. The week has candles of six hours, at most 28 of
            them, marked every day.</Says>
          <Says>Choosing a period fetches the past again at that period’s candle size.</Says>
          <Says>The period menu is built from Menu, Entry and Item. Each is a component, a function that writes a piece
            of the page, as the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> says. They write a menu, an li,
            which is one item of a list, and a button.</Says>
          <Says>A class, as the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> says, is a name a style
            sheet’s rules pick out. Item gives its button the site’s shared classes that set its look; the menu’s look
            is the page’s to choose, so the page passes Menu those classes, as the sample shows.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(periodSource, 'const lengthsByPeriod'), lines.blank,
            ...carve.unit(periodSource, 'type Lengths'), lines.blank,
            ...carve.unit(periodSource, 'const perPeriod'), lines.blank,
            ...carve.unit(periodSource, 'const bucketMilliseconds'), lines.blank,
            ...carve.unit(periodSource, 'const candleCap')
          ]}/>
          <Snippet label="HTML" lines={[
            ...carve.span(priceSource, '{actions}', '</Menu>')
          ]}/>
        </Codes>
      </Step>
      <Step title="Turn each candle into a point on the line">
        <Words want="The line has to stay smooth while trades keep arriving, on a slow machine too.">
          <Says>Each candle becomes a point by proportion. Its time sets how far across the point is, and its closing
            price sets how far down, with the highest price at the top.</Says>
          <Says>The points go to one SVG <Mdn path="Web/SVG/Element/polyline">polyline</Mdn>, a line drawn through a
            list of points. A new trade means new points, and React draws the new line. Nothing on the page is measured,
            and the line is never animated: it is drawn again. Only the dot on the newest point moves. It is placed
            by <code className="monospaced">translate</code>, a transform, so it slides to its new place over 300
            milliseconds.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.span(sparklineSource, 'const points = (', 'export const sparkline = {points};')
          ]}/>
          <Snippet label="HTML" lines={[
            ...carve.span(priceSource, '<svg className="sparkline"', '</svg>')
          ]}/>
        </Codes>
      </Step>
      <Step title="Label the prices and the time">
        <Words want="A line with no labels is a shape, not a chart. The trader needs the high, the low and the time under it.">
          <Says>Axes places its parts on the chart’s own grid, with a column at the side for the prices. At the side
            it labels the highest price, the lowest, and the one
            midway between them. Along the bottom it marks the time.</Says>
          <Says>The stage becomes a grid only when it holds price labels: <code
            className="monospaced">{'.chart-stage:has(> .y-labels)'}</code>. <Mdn path="Web/CSS/:has"><code
            className="monospaced">:has()</code></Mdn>, as the <TabLink to={DemoTopics.accordions}>accordions
              tab</TabLink> says, picks an element by what it contains. The <code className="monospaced">{'>'}</code> is
            the <Mdn path="Web/CSS/Child_combinator">child combinator</Mdn>, which keeps the match to the stage’s own
            children. Every part starts across both columns. The price labels then take the first column. The time
            marks take the second, and so does every part between the price labels and the time marks: <code
            className="monospaced">.y-labels ~ :has(~ .x-labels)</code> picks each part that comes after the price
            labels and has the time marks still after it. The <code className="monospaced">~</code> is the combinator
            the accordions tab explains, which picks the siblings that come later.</Says>
          <Says>How far apart the time marks sit comes from the period: every ten minutes on the hour chart, every hour
            on the day chart, every day on the week chart.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.span(axesSource, 'export const Axes', '</>;')
          ]}/>
          <Snippet label="CSS" lines={[
            ...carve.unit(axesCss, '.chart-stage:has(> .y-labels) {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const CandlesStory: FC = () =>
  <Story param="graph" id="candles"
    can="The trader can read the same trades as candles"
    soThat="each bucket of time shows its open, its close, its high and low, and its volume">
    <Tell>A line shows where the price went. A candle shows what each bucket of time did: where the price opened and
      closed, how high and how low it reached, and how much was traded.</Tell>
    <Tell>This chart needs no new data and keeps none of its own. It is given the same trades as the price line, and it
      groups and joins them with the same two functions.</Tell>
    <Tell>So two charts set to the same period are drawn from the same candles and cannot disagree.</Tell>
    <Steps>
      <Step title="Make the candles the way the price line does">
        <Words want="A second chart must not mean a second version of the market. Two charts of the same trades have to agree.">
          <Says>The page has one live feed and gives every chart the same trades. This chart groups them into candles
            with bucketTrades and joins the fetched past with mergeLive, the same two functions the price line
            uses.</Says>
          <Says>The price line takes one price from each candle, its close. This chart draws all of it.</Says>
          <Says>The period menu is on this chart too, the same <Mdn path="Web/API/Popover_API">popover</Mdn> as on the
            price line: the kind of menu the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> explains.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(candleSeriesSource, 'const fold'), lines.blank,
            ...carve.unit(candleSeriesSource, 'const bucketOpening'), lines.blank,
            ...carve.unit(candleSeriesSource, 'const bucketTrades'), lines.blank,
            ...carve.unit(candleSeriesSource, 'const mergeLive')
          ]}/>
        </Codes>
      </Step>
      <Step title="Draw each candle as a body, a wall and a wick">
        <Words want="Open, high, low, close: four numbers for each bucket, drawn as one mark.">
          <Says><code className="monospaced">candleShapes.drawn</code> turns each candle into two shapes. The body runs from the open to
            the close, and the wick, a thin line through the body, runs from the high to the low. The chart adds a
            third, the wall: a copy of the body moved 1 right and 1.5 down, which gives the body an edge.</Says>
          <Says>Prices are placed by the same proportion the price line uses, with the highest high at the top and the
            lowest low at the bottom. Across the chart, <code className="monospaced">bucketPlaces.of</code> gives each candle an equal place and makes the body
            60% of that place wide, so two candles never touch.</Says>
          <Says>A class, as the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> says, is a name a style
            sheet’s rules pick out. A candle that closed at or above its open gets the class up, and one that closed
            lower gets down.</Says>
          <Says>Some of what a candle looks like is shared with the rest of the site. A shared class is a look that
            lives in the site’s shared style sheet and that an element wears by name; the chart’s own style sheet keeps
            what is not a look: the chart’s size, the wick’s hairline width and how the shapes move.</Says>
          <Says>Each candle wears a side beside its class: a candle that went up wears buy-side and one that went down
            wears sell-side, shared classes that set a side’s colors. The body wears side-face and the wall side-wall,
            so the shared style sheet paints them, and the wick wears drawn, which gives it its charcoal stroke.</Says>
          <Says>The body and the wall each start as a square one unit on a side, and the wick as a line one unit tall.
            The markup gives every shape four custom properties: where the shape starts across, where its foot sits, how
            wide it is and how tall. A custom property is a value set by name on an element and read back in the style
            sheet with <code className="monospaced">var()</code>, as
            the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> explains. The chart’s style sheet reads all
            four in one transform that moves the shape into place and stretches it to size. I move things only by
            transform and opacity, which spare the browser a new layout on every frame, so a shape takes its size from
            the stretch, not from its width and height. When a candle’s prices change, the four numbers change, and its
            body, wall and wick move to them together over 300 milliseconds.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.span(bucketPlacesSource, 'const of = (', 'export const bucketPlaces = {of};'), lines.blank,
            ...carve.unit(candleShapesSource, 'const drawn'), lines.blank,
            ...carve.unit(shapeAtSource, 'export const shapeAt')
          ]}/>
          <Snippet label="HTML" lines={[
            ...carve.span(candlesSource, '<svg className="candlesticks"', '</svg>'), lines.blank,
            ...carve.unit(barSource, 'export const Bar')
          ]}/>
          <Snippet label="CSS" lines={[
            ...carve.unit(candlesCss, '.wick {'), lines.blank,
            ...carve.unit(shapeCss, '.shape {'), lines.blank,
            ...carve.unit(drawingCss, '.drawn {'), lines.blank,
            ...carve.unit(drawingCss, '.buy-side {'), lines.blank,
            ...carve.unit(drawingCss, '.sell-side {'), lines.blank,
            ...carve.unit(drawingCss, '.side-face {'), lines.blank,
            ...carve.unit(drawingCss, '.side-wall {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Draw the volume under each candle">
        <Words want="A price move on little trading and one on heavy trading mean different things. The trader reads both at once.">
          <Says><code className="monospaced">candleShapes.volumes</code> draws a bar under each candle for how much was traded in
            that bucket. The tallest bar is the busiest bucket on the chart, and every other bar is in proportion to
            it.</Says>
          <Says>The bars are a second SVG under the candles, in the same places, so each bar sits under its
            candle.</Says>
          <Says>The volume bars wear volume-side with side-face and side-wall. A side’s colors are custom
            properties, values a style sheet names once and other rules read, and a side class sets them. volume-side
            sets leather for the bar and drab for its edge, and the bars read both through side-face and
            side-wall.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(candleShapesSource, 'const volumes')
          ]}/>
          <Snippet label="HTML" lines={[
            ...carve.span(candlesSource, '<svg className="volumes volume-side"', '</svg>')
          ]}/>
          <Snippet label="CSS" lines={[
            ...carve.unit(shapeCss, '.shape {'), lines.blank,
            ...carve.unit(drawingCss, '.volume-side {'), lines.blank,
            ...carve.unit(drawingCss, '.side-face {'), lines.blank,
            ...carve.unit(drawingCss, '.side-wall {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Use the same axes">
        <Words want="Candles with no labels are a shape, not a chart. They need their prices labeled and their time marked.">
          <Says>The same Axes wraps this chart. Its prices come from the highest high and the lowest low of the candles
            on show, and its time marks follow the period, as on the price line.</Says>
          <Says>Axes does one job, so every chart that has that job uses it.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.span(candlesSource, 'const extent = axisRange.of(', '  );'), lines.blank,
            ...carve.span(candlesSource, '<Axes extent', 'headroomMilliseconds={2 * bucketMilliseconds}>')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const PressureStory: FC = () =>
  <Story param="graph" id="pressure"
    can="The trader can see who is driving the move"
    soThat="a push and a retreat stop looking alike">
    <Tell>We could guess who is pushing from the direction of the price. But a rise on heavy buying and a rise because
      sellers stepped back draw the same line.</Tell>
    <Tell>So this chart reads something the feed already carries. Every trade has an order that was waiting and one that
      came and took it, and Coinbase marks each trade with the side of the one that was waiting. A trade marked sell is
      one a buyer took. The chart sums each minute into the size buyers took and the size sellers took.</Tell>
    <Tell>The fetched past is candles, and a candle doesn’t say who took a trade. So the chart counts only the trades
      that arrive while the page is open, and the page keeps the newest 1,500 of those.</Tell>
    <Steps>
      <Step title="Sum each minute by who took the trade">
        <Words want="Volume says how much was traded, never who pushed. The split has to survive the grouping.">
          <Says>The decoder accepts a match only if its side is buy or sell. Coinbase marks the side of the order that
            was waiting, so <code className="monospaced">takerSideOf</code> flips the mark to the side of the trader who
            took the trade: a mark of sell means a buyer took it. Every Trade keeps that as{' '}
          <code className="monospaced">takerSide</code>.</Says>
          <Says><code className="monospaced">pressureShapes.buckets</code> groups the trades into minutes and keeps two
            sums for each minute: the size buyers took and the size sellers took. The chart shows up to 60
            minutes.</Says>
          <Says><code className="monospaced">candles.bucketOpening</code> rounds a trade’s time down to the start of
            its minute, the same way the candles find theirs. For each
            trade, <code className="monospaced">buckets</code> looks at the last minute it has kept and finds it only
            when it started at that same time. <code className="monospaced">maybe</code> turns that find, which may
            come back empty, into a <TabLink to={DemoTopics.charts}>Maybe</TabLink>, a value that may be
            missing. <code className="monospaced">map</code> adds the trade to the minute when there is one,
            and <code className="monospaced">orElse</code> handles the case with
            none: <code className="monospaced">openedBy</code> starts a new minute with the trade.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(coinbaseSource, 'const MatchDecoder'), lines.blank,
            ...carve.unit(coinbaseSource, 'const takerSideOf'), lines.blank,
            ...carve.unit(pressureShapesSource, 'const fold'), lines.blank,
            ...carve.unit(candleSeriesSource, 'const bucketOpening'), lines.blank,
            ...carve.unit(pressureShapesSource, 'const openedBy'), lines.blank,
            ...carve.unit(pressureShapesSource, 'const buckets')
          ]}/>
        </Codes>
      </Step>
      <Step title="Scale both sides by the larger one">
        <Words want="The two sides can only be compared on one scale. A taller bar has to mean more size and nothing else.">
          <Says><code className="monospaced">pressureShapes.heaviestSide</code> finds the largest single side of any
            minute on the chart, and that sets the scale. Bought
            rises from the middle line and sold falls from it. A minute that bought four and sold two shows bars in that
            proportion.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.span(bucketPlacesSource, 'const of = (', 'export const bucketPlaces = {of};'), lines.blank,
            ...carve.unit(pressureShapesSource, 'const heaviestSide'), lines.blank,
            ...carve.unit(pressureShapesSource, 'const drawn')
          ]}/>
        </Codes>
      </Step>
      <Step title="Draw the bars, and label them in bitcoin">
        <Words want="The reader should see which side is larger at a glance, and the labels should give size, not dollars.">
          <Says>Each minute is a bar above a thin middle line for bought and a bar below it for sold: green above,
            orange below. The bought bars wear buy-side and the sold bars sell-side. A class, as
            the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink>{' '}
            says, is a name a style sheet’s rules pick out. These two are shared classes, looks that live in the site’s
            shared style sheet.</Says>
          <Says>A side class sets a side’s colors as custom properties, which
            the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> explains:
            values a style sheet names once and other rules read. side-face reads the face color for the bar. side-wall
            reads the wall color for the second rectangle set just behind it, which gives it an edge. The middle line
            wears drawn, which gives it its charcoal stroke.</Says>
          <Says>Each bar and the wall behind it start as a square one unit on a side. The markup gives each one four
            custom properties of its own: where it starts across, where its foot sits, how wide it is and how tall. The
            chart’s style sheet reads all four in one <Mdn path="Web/CSS/transform">transform</Mdn> that moves the
            square into place and stretches it to size. I move things only by transform and opacity, which spare the
            browser a new layout on every frame. When a minute’s sums change, its bars grow to their new size over 300
            milliseconds.</Says>
          <Says>Axes takes a function for its labels on this chart, so the scale reads in bitcoin instead of dollars.
            The caption says how many minutes are on show, up to the last 1,500 trades.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...carve.span(pressureComponent, '<svg className="pressures"', '</svg>')
          ]}/>
          <Snippet label="CSS" lines={[
            ...carve.unit(pressureCss, '.midline {'), lines.blank,
            ...carve.unit(shapeCss, '.shape {'), lines.blank,
            ...carve.unit(drawingCss, '.drawn {'), lines.blank,
            ...carve.unit(drawingCss, '.buy-side {'), lines.blank,
            ...carve.unit(drawingCss, '.sell-side {'), lines.blank,
            ...carve.unit(drawingCss, '.side-face {'), lines.blank,
            ...carve.unit(drawingCss, '.side-wall {')
          ]}/>
          <Snippet label="TS" lines={[
            ...carve.unit(moneySource, 'const bitcoin = ')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const PieStory: FC = () =>
  <Story param="graph" id="pie"
    can="The trader can see who owns the session"
    soThat="the whole pot reads in one circle">
    <Tell>The pie sums up to the last 1,500 trades as a whole: one slice for the size buyers took and one for the size
      sellers took.</Tell>
    <Tell>It counts only the trades that arrive while the page is open. The fetched past is candles, and a candle
      doesn’t say who took a trade.</Tell>
    <Tell>The circle has to move as the split changes, and move smoothly. So I make each slice from two half-discs that
      only ever rotate, and a share is how far they have turned into view.</Tell>
    <Steps>
      <Step title="Add up each side">
        <Words want="One number for each side. The pie asks nothing about time.">
          <Says><code className="monospaced">sideTotals</code> goes through every trade and adds its size to one of two
            sums, bought or sold, by its <code className="monospaced">takerSide</code>, which says whether a buyer or
            a seller took the trade. There are no minutes and no buckets here: the pie is a pair of totals.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(coinbaseSource, 'const takerSideOf'), lines.blank,
            ...carve.unit(pieSource, 'const sideTotals =')
          ]}/>
        </Codes>
      </Step>
      <Step title="Cut the circle with rotations only">
        <Words want="The shares have to become shapes that can move. A split that changes with every trade should turn smoothly, not jump.">
          <Says>You could paint the split with a conic gradient, a background that sweeps color round a point. But a
            painted background has no parts: nothing to label, nothing for a test to find, and nothing to give a class,
            which is a name a style sheet’s rules pick out, as the <TabLink to={DemoTopics.accordions}>accordions
              tab</TabLink> says.</Says>
          <Says>I tried arc paths next. An SVG arc carries a flag that flips when the arc passes half the circle, and a
            flag can’t be moved gradually, so a split that crosses half jumps.</Says>
          <Says>A dashed stroke on a circle can be moved gradually, but the browser has to draw the stroke again on
            every frame.</Says>
          <Says>A rotation is one angle, and a CSS transition, which moves a property from its old value to its new
            one over a set time, can move it smoothly; the shape is never rebuilt. So I build the
            cut from rotation alone.</Says>
          <Says>Each slice is two half-discs. Each half-disc sits behind its own window, a
            nested <Mdn path="Web/SVG/Element/svg">SVG viewport</Mdn>, that shows one half of the circle and hides the
            other.</Says>
          <Says>The first window shows the first half-turn of the slice, and the second shows the rest. A share is how
            far the two half-discs have turned into their windows, in degrees. A slice of less than half a turn leaves
            its second half-disc turned out of sight.</Says>
          <Says>A side that took everything is both half-discs fully in view. Nothing changes shape. Everything that
            moves is a rotation or a shift, each over 300 milliseconds.</Says>
          <Says>Each slice is also pushed a little way out from the center, along its own middle, unless it is the whole
            pie. And each is drawn twice, once a little lower, which gives the pie its edge.</Says>
          <Says>The markup passes each number to the style sheet as a custom property, such
            as <code className="monospaced">--turn</code>. A custom property is a value set by name on an element and
            read back in the style sheet with <code className="monospaced">var()</code>, as
            the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> explains. The style sheet declares each one
            with <code className="monospaced">@property</code>, a rule that gives a custom property a type and a
            starting value. The turn and the swing are angles, and the push out from the center is two lengths. Before
            the markup sets them, a slice sits unturned at the center.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(pieSource, 'const slices ='), lines.blank,
            ...carve.unit(pieSource, 'const sweepGates =')
          ]}/>
          <Snippet label="TS" lines={[
            ...carve.span(pieComponent, "{['wall', 'face'].map(dressed", '}))}')
          ]}/>
          <Snippet label="CSS" lines={[
            ...carve.unit(pieCss, '@property --explode-x {'), lines.blank,
            ...carve.unit(pieCss, '@property --explode-y {'), lines.blank,
            ...carve.unit(pieCss, '@property --turn {'), lines.blank,
            ...carve.unit(pieCss, '@property --swing {'), lines.blank,
            ...carve.unit(pieCss, '.slice {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Print each share">
        <Words want="A circle without numbers is only an impression. The trader wants the split in figures.">
          <Says>The legend prints each share as a whole percentage, in its slice’s color. The caption says what the pie
            is: the size traded on each side, up to the last 1,500 trades.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...carve.span(pieComponent, '<ul className="legend caption">', '</ul>')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const chartStories: Record<ChartKind, ReactNode> = {
  price: <PriceStory/>,
  candles: <CandlesStory/>,
  pressure: <PressureStory/>,
  pie: <PieStory/>
};

export const ChartStories: FC<{kind: ChartKind}> = ({kind}) =>
  <Stories>{chartStories[kind]}</Stories>;
