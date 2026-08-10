import {FC} from 'react';
import {Navigate, useParams} from 'react-router';
import {useEnv} from '@components/Env';
import {Paths} from '@pages/Paths';
import {StoryList} from '../Recipe';
import {DemoTopics} from '../types';
import {useLiveTrades} from './useLiveTrades';
import {PriceChart} from './PriceChart';
import {Candles} from './Candles';
import {Pressure} from './Pressure';
import {Pie} from './Pie';
import {candlesStory, pieStory, pressureStory, priceStory} from './Tutorial';
import {ChartKind, isChartKind, matchChartKind} from './kinds';
import {StoryEntry} from '../Recipe/StepList';
import {Trade} from './coinbase';
import '../Recipe/Recipe.css';
import '../Tutorials.css';
import './ChartPage.css';

type Feature = {
  name: string;
  chart: FC<{trades: readonly Trade[]}>;
  reference: string;
  story: StoryEntry;
  quote: string;
};

const features: Record<ChartKind, Feature> = {
  price: {
    name: 'price line',
    chart: PriceChart,
    reference: 'https://en.wikipedia.org/wiki/Line_chart',
    story: priceStory,
    quote: 'The ticker tells me now; it doesn’t tell me the way here. I want to glance up ' +
      'and know whether the market is climbing, stalling, or rolling over, without reading ' +
      'a single digit.'
  },
  candles: {
    name: 'candles',
    chart: Candles,
    reference: 'https://en.wikipedia.org/wiki/Candlestick_chart',
    story: candlesStory,
    quote: 'The line smooths over the fight. A drift and a battle can draw the same shape, ' +
      'so I want each window to answer for itself: where it opened and closed, how far it ' +
      'reached, and how much conviction was underneath.'
  },
  pressure: {
    name: 'pressure',
    chart: Pressure,
    reference: 'https://en.wikipedia.org/wiki/Order_flow_trading',
    story: pressureStory,
    quote: 'I can see the price move; I can’t see who is pushing it. When it breaks out, I ' +
      'want to know whether buyers drove it there or the sellers just stepped away.'
  },
  pie: {
    name: 'pie',
    chart: Pie,
    reference: 'https://en.wikipedia.org/wiki/Pie_chart',
    story: pieStory,
    quote: 'The bars tell me the battle, minute by minute. At the end I want the war: one ' +
      'circle, who owned the session.'
  }
};

export const ChartPage: FC = () => {
  const {kind} = useParams();
  const {tradeFeed, tradeProduct} = useEnv();
  const liveTrades = useLiveTrades(tradeFeed, tradeProduct);
  const page = ({name, reference, story, quote, chart: Chart}: Feature) => () =>
    <article aria-label={`${name} tutorial`} className="chart-page tutorials">
    <Chart trades={liveTrades.trades}/>
    <h2 className="tutorials-title">let’s build this feature</h2>
    <p className="overview">
      We are going to build the <a
        className="signpost"
        href={reference}
        target="_blank"
        rel="noreferrer">{name}</a> above. The card below tells it as a <a
        className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>: open it and you get the plan and the steps that
      build it, with the real code from this site, so what you read is what runs. The
      dashed code is the wrong way you would probably try first, and the links go to MDN
      if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote">{quote}</blockquote>
      <figcaption className="attribution">a trader</figcaption>
    </figure>
    <p className="overview">
      If you want the exercise, stop here and build the story yourself first. The chart
      above is our interpretation of that; the card below tells how we built it. Open it
      to see the steps, or to compare them with yours.
    </p>
    <section aria-label={`build the ${name} yourself`} className="build-steps">
      <StoryList param="graph" stories={[story]}/>
    </section>
    </article>;
  return matchChartKind(isChartKind(kind) ? kind : undefined, {
    price: page(features.price),
    candles: page(features.candles),
    pressure: page(features.pressure),
    pie: page(features.pie)
  }).orElse(<Navigate to={`${Paths.demos}?tab=${DemoTopics.charts}`} replace/>);
};
