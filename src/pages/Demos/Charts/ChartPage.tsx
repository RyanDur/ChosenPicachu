import {FC} from 'react';
import {Navigate, useParams} from 'react-router';
import {DemoTopics} from '../demo-topics';
import {demoTab} from '../demo-tab';
import {TabLink} from '@pages/Demos/TabLink';
import {marketReads} from '../Market';
import {useMarketRead} from '../Market/Trading';
import {PriceChart} from './PriceChart';
import {Candles} from './Candles';
import {Pressure} from './Pressure';
import {Pie} from './Pie';
import {useDesk} from './useDesk';
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

const LivePrice: FC = () => {
  const {periodOf, choosePeriod} = useDesk();
  return <PriceChart trades={useMarketRead(marketReads.liveTrades)}
    period={periodOf('price')} onPeriodChosen={period => choosePeriod('price', period)}/>;
};
const LiveCandles: FC = () => {
  const {periodOf, choosePeriod} = useDesk();
  return <Candles trades={useMarketRead(marketReads.liveTrades)}
    period={periodOf('candles')} onPeriodChosen={period => choosePeriod('candles', period)}/>;
};
const LivePressure: FC = () => <Pressure trades={useMarketRead(marketReads.liveTrades)}/>;
const LivePie: FC = () => <Pie trades={useMarketRead(marketReads.liveTrades)}/>;

const features: Record<ChartKind, Feature> = {
  price: {
    name: 'price line',
    reference: 'https://en.wikipedia.org/wiki/Line_chart',
    chart: LivePrice,
    quote: 'The ticker tells me now; it doesn’t tell me the way here. I want to glance up ' +
      'and know whether the market is climbing, stalling, or rolling over, without reading ' +
      'a single digit.'
  },
  candles: {
    name: 'candles',
    reference: 'https://en.wikipedia.org/wiki/Candlestick_chart',
    chart: LiveCandles,
    quote: 'The line smooths over the fight. A drift and a battle can draw the same shape, ' +
      'so I want each bucket of time to answer for itself: where it opened and closed, how far it ' +
      'reached, and how much conviction was underneath.'
  },
  pressure: {
    name: 'pressure',
    reference: 'https://en.wikipedia.org/wiki/Order_flow_trading',
    chart: LivePressure,
    quote: 'I can see the price move; I can’t see who is pushing it. When it breaks out, I ' +
      'want to know whether buyers drove it there or the sellers just stepped away.'
  },
  pie: {
    name: 'pie',
    reference: 'https://en.wikipedia.org/wiki/Pie_chart',
    chart: LivePie,
    quote: 'The bars tell me the battle, minute by minute. At the end I want the war: one ' +
      'circle, who owned the session.'
  }
};

type Props = {kind: ChartKind};

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
        rel="noreferrer">user story</a>, a card, a conversation and a confirmation, which the{' '}
      <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> walks through: open it and you get the plan and the steps
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
  </article>;
};

export const ChartPage: FC = () => {
  const {kind} = useParams();
  return chartKinds.is(kind)
    ? <ChartKindTutorial kind={kind}/>
    : <Navigate to={demoTab.address(DemoTopics.charts)} replace/>;
};
