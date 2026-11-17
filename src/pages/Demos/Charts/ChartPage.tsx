import {FC} from 'react';
import {Link, Navigate, useParams} from 'react-router';
import {maybe} from '@ryandur/sand';
import {DemoTopics, demoTab} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {PriceChart} from './PriceChart';
import {Candles} from './Candles';
import {Pressure} from './Pressure';
import {Pie} from './Pie';
import {ChartKind, chartKinds} from './chart-kinds';
import {StoryDepth} from '../Recipe';
import {ChartStories} from './ChartStories';
import '../Recipe/Recipe.css';
import '../Tutorials.css';
import './ChartPage.css';

type Feature = {
  name: string;
  reference: string;
  quote: string;
  chart: FC;
};

const features: Record<ChartKind, Feature> = {
  price: {
    name: 'price line',
    reference: 'https://en.wikipedia.org/wiki/Line_chart',
    chart: PriceChart,
    quote: 'The ticker tells me now; it doesn’t tell me the way here. I want to glance up ' +
      'and know whether the market is climbing, stalling, or rolling over, without reading ' +
      'a single digit.'
  },
  candles: {
    name: 'candles',
    reference: 'https://en.wikipedia.org/wiki/Candlestick_chart',
    chart: Candles,
    quote: 'The line smooths over the fight. A drift and a battle can draw the same shape, ' +
      'so I want each bucket of time to answer for itself: where it opened and closed, how far it ' +
      'reached, and how much conviction was underneath.'
  },
  pressure: {
    name: 'pressure',
    reference: 'https://en.wikipedia.org/wiki/Order_flow_trading',
    chart: Pressure,
    quote: 'I can see the price move; I can’t see who is pushing it. When it breaks out, I ' +
      'want to know whether buyers drove it there or the sellers just stepped away.'
  },
  pie: {
    name: 'pie',
    reference: 'https://en.wikipedia.org/wiki/Pie_chart',
    chart: Pie,
    quote: 'The bars tell me the battle, minute by minute. At the end I want the war: one ' +
      'circle, who owned the session.'
  }
};

type Props = {kind: ChartKind};

const numbered = (kind: ChartKind): string => `${chartKinds.all.indexOf(kind) + 1}. ${chartKinds.names[kind]}`;

const Neighbors: FC<Props> = ({kind}) => {
  const at = chartKinds.all.indexOf(kind);
  return <nav className="chart-neighbors" aria-label="the chart pages">
    {maybe(chartKinds.all[at - 1]).map(before =>
      <Link key={before} className="signpost" rel="prev" to={chartKinds.address(before)}>{`Previous: ${numbered(before)}`}</Link>).orNull()}
    {maybe(chartKinds.all[at + 1]).map(after =>
      <Link key={after} className="onward signpost" rel="next" to={chartKinds.address(after)}>{`Next: ${numbered(after)}`}</Link>).orNull()}
  </nav>;
};

const ChartKindTutorial: FC<Props> = ({kind}) => {
  const {name, reference, quote, chart: Chart} = features[kind];
  return <article aria-labelledby={`tutorial-${kind}`} className="chart-page tutorials">
    <h2 id={`tutorial-${kind}`} className="off-screen">{`${name} tutorial`}</h2>
    <Chart/>
    <h3 className="title">let’s build this feature</h3>
    <p className="overview paragraph">
      We are going to build the <a className="signpost"
        href={reference}
        target="_blank"
        rel="noreferrer">{name}</a> above. The card below tells it as a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>, a card, a conversation and a confirmation, which the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> walks through: open it and you get the plan and the steps
      that build it, with the real code from this site, so what you read is what runs. The steps build on
      the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> and link to MDN, Mozilla’s web reference, if
      you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic trim-bar-beside">{quote}</blockquote>
      <figcaption className="attribution caption muted-ink">a trader</figcaption>
    </figure>
    <p className="overview paragraph">
      If you want the exercise, stop here and build the story yourself first. The chart
      above is my interpretation of that; the card below tells how I built it. Open it
      to see the steps, or to compare them with yours.
    </p>
    <section aria-label={`build the ${name} yourself`} className="build-steps">
      <StoryDepth.Provider value={4}>
        <ChartStories kind={kind}/>
      </StoryDepth.Provider>
    </section>
    <Neighbors kind={kind}/>
  </article>;
};

export const ChartPage: FC = () => {
  const {kind} = useParams();
  return chartKinds.is(kind)
    ? <ChartKindTutorial kind={kind}/>
    : <Navigate to={demoTab.address(DemoTopics.charts)} replace/>;
};
