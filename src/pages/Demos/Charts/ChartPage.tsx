import {FC} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {PartOpening} from '@pages/Demos/PartOpening';
import {PartPanel} from '@pages/Demos/PartPanel';
import {PartDemo} from '@pages/Demos/PartDemo';
import {demoTab, DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {PartLink} from '@pages/Demos/ZIndexDemo';
import {Behind, Beside, Onward, PartFoot} from '@pages/Demos/PartFoot';
import {PriceChart} from './PriceChart';
import {Candles} from './Candles';
import {Pressure} from './Pressure';
import {Pie} from './Pie';
import {ChartKind, chartKinds} from './chart-kinds';
import {StoryDepth} from '../Recipe';
import {ChartStories} from './ChartStories';
import {PartsAndMinutes} from './PartsAndMinutes';
import '../Recipe/Recipe.css';
import '../Tutorials.css';

type Feature = {
  reference: string;
  quote: string;
  chart: FC;
};

const features: Record<ChartKind, Feature> = {
  price: {
    reference: 'https://en.wikipedia.org/wiki/Line_chart',
    chart: PriceChart,
    quote: 'The ticker tells me now; it doesn’t tell me the way here. I want to glance up ' +
      'and know whether the market is climbing, stalling, or rolling over, without reading ' +
      'a single digit.'
  },
  candles: {
    reference: 'https://en.wikipedia.org/wiki/Candlestick_chart',
    chart: Candles,
    quote: 'The line smooths over the fight. A drift and a battle can draw the same shape, ' +
      'so I want each bucket of time to answer for itself: where it opened and closed, how far it ' +
      'reached, and how much conviction was underneath.'
  },
  pressure: {
    reference: 'https://en.wikipedia.org/wiki/Order_flow_trading',
    chart: Pressure,
    quote: 'I can see the price move; I can’t see who is pushing it. When it breaks out, I ' +
      'want to know whether buyers drove it there or the sellers just stepped away.'
  },
  pie: {
    reference: 'https://en.wikipedia.org/wiki/Pie_chart',
    chart: Pie,
    quote: 'The bars tell me the battle, minute by minute. At the end I want the war: one ' +
      'circle, who owned the session.'
  }
};

const besideKind = (kind: ChartKind): Beside =>
  ({kind: 'part', title: chartKinds.numbered(kind), address: chartKinds.address(kind)});

const thePreviousTab: Behind = {kind: 'tab', topic: DemoTopics.dragAndDrop};
const theLastChart: Onward = {kind: 'last-part-unsaid'};

export const ChartPage: FC<{readonly kind: ChartKind}> = ({kind}) => {
  const {reference, quote, chart: Chart} = features[kind];
  const name = chartKinds.names[kind];
  const place = `${demoTab.names[DemoTopics.charts]} · part ${chartKinds.ordinalOf(kind)} of ${chartKinds.all.length}`;
  const behind = chartKinds.previous(kind).map((beside): Behind => besideKind(beside)).orElse(thePreviousTab);
  const onward = chartKinds.next(kind).map((beside): Onward => besideKind(beside)).orElse(theLastChart);
  return <PartSection heading={`${name} tutorial`}>
    <PartOpening place={place}><p className="paragraph">{chartKinds.told[kind].says}</p></PartOpening>
    <PartPanel><PartsAndMinutes/></PartPanel>
    <PartDemo wears="tutorials">
      <Chart/>
      <h3 className="title">let’s build this feature</h3>
      <p className="overview paragraph">
        We are going to build the <a className="signpost"
          href={reference}
          target="_blank"
          rel="noreferrer">{name.toLowerCase()}</a> above. The card below tells it as a <a className="signpost"
          href="https://initialcapacity.io/insights/user-story"
          target="_blank"
          rel="noreferrer">user story</a>, a card, a conversation and a confirmation, as taught in the z-index
        part <PartLink part="lets-build-this-feature"/>. Open the card and you get the plan and the steps
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
      <section aria-label={`build the ${name.toLowerCase()} yourself`} className="build-steps">
        <StoryDepth.Provider value={4}>
          <ChartStories kind={kind}/>
        </StoryDepth.Provider>
      </section>
    </PartDemo>
    <PartFoot previous={behind} next={onward}/>
  </PartSection>;
};
