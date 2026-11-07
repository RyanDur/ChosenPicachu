import {FC, useId} from 'react';
import {Link} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import {LayerMap} from './Recipe/LayerMap';
import {Exercise, Station} from '../Recipe';
import {useArrival} from '@components/OpeningFragment';
import {StoryClues} from './Recipe/StoryClues';
import {DesignAsk} from './Recipe/DesignAsk';
import {StorySlices} from './Recipe/StorySlices';
import {FlowTableRecipe, StillTableRecipe} from './Recipe/LivingTableRecipe';
import {tableTutorials} from './tutorial-pages';
import {WorldGlider, WorldNote} from './World';
import '../Tutorials.css';
import './Tutorials.css';

const tutorials = tableTutorials();

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
      <Station at={5}>
        <FlowTableRecipe/>
      </Station>
      <Station at={6}>
        <h3 className="phase-title title">Layer on functionality, in the order it was asked for</h3>
        <LayerMap/>
        <ol className="tutorial-links">
          {tutorials.all().map(tutorial => <li key={tutorial}>
            <Link className="tutorial-link signpost reachable" to={`${tutorials.addressOf(tutorial)}${searchFromShown({})}`}>{tutorials.nameOf(tutorial)}</Link>
          </li>)}
        </ol>
      </Station>
    </ol>
  </section>;
};
