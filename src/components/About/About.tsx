import {NaturalZIndex} from './ZIndexDemo';
import {ExclusiveAccordion, InclusiveAccordion} from './Accordions';
import {faker} from '@faker-js/faker';
import {AboutTopics, isATopic} from './types';
import {useSearchParams} from 'react-router-dom';
import {maybe, nothing, some} from '@ryandur/sand';
import {
  SortableListLazyMove,
  HideElemOnDragSortableListLazyMove,
  HideElemOnDragSortableListEagerMove,
  SortableListEagerMove
} from './DragAndDrop';
import './style.css';

const paragraphs = (count: number) =>
  [...Array(count)].map((_, id) => ({
    key: String(id),
    value: faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)
  }));

export const About = () => {
  const [searchParams] = useSearchParams();

  return <section id='about'>
    {maybe(searchParams.get('tab'))
      .mBind(possibleTopic => isATopic(possibleTopic)
        ? some(possibleTopic as AboutTopics)
        : nothing())
      .or(() => some(AboutTopics.accordions))
      .map(tab => ({
        [AboutTopics.accordions]: <>
          <article>Different styles of Accordions.</article>
          <InclusiveAccordion className='card' content={paragraphs(5)}/>
          <ExclusiveAccordion className='card' content={paragraphs(5)}/>
        </>,
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
  </section>;
};
