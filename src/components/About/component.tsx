import {faker} from '@faker-js/faker';
import {maybe, nothing, some} from '@ryandur/sand';
import {useSearchParams} from 'react-router-dom';
import {useSearchParamsObject} from '../hooks';
import './style.css';
import './AboutPage.css';
import '../../routes/BasePage.css';
import {Tabs} from '../Tabs';
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
import {AboutTopics, isATopic} from './types';
import {NaturalZIndex} from './ZIndexDemo';
import '../../routes/BasePage.layout.css';

const paragraphs = (count: number) =>
  faker.helpers.uniqueArray(faker.lorem.word, count).map((key) => ({
    key,
    value: faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)
  }));

export const AboutPage = () => {
  const [searchParams] = useSearchParams();
  const {tab} = useSearchParamsObject<{ tab: string }>();

  return <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">About {tab}</h1>
    </header>

    <main data-testid="main" className='in-view'>
      <Tabs
        role='demo-tabs'
        defaultTab={AboutTopics.accordions}
        values={[
          {display: 'Accordions', param: AboutTopics.accordions},
          {display: 'Z-Index', param: AboutTopics.zIndex},
          {display: 'Drag and Drop', param: AboutTopics.dragAndDrop}
        ]}/>
      <section id='about'>
        {maybe(searchParams.get('tab'))
          .mBind(possibleTopic => isATopic(possibleTopic)
            ? some(possibleTopic as AboutTopics)
            : nothing())
          .or(() => some(AboutTopics.accordions))
          .map(tab => ({
            [AboutTopics.accordions]:
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
            [AboutTopics.zIndex]: <>
              <article>Z-Index Demo.</article>
              <NaturalZIndex className='card'/>
            </>,
            [AboutTopics.dragAndDrop]: <>
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
          }[tab])).orNull()}
      </section>
    </main>
  </>;
};
