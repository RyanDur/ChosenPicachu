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
import {LiveTrades} from '@components/live-trades';
import {Candles} from '@components/live-trades/Candles';
import {statusCopy, useLiveTrades} from '@components/live-trades/useLiveTrades';
import {useLiveSeed} from '@components/live-trades/useLiveSeed';
import {useEnv} from '@components/Env';

const paragraphs = (count: number) =>
  [...new Set(Array.from({length: count * 3}, () => randWord()))].slice(0, count).map((key) => ({
    key,
    value: Array.from({length: Math.floor(Math.random() * 6) + 1}, () => randParagraph()).join('\n\n')
  }));

export const DemosPage = () => {
  const {tab} = useSearchParamsObject({tab: demoTopicParam}, {tab: DemoTopics.accordions});
  const {tradeFeed, tradeProduct} = useEnv();
  const liveTrades = useLiveTrades(tradeFeed, tradeProduct);
  const liveSeed = useLiveSeed();

  return <>
      <Tabs
        label='demos'
        defaultTab={DemoTopics.accordions}
        values={[
          {display: 'Accordions', param: DemoTopics.accordions},
          {display: 'Z-Index', param: DemoTopics.zIndex},
          {display: 'Drag and Drop', param: DemoTopics.dragAndDrop},
          {display: 'Charts', param: DemoTopics.charts}
        ]}/>
      <section id='about'>
        {({
            [DemoTopics.accordions]:
              <ul className='accordions'>
                <li className='title'>Different styles of Accordions.</li>
                <li>
                  <InclusiveAccordion className='card' content={paragraphs(5)}/>
                </li>
                <li>
                  <ExclusiveAccordion className='card' content={paragraphs(5)}/>
                </li>
                <li className="exclusive">
                  <ExclusiveToggleAccordion className='card' content={paragraphs(5)}/>
                </li>
                <li>
                  <ExclusiveCheckboxToggleAccordion className='card' content={paragraphs(5)}/>
                </li>
                <li>
                  <ExclusiveRadioToggleAccordion className='card' content={paragraphs(5)}/>
                </li>
              </ul>,
            [DemoTopics.zIndex]: <>
              <article>Z-Index Demo.</article>
              <NaturalZIndex className='card'/>
            </>,
            [DemoTopics.charts]: <>
              <header className="charts-heading">
                <h2>{`Bitcoin, live — every ${tradeProduct} trade on Coinbase`}</h2>
                <output data-status={liveTrades.status}>{statusCopy[liveTrades.status]}</output>
              </header>
              <LiveTrades trades={liveTrades.trades} seed={liveSeed}/>
              <Candles trades={liveTrades.trades} seed={liveSeed}/>
            </>,
            [DemoTopics.dragAndDrop]: <>
              <h2>Sortable List</h2>
              <h3>Lazy Move</h3>
              <SortableListLazyMove list={new Set(['A', 'B', 'C'])}/>
              <h3>Eager Move</h3>
              <SortableListEagerMove list={new Set(['A', 'B', 'C'])}/>
              <h3>Hide and Lazy Move</h3>
              <HideElemOnDragSortableListLazyMove list={new Set(['A', 'B', 'C'])}/>
              <h3>Hide and Eager Move</h3>
              <HideElemOnDragSortableListEagerMove list={new Set(['A', 'B', 'C'])}/>
            </>
        })[tab ?? DemoTopics.accordions]}
      </section>
  </>;
};
