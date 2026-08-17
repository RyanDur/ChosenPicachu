import {lazy, Suspense, useState} from 'react';
import {randParagraph, randWord} from '@components/fibs';
import {useSearchParamsObject} from '@components/search-params';
import './style.css';
import './DemosPage.css';
import './Tutorials.css';
import {Tabs} from '@components/Tabs';
import {DialNote, Overview} from './Recipe';
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
  ListControls
} from './DragAndDrop';
import {DemoTopics, demoTopicParam} from './types';
import {NaturalZIndex, TopLayer} from './ZIndexDemo';
import {motionParam, originParam, paceParam} from './Controls';
import {Aggregations, trackParam, tutorialParam, worldParam} from './Tables';
import {Loading} from '@components/Loading';
import {useLiveTrades} from './Charts/useLiveTrades';
import {Workspace} from './Charts/Workspace';
import {useEnv} from '@components/Env';

const paragraphs = (count: number) =>
  [...new Set(Array.from({length: count * 3}, () => randWord()))].slice(0, count).map((key) => ({
    key,
    value: Array.from({length: Math.floor(Math.random() * 6) + 1}, () => randParagraph()).join('\n\n')
  }));

const Tutorials = lazy(() => import('./Tables/Tutorials').then(module => ({default: module.Tutorials})));
const NativeRecipe = lazy(() => import('./DragAndDrop/NativeRecipe').then(module => ({default: module.NativeRecipe})));
const ChartsTutorial = lazy(() => import('./Charts/Tutorial').then(module => ({default: module.ChartsTutorial})));
const TopLayerTutorial = lazy(() => import('./ZIndexDemo/Tutorial').then(module => ({default: module.TopLayerTutorial})));

export const DemosPage = () => {
  const {tab, pace = 'eager', origin = 'hide', motion = 'animated', tut = 'sort', track = 'pointer', world = 'react', updateSearchParams} =
    useSearchParamsObject(
      {tab: demoTopicParam, pace: paceParam, origin: originParam, motion: motionParam, tut: tutorialParam, track: trackParam, world: worldParam},
      {tab: DemoTopics.accordions});
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
                <li className='list-title'>Different styles of Accordions.</li>
                <li>
                  <InclusiveAccordion className='paper rounded-corners drop-shadow padded' content={accordionContents[0]}/>
                </li>
                <li>
                  <ExclusiveAccordion className='paper rounded-corners drop-shadow padded' content={accordionContents[1]}/>
                </li>
                <li className="exclusive">
                  <ExclusiveToggleAccordion className='paper rounded-corners drop-shadow padded' content={accordionContents[2]}/>
                </li>
                <li>
                  <ExclusiveCheckboxToggleAccordion className='paper rounded-corners drop-shadow padded' content={accordionContents[3]}/>
                </li>
                <li>
                  <ExclusiveRadioToggleAccordion className='paper rounded-corners drop-shadow padded' content={accordionContents[4]}/>
                </li>
              </ul>,
            [DemoTopics.zIndex]: <>
              <article>Z-Index Demo.</article>
              <NaturalZIndex className='paper rounded-corners drop-shadow padded'/>
              <TopLayer className='paper rounded-corners drop-shadow padded'/>
              <Suspense fallback={<Loading label="loading the tutorial"/>}>
                <TopLayerTutorial/>
              </Suspense>
            </>,
            [DemoTopics.charts]: <>
              <Workspace trades={liveTrades.trades} status={liveTrades.status} product={tradeProduct}/>
              <Suspense fallback={<Loading label="loading the tutorial"/>}>
                <ChartsTutorial/>
              </Suspense>
            </>,
            [DemoTopics.tables]: <>
              <Aggregations trades={liveTrades.trades} pace={pace} origin={origin} motion={motion} world={world}/>
              <Suspense fallback={<Loading label="loading the tutorial"/>}>
                <Tutorials shown={tut} onShow={next => updateSearchParams({tut: next})}
                           track={track} onTrack={next => updateSearchParams({track: next})}/>
              </Suspense>
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
              <section className="tutorials">
                <h2 className="tutorials-title">let’s build this feature</h2>
                <Overview builds="this site’s drag-and-drop list"
                          reads="list"
                          quote="I have a list, and the order is mine. When something belongs above something else, I want to pick it up and put it there, and see it land where I dropped it."
                          by="a user"/>
                <DialNote reads="list"/>
                <ListControls pace={pace} origin={origin} motion={motion}
                              onPace={next => updateSearchParams({pace: next})}
                              onOrigin={next => updateSearchParams({origin: next})}
                              onMotion={next => updateSearchParams({motion: next})}/>
                <Suspense fallback={<Loading label="loading the tutorial"/>}>
                  <NativeRecipe/>
                </Suspense>
              </section>
            </>
        })[tab ?? DemoTopics.accordions]}
      </section>
  </>;
};
