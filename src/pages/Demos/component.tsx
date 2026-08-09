import {useState} from 'react';
import {randParagraph, randWord} from '@ngneat/falso';
import {useSearchParamsObject} from '@components/search-params';
import './style.css';
import './DemosPage.css';
import {Tabs} from '@components/Tabs';
import {
  ExclusiveAccordion,
  ExclusiveToggleAccordion,
  ExclusiveCheckboxToggleAccordion,
  InclusiveAccordion,
  ExclusiveRadioToggleAccordion
} from './Accordions';
import {
  EagerHideAnimatedList, EagerHideStaticList, EagerKeepAnimatedList, EagerKeepStaticList,
  LazyHideAnimatedList, LazyHideStaticList, LazyKeepAnimatedList, LazyKeepStaticList,
  ListControls, NativeRecipe
} from './DragAndDrop';
import {DemoTopics, demoTopicParam} from './types';
import {NaturalZIndex} from './ZIndexDemo';
import {Candles, PriceChart} from './Charts';
import {Menu} from '@components/Menu';
import * as D from 'schemawax';
import {motionParam, originParam, paceParam} from './Controls';
import {Aggregations, Tutorials, trackParam, tutorialParam} from './Tables';
import {statusCopy, useLiveTrades} from './Charts/useLiveTrades';
import {useEnv} from '@components/Env';

const paragraphs = (count: number) =>
  [...new Set(Array.from({length: count * 3}, () => randWord()))].slice(0, count).map((key) => ({
    key,
    value: Array.from({length: Math.floor(Math.random() * 6) + 1}, () => randParagraph()).join('\n\n')
  }));

type ChartKind = 'price' | 'candles';

export const DemosPage = () => {
  const {tab, pace = 'eager', origin = 'hide', motion = 'animated', tut = 'sort', track = 'pointer', charts = 'price', updateSearchParams} =
    useSearchParamsObject(
      {tab: demoTopicParam, pace: paceParam, origin: originParam, motion: motionParam, tut: tutorialParam, track: trackParam, charts: D.string},
      {tab: DemoTopics.accordions});
  const isChartKind = (kind: string): kind is ChartKind => kind === 'price' || kind === 'candles';
  const dealtCharts = charts.split(',').filter(isChartKind);
  const chartKinds: readonly ChartKind[] = dealtCharts.length > 0 ? dealtCharts : ['price'];
  const addChart = (kind: ChartKind) => () =>
    updateSearchParams({charts: [...chartKinds, kind].join(',')});
  const [accordionContents] = useState(() => Array.from({length: 5}, () => paragraphs(5)));
  const {tradeFeed, tradeProduct} = useEnv();
  const liveTrades = useLiveTrades(tradeFeed, tradeProduct);

  return <>
      <Tabs
        label='demos'
        defaultTab={DemoTopics.accordions}
        values={[
          {display: 'Accordions', param: DemoTopics.accordions},
          {display: 'Z-Index', param: DemoTopics.zIndex},
          {display: 'Drag sort', param: DemoTopics.dragAndDrop},
          {display: 'Charts', param: DemoTopics.charts},
          {display: 'Tables', param: DemoTopics.tables}
        ]}/>
      <section id='about'>
        {({
            [DemoTopics.accordions]:
              <ul className='accordions'>
                <li className='title'>Different styles of Accordions.</li>
                <li>
                  <InclusiveAccordion className='card' content={accordionContents[0]}/>
                </li>
                <li>
                  <ExclusiveAccordion className='card' content={accordionContents[1]}/>
                </li>
                <li className="exclusive">
                  <ExclusiveToggleAccordion className='card' content={accordionContents[2]}/>
                </li>
                <li>
                  <ExclusiveCheckboxToggleAccordion className='card' content={accordionContents[3]}/>
                </li>
                <li>
                  <ExclusiveRadioToggleAccordion className='card' content={accordionContents[4]}/>
                </li>
              </ul>,
            [DemoTopics.zIndex]: <>
              <article>Z-Index Demo.</article>
              <NaturalZIndex className='card'/>
            </>,
            [DemoTopics.charts]: <>
              <header className="charts-heading">
                <h2 className="headline">{`Bitcoin, live — every ${tradeProduct} trade on Coinbase`}</h2>
                <output className="status" data-status={liveTrades.status}>{statusCopy[liveTrades.status]}</output>
              </header>
              {chartKinds.map((kind, at) => kind === 'price'
                ? <PriceChart key={at} trades={liveTrades.trades}/>
                : <Candles key={at} trades={liveTrades.trades}/>)}
              <Menu id="add-chart" label="Add a chart" toggle="+"
                    toggleClassName="add-chart button secondary">
                <button type="button" className="item" onClick={addChart('price')}>Price line</button>
                <button type="button" className="item" onClick={addChart('candles')}>Candles</button>
              </Menu>
            </>,
            [DemoTopics.tables]: <>
              <Aggregations trades={liveTrades.trades} pace={pace} origin={origin} motion={motion}/>
              <Tutorials shown={tut} onShow={next => updateSearchParams({tut: next})}
                         track={track} onTrack={next => updateSearchParams({track: next})}
                         pace={pace} origin={origin} motion={motion}
                         onPace={next => updateSearchParams({pace: next})}
                         onOrigin={next => updateSearchParams({origin: next})}
                         onMotion={next => updateSearchParams({motion: next})}/>
            </>,
            [DemoTopics.dragAndDrop]: <>
              {(() => {
                const lists = {
                  eager: {
                    keep: {animated: EagerKeepAnimatedList, static: EagerKeepStaticList},
                    hide: {animated: EagerHideAnimatedList, static: EagerHideStaticList}
                  },
                  lazy: {
                    keep: {animated: LazyKeepAnimatedList, static: LazyKeepStaticList},
                    hide: {animated: LazyHideAnimatedList, static: LazyHideStaticList}
                  }
                };
                const List = lists[pace][origin][motion];
                return <List list={new Set(['A', 'B', 'C'])}/>;
              })()}
              <div className="tutorials">
                <h2 className="tutorials-title">let’s build this feature</h2>
                <p className="overview">
                  We are going to build this site’s drag-and-drop list, feature by feature.
                  Here is how to use this page: every card below is a feature, told as
                  a <a className="signpost"
                    href="https://initialcapacity.io/insights/user-story"
                    target="_blank"
                    rel="noreferrer">user story</a>. Open a card and you get the plan for that
                  feature and the steps that build it, with the real code from this site, so
                  what you read is what runs. The dials change which list you are reading
                  about, and Eager, Lazy, Keep, Hide, Animate, and Static are this page’s
                  names for the choices, not platform keywords. Where a step depends on a
                  dial, that dial sits on the step. The dashed code is the wrong way you would
                  probably try first, and the links go to MDN if you want more.
                </p>
                <figure className="feedback">
                  <blockquote className="quote">
                    I have a list, and the order is mine. When something belongs above
                    something else, I want to pick it up and put it there, and see it land
                    where I dropped it.
                  </blockquote>
                  <figcaption className="attribution">a user</figcaption>
                </figure>
                <p className="overview">
                  If you want the exercise, stop here and build the story yourself first. The
                  list is our interpretation of that; the cards below break the
                  interpretation into features. Open one to see how we built it, or to
                  compare it with yours.
                </p>
                <ListControls pace={pace} origin={origin} motion={motion}
                              onPace={next => updateSearchParams({pace: next})}
                              onOrigin={next => updateSearchParams({origin: next})}
                              onMotion={next => updateSearchParams({motion: next})}/>
                <NativeRecipe pace={pace} origin={origin} motion={motion}
                              onPace={next => updateSearchParams({pace: next})}
                              onOrigin={next => updateSearchParams({origin: next})}
                              onMotion={next => updateSearchParams({motion: next})}/>
              </div>
            </>
        })[tab ?? DemoTopics.accordions]}
      </section>
  </>;
};
