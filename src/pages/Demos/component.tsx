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
import {DragSortList, ListControls} from './DragAndDrop';
import {DemoTopics, demoTopicParam} from './types';
import {NaturalZIndex} from './ZIndexDemo';
import {Candles, PriceChart} from './Charts';
import {motionParam, originParam, paceParam, styled} from './Controls';
import {Aggregations, Tutorials, trackParam, tutorialParam} from './Tables';
import {statusCopy, useLiveTrades} from './Charts/useLiveTrades';
import {useEnv} from '@components/Env';

const paragraphs = (count: number) =>
  [...new Set(Array.from({length: count * 3}, () => randWord()))].slice(0, count).map((key) => ({
    key,
    value: Array.from({length: Math.floor(Math.random() * 6) + 1}, () => randParagraph()).join('\n\n')
  }));

export const DemosPage = () => {
  const {tab, pace = 'eager', origin = 'hide', motion = 'animated', tut = 'sort', track = 'pointer', updateSearchParams} =
    useSearchParamsObject(
      {tab: demoTopicParam, pace: paceParam, origin: originParam, motion: motionParam, tut: tutorialParam, track: trackParam},
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
          {display: 'Drag and Drop', param: DemoTopics.dragAndDrop},
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
              <PriceChart trades={liveTrades.trades}/>
              <Candles trades={liveTrades.trades}/>
            </>,
            [DemoTopics.tables]: <>
              <Aggregations trades={liveTrades.trades} dragStyle={styled(pace, origin)}
                            animated={motion === 'animated'}/>
              <Tutorials shown={tut} onShow={next => updateSearchParams({tut: next})}
                         track={track} onTrack={next => updateSearchParams({track: next})}
                         pace={pace} origin={origin} motion={motion}
                         onPace={next => updateSearchParams({pace: next})}
                         onOrigin={next => updateSearchParams({origin: next})}
                         onMotion={next => updateSearchParams({motion: next})}/>
            </>,
            [DemoTopics.dragAndDrop]: <>
              <DragSortList list={new Set(['A', 'B', 'C'])}
                            dragStyle={styled(pace, origin)}
                            animated={motion === 'animated'}/>
              <div className="tutorials">
                <h2 className="tutorials-title">how it’s built</h2>
                <ListControls pace={pace} origin={origin} motion={motion}
                              onPace={next => updateSearchParams({pace: next})}
                              onOrigin={next => updateSearchParams({origin: next})}
                              onMotion={next => updateSearchParams({motion: next})}/>
              </div>
            </>
        })[tab ?? DemoTopics.accordions]}
      </section>
  </>;
};
