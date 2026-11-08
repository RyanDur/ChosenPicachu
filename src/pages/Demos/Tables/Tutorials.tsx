import {FC, useId} from 'react';
import {Link} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import {DesignAsk, FlowTableRecipe, LayerMap, StillTableRecipe, StoryClues, StorySlices} from './Recipe';
import {Exercise, Station} from '../Recipe';
import {useArrival} from '@components/OpeningFragment';
import {tableTutorials} from './tutorial-pages';
import {WorldGlider, WorldNote} from './World';
import '../Tutorials.css';
import './Tutorials.css';

export const Tutorials: FC = () => {
  const {searchFromShown} = useSearchParamsObject({});
  useArrival();
  const titled = `tutorials${useId()}`;
  return <section aria-labelledby={titled} className="tutorials">
    <header className="tutorials-header">
      <h2 id={titled} className="title">let’s build this feature</h2>
      <WorldGlider/>
    </header>
    <WorldNote/>
    <ol className="spine" aria-label="the stations">
      <Station at={1}>
        <StoryClues/>
      </Station>
      <Station at={2}>
        <DesignAsk/>
      </Station>
      <Station at={3}>
        <StorySlices/>
        <Exercise/>
      </Station>
      <Station at={4}>
        <StillTableRecipe/>
      </Station>
      <Station at={tableTutorials.startingStation}>
        <FlowTableRecipe/>
      </Station>
      <Station at={6}>
        <h3 className="phase-title title">Layer on functionality, in the order it was asked for</h3>
        <LayerMap/>
        <p className="paragraph">
          Drag sort builds the first two layers, moving a column and moving a row. Sort menu builds the third,
          ranking by a measure, and Drag resize builds the fourth, widening a column.
        </p>
        <ol className="tutorial-links" aria-label="the tutorials">
          {tableTutorials.all().map(tutorial => <li key={tutorial}>
            <Link className="tutorial-link signpost reachable" to={`${tableTutorials.addressOf(tutorial)}${searchFromShown({})}`}>{tableTutorials.nameOf(tutorial)}</Link>
          </li>)}
        </ol>
      </Station>
    </ol>
  </section>;
};
