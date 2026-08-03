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
  HideElemOnDragSortableListEagerMove,
  HideElemOnDragSortableListLazyMove,
  SortableListEagerMove,
  SortableListLazyMove
} from './DragAndDrop';
import {DemoTopics, demoTopicParam} from './types';
import {NaturalZIndex} from './ZIndexDemo';
import {Candles, PriceChart} from './Charts';
import {Aggregations} from './Tables';
import {PillGlider} from '@components/PillGlider';
import {DragStyle} from '@components/DragSortableTable';
import {statusCopy, useLiveTrades} from './Charts/useLiveTrades';
import {useEnv} from '@components/Env';

const paragraphs = (count: number) =>
  [...new Set(Array.from({length: count * 3}, () => randWord()))].slice(0, count).map((key) => ({
    key,
    value: Array.from({length: Math.floor(Math.random() * 6) + 1}, () => randParagraph()).join('\n\n')
  }));

export const DemosPage = () => {
  const {tab} = useSearchParamsObject({tab: demoTopicParam}, {tab: DemoTopics.accordions});
  const [accordionContents] = useState(() => Array.from({length: 5}, () => paragraphs(5)));
  const [dragStyle, setDragStyle] = useState<DragStyle>('eager-move');
  const [tableMotion, setTableMotion] = useState<'animated' | 'static'>('static');
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
              <header className="table-styles">
                <PillGlider label="drag style"
                            name="column-drag-style"
                            options={[
                              {display: 'Eager', value: 'eager-move'},
                              {display: 'Lazy', value: 'lazy-move'},
                              {display: 'Hide Eager', value: 'hide-eager-move'},
                              {display: 'Hide Lazy', value: 'hide-lazy-move'}
                            ]}
                            chosen={dragStyle}
                            onChoose={setDragStyle}/>
                <PillGlider label="animation style"
                            name="table-animate-or-static"
                            options={[
                              {display: 'Animate', value: 'animated'},
                              {display: 'Static', value: 'static'}
                            ]}
                            chosen={tableMotion}
                            onChoose={setTableMotion}/>
              </header>
              <Aggregations trades={liveTrades.trades} dragStyle={dragStyle}
                            animated={tableMotion === 'animated'}/>
            </>,
            [DemoTopics.dragAndDrop]: <>
              <h2 className="heading">Sortable List</h2>
              <h3 className="subheading">Lazy Move</h3>
              <SortableListLazyMove list={new Set(['A', 'B', 'C'])}/>
              <h3 className="subheading">Eager Move</h3>
              <SortableListEagerMove list={new Set(['A', 'B', 'C'])}/>
              <h3 className="subheading">Hide and Lazy Move</h3>
              <HideElemOnDragSortableListLazyMove list={new Set(['A', 'B', 'C'])}/>
              <h3 className="subheading">Hide and Eager Move</h3>
              <HideElemOnDragSortableListEagerMove list={new Set(['A', 'B', 'C'])}/>
            </>
        })[tab ?? DemoTopics.accordions]}
      </section>
  </>;
};
