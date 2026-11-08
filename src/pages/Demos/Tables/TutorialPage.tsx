import {FC, useId} from 'react';
import {Link} from 'react-router';
import {useSearchParamsObject} from '@navigation/search-params';
import {useArrival} from '@navigation/arrival';
import {demoAddress, DemoTopics, topicNames} from '../types';
import {Aggregations} from './Aggregations';
import {Tutorial, tableTutorials} from './tutorial-pages';
import {WorldGlider, WorldNote} from './World';
import {useShownTutorial} from './useShownTutorial';
import {DragSortTutorial} from './DragSort';
import {MenuRecipe, ResizeRecipe} from './Recipe';
import {stations} from '../Recipe';
import './TutorialPage.css';

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
    return <section aria-labelledby={titled} className="tutorial-page">
      <hgroup>
        <p className="caption">
          <Link className="signpost" to={`${demoAddress(DemoTopics.tables)}${searchFromShown({})}`}>
            {topicNames[DemoTopics.tables]}
          </Link>
          {` · tutorial ${number} of ${of}`}
        </p>
        <h2 id={titled} className="title">{tableTutorials.nameOf(tutorial)}</h2>
      </hgroup>
      <Aggregations/>
      <WorldGlider/>
      <WorldNote/>
      <p className="paragraph">
        This tutorial builds on the live table above. It starts where{' '}
        <Link className="signpost" to={{
          pathname: demoAddress(DemoTopics.tables),
          search: searchFromShown({}),
          hash: stations.idOf(tableTutorials.startingStation)
        }}>
          station {tableTutorials.startingStation} of the tables tab
        </Link>{' '}
        ends, with the page’s store, the table’s own store and the actions each one takes through its dispatch. If
        those are new to you, read that station first.
      </p>
      <Body/>
    </section>;
  }, () => null);
};
