import {FC, lazy, ReactNode, Suspense} from 'react';
import {Navigate, useParams} from 'react-router';
import {useEnv} from '@components/Env';
import {Paths} from '@pages/Paths';
import {Loading} from '@components/Loading';
import {DemoTopics} from '../types';
import {useLiveTrades} from './useLiveTrades';
import {PriceChart} from './PriceChart';
import {Candles} from './Candles';
import {Pressure} from './Pressure';
import {Pie} from './Pie';
import {ChartKind, isChartKind, matchChartKind} from './kinds';
import '../Recipe/Recipe.css';
import '../Tutorials.css';
import './ChartPage.css';

type Feature = {
  kind: ChartKind;
  name: string;
  reference: string;
  quote: string;
};

const ChartStories = lazy(() => import('./Tutorial').then(module => ({default: module.ChartStories})));

const features: Record<ChartKind, Feature> = {
  price: {
    kind: 'price',
    name: 'price line',
    reference: 'https://en.wikipedia.org/wiki/Line_chart',
    quote: 'The ticker tells me now; it doesn’t tell me the way here. I want to glance up ' +
      'and know whether the market is climbing, stalling, or rolling over, without reading ' +
      'a single digit.'
  },
  candles: {
    kind: 'candles',
    name: 'candles',
    reference: 'https://en.wikipedia.org/wiki/Candlestick_chart',
    quote: 'The line smooths over the fight. A drift and a battle can draw the same shape, ' +
      'so I want each window to answer for itself: where it opened and closed, how far it ' +
      'reached, and how much conviction was underneath.'
  },
  pressure: {
    kind: 'pressure',
    name: 'pressure',
    reference: 'https://en.wikipedia.org/wiki/Order_flow_trading',
    quote: 'I can see the price move; I can’t see who is pushing it. When it breaks out, I ' +
      'want to know whether buyers drove it there or the sellers just stepped away.'
  },
  pie: {
    kind: 'pie',
    name: 'pie',
    reference: 'https://en.wikipedia.org/wiki/Pie_chart',
    quote: 'The bars tell me the battle, minute by minute. At the end I want the war: one ' +
      'circle, who owned the session.'
  }
};

export const ChartPage: FC = () => {
  const {kind} = useParams();
  const {tradeFeed, tradeProduct} = useEnv();
  const liveTrades = useLiveTrades(tradeFeed, tradeProduct);
  const page = ({kind: dealt, name, reference, quote}: Feature, chart: ReactNode) => () =>
    <article aria-label={`${name} tutorial`} className="chart-page tutorials">
    {chart}
    <h2 className="tutorials-title">let’s build this feature</h2>
    <p className="overview paragraph">
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
      links go to MDN
      if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic">{quote}</blockquote>
      <figcaption className="attribution">a trader</figcaption>
    </figure>
    <p className="overview paragraph">
      If you want the exercise, stop here and build the story yourself first. The chart
      above is our interpretation of that; the card below tells how we built it. Open it
      to see the steps, or to compare them with yours.
    </p>
    <section aria-label={`build the ${name} yourself`} className="build-steps">
      <Suspense fallback={<Loading label="loading the tutorial"/>}>
        <ChartStories kind={dealt}/>
      </Suspense>
    </section>
    </article>;
  return matchChartKind(isChartKind(kind) ? kind : undefined, {
    price: page(features.price, <PriceChart trades={liveTrades.trades}/>),
    candles: page(features.candles, <Candles trades={liveTrades.trades}/>),
    pressure: page(features.pressure, <Pressure trades={liveTrades.trades}/>),
    pie: page(features.pie, <Pie trades={liveTrades.trades}/>)
  }).orElse(<Navigate to={`${Paths.demos}?tab=${DemoTopics.charts}`} replace/>);
};
