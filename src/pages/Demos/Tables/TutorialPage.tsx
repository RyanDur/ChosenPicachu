import {FC, useId} from 'react';
import {Link} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import {useArrival} from '@components/OpeningFragment';
import {demoAddress, DemoTopics, topicNames} from '../types';
import {Aggregations} from './Aggregations';
import {Tutorial, tableTutorials} from './tutorial-pages';
import {WorldGlider, WorldNote} from './World';
import {useShownTutorial} from './useShownTutorial';
import {DragSortTutorial} from './DragSort';
import {MenuRecipe, ResizeRecipe} from './Recipe';
import '../Tutorials.css';

const bodies: Record<Tutorial, FC> = {
  sort: DragSortTutorial,
  menu: MenuRecipe,
  resize: ResizeRecipe
};

export const TutorialPage: FC = () => {
  const {searchFromShown} = useSearchParamsObject({});
  const titled = `tutorial${useId()}`;
  useArrival();
  return useShownTutorial().either(tutorial => {
    const {number, of} = tableTutorials.placeOf(tutorial);
    const Body = bodies[tutorial];
    return <section aria-labelledby={titled}>
      <p className="caption">
        <Link className="signpost" to={`${demoAddress(DemoTopics.tables)}${searchFromShown({})}`}>
          {topicNames[DemoTopics.tables]}
        </Link>
        {` · tutorial ${number} of ${of}`}
      </p>
      <h2 id={titled} className="title">{tableTutorials.nameOf(tutorial)}</h2>
      <Aggregations/>
      <WorldGlider/>
      <WorldNote/>
      <Body/>
    </section>;
  }, () => null);
};
