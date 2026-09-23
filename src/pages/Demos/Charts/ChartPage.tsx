import {FC, ReactNode} from 'react';
import {Navigate, useParams} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../types';
import {useDemosSelector} from '../Provider';
import {selectLiveTrades} from '../store';
import {PriceChart} from './PriceChart';
import {Candles} from './Candles';
import {Pressure} from './Pressure';
import {Pie} from './Pie';
import {useDesk} from './useDesk';
import {ChartKind, isChartKind, matchChartKind} from './kinds';
import {Ranks} from '../Recipe';
import {ChartStories} from './Tutorial';
import '../Recipe/Recipe.css';
import '../Tutorials.css';
import './ChartPage.css';

type Feature = {
  name: string;
  reference: string;
  quote: string;
};

const underTheBuild: Ranks = {story: 'h4', step: 'h5'};

const features: Record<ChartKind, Feature> = {
  price: {
    name: 'price line',
    reference: 'https://en.wikipedia.org/wiki/Line_chart',
    quote: 'The ticker tells me now; it doesn’t tell me the way here. I want to glance up ' +
      'and know whether the market is climbing, stalling, or rolling over, without reading ' +
      'a single digit.'
  },
  candles: {
    name: 'candles',
    reference: 'https://en.wikipedia.org/wiki/Candlestick_chart',
    quote: 'The line smooths over the fight. A drift and a battle can draw the same shape, ' +
      'so I want each window to answer for itself: where it opened and closed, how far it ' +
      'reached, and how much conviction was underneath.'
  },
  pressure: {
    name: 'pressure',
    reference: 'https://en.wikipedia.org/wiki/Order_flow_trading',
    quote: 'I can see the price move; I can’t see who is pushing it. When it breaks out, I ' +
      'want to know whether buyers drove it there or the sellers just stepped away.'
  },
  pie: {
    name: 'pie',
    reference: 'https://en.wikipedia.org/wiki/Pie_chart',
    quote: 'The bars tell me the battle, minute by minute. At the end I want the war: one ' +
      'circle, who owned the session.'
  }
};

const LivePrice: FC = () => {
  const {periodOf, choosePeriod} = useDesk();
  return <PriceChart trades={useDemosSelector(selectLiveTrades)}
    period={periodOf('price')} onPeriod={period => choosePeriod('price', period)}/>;
};
const LiveCandles: FC = () => {
  const {periodOf, choosePeriod} = useDesk();
  return <Candles trades={useDemosSelector(selectLiveTrades)}
    period={periodOf('candles')} onPeriod={period => choosePeriod('candles', period)}/>;
};
const LivePressure: FC = () => <Pressure trades={useDemosSelector(selectLiveTrades)}/>;
const LivePie: FC = () => <Pie trades={useDemosSelector(selectLiveTrades)}/>;

export const ChartPage: FC = () => {
  const {kind} = useParams();
  const page = (dealt: ChartKind, chart: ReactNode) => () => {
    const {name, reference, quote} = features[dealt];
    return <article aria-labelledby={`tutorial-${dealt}`} className="chart-page tutorials">
      <h2 id={`tutorial-${dealt}`} className="off-screen">{`${name} tutorial`}</h2>
      {chart}
      <h3 className="tutorials-title">let’s build this feature</h3>
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
        <Ranks.Provider value={underTheBuild}>
          <ChartStories kind={dealt}/>
        </Ranks.Provider>
      </section>
    </article>;
  };
  return matchChartKind(isChartKind(kind) ? kind : undefined, {
    price: page('price', <LivePrice/>),
    candles: page('candles', <LiveCandles/>),
    pressure: page('pressure', <LivePressure/>),
    pie: page('pie', <LivePie/>)
  }).orElse(<Navigate to={`${Paths.demos}?tab=${DemoTopics.charts}`} replace/>);
};
