import {FC} from 'react';
import {TrackDial, useControls} from '../../Controls';
import {Stories} from '../../Recipe';
import {EagerRecipe} from './EagerRecipe';
import {LazyRecipe} from './LazyRecipe';
import '../../Recipe/Recipe.css';

export const Recipe: FC = () => {
  const {pace} = useControls();
  const Chosen = pace === 'eager' ? EagerRecipe : LazyRecipe;
  return <section aria-label="build the drag sort yourself" className="build-steps">
    <TrackDial/>
    <Stories><Chosen/></Stories>
  </section>;
};
