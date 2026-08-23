import {useState} from 'react';
import {randParagraph, randWord} from '@components/fibs';
import {useSearchParamsObject} from '@components/search-params';
import './style.css';
import './DemosPage.css';
import './Tutorials.css';
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
  LazyHideAnimatedList, LazyHideStaticList, LazyKeepAnimatedList, LazyKeepStaticList
} from './DragAndDrop';
import {DemoTopics, demoTopicParam} from './types';
import {NaturalZIndex, TopLayer} from './ZIndexDemo';
import {Tutorials} from './Tables/Tutorials';
import {ListTutorials} from './DragAndDrop/Tutorials';
import {ChartsTutorial} from './Charts/Tutorial';
import {TopLayerTutorial} from './ZIndexDemo/Tutorial';
import {motionParam, originParam, paceParam} from './Controls';
import {Aggregations, trackParam, tutorialParam, worldParam} from './Tables';
import {useLiveTrades} from './Charts/useLiveTrades';
import {Workspace} from './Charts/Workspace';
import {useEnv} from '@components/Env';

const paragraphs = (count: number) =>
  [...new Set(Array.from({length: count * 3}, () => randWord()))].slice(0, count).map((key) => ({
    key,
    value: Array.from({length: Math.floor(Math.random() * 6) + 1}, () => randParagraph()).join('\n\n')
  }));

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
                  <InclusiveAccordion className='white rounded-corners lifted padded' content={accordionContents[0]}/>
                </li>
                <li>
                  <ExclusiveAccordion className='white rounded-corners lifted padded' content={accordionContents[1]}/>
                </li>
                <li className="exclusive">
                  <ExclusiveToggleAccordion className='white rounded-corners lifted padded' content={accordionContents[2]}/>
                </li>
                <li>
                  <ExclusiveCheckboxToggleAccordion className='white rounded-corners lifted padded' content={accordionContents[3]}/>
                </li>
                <li>
                  <ExclusiveRadioToggleAccordion className='white rounded-corners lifted padded' content={accordionContents[4]}/>
                </li>
              </ul>,
            [DemoTopics.zIndex]: <>
              <article>Z-Index Demo.</article>
              <NaturalZIndex className='white rounded-corners lifted padded'/>
              <TopLayer className='white rounded-corners lifted padded'/>
              <TopLayerTutorial/>
            </>,
            [DemoTopics.charts]: <>
              <Workspace trades={liveTrades.trades} status={liveTrades.status} product={tradeProduct}/>
              <ChartsTutorial/>
            </>,
            [DemoTopics.tables]: <>
              <Aggregations trades={liveTrades.trades} pace={pace} origin={origin} motion={motion} world={world}/>
              <Tutorials shown={tut} onShow={next => updateSearchParams({tut: next})}
                         track={track} onTrack={next => updateSearchParams({track: next})}/>
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
              <ListTutorials/>
            </>
        })[tab ?? DemoTopics.accordions]}
      </section>
  </>;
};
