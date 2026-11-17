import {FC, useId} from 'react';
import {Link} from 'react-router';
import {useSearchParamsObject} from '@navigation/search-params';
import {DemoTopics, demoTab} from '@pages/Demos';
import {Aggregations} from './Aggregations';
import {Tutorial, tableTutorials} from './tutorial-pages';
import {WorldGlider, WorldNote} from './World';
import {useShownTutorial} from './useShownTutorial';
import {DragSortTutorial} from './DragSort';
import {MenuRecipe, ResizeRecipe} from './Recipe';
import {stations} from '@pages/Demos/headings';
import './TutorialPage.css';

const recipes: Record<Tutorial, FC> = {
  sort: DragSortTutorial,
  menu: MenuRecipe,
  resize: ResizeRecipe
};

export const TutorialPage: FC = () => {
  const {searchFromShown} = useSearchParamsObject({});
  const titled = `tutorial${useId()}`;
  return useShownTutorial().either(tutorial => {
    const {ordinal, outOf} = tableTutorials.placeOf(tutorial);
    const TutorialRecipe = recipes[tutorial];
    return <section aria-labelledby={titled} className="tutorial-page">
      <hgroup>
        <p className="caption">
          <Link className="signpost" to={`${demoTab.address(DemoTopics.tables)}${searchFromShown({})}`}>
            {demoTab.names[DemoTopics.tables]}
          </Link>
          {` · tutorial ${ordinal} of ${outOf}`}
        </p>
        <h2 id={titled} className="title">{tableTutorials.nameOf(tutorial)}</h2>
      </hgroup>
      <Aggregations/>
      <WorldGlider/>
      <WorldNote/>
      <p className="paragraph">
        This tutorial builds on the live table above. It starts where <Link className="signpost" to={{
          pathname: demoTab.address(DemoTopics.tables),
          search: searchFromShown({}),
          hash: stations.idOf(tableTutorials.startingStation)
        }}>
          station {tableTutorials.startingStation} of the tables tab
        </Link> ends,
        with the page’s store, the table’s own store and the actions each one takes through its dispatch. If
        those are new to you, read that station first.
      </p>
      <TutorialRecipe/>
    </section>;
  }, () => null);
};
