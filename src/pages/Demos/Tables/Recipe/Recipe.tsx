import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Picks} from '../Picks';
import {defaultDials, motionParam, originParam, paceParam} from '../../Controls';
import {trackParam, worldParam} from '../params';
import {Stories} from '../../Recipe';
import {EagerRecipe} from './EagerRecipe';
import {LazyRecipe} from './LazyRecipe';
import '../../Recipe/Recipe.css';

export const Recipe: FC = () => {
  const {pace, origin, motion, world = 'react', track = 'pointer', updateSearchParams} =
    useSearchParamsObject(
      {pace: paceParam, origin: originParam, motion: motionParam, world: worldParam, track: trackParam},
      defaultDials
    );
  const Chosen = pace === 'eager' ? EagerRecipe : LazyRecipe;
  return <section aria-label="build the drag sort yourself" className="build-steps">
    <Picks label="input track"
      size="paragraph"
      options={[
        {display: 'By pointer', value: 'pointer'},
        {display: 'By keyboard', value: 'keyboard'}
      ]}
      chosen={track}
      onPicked={next => updateSearchParams({track: next})}/>
    <Stories><Chosen track={track} world={world} origin={origin} motion={motion}/></Stories>
  </section>;
};
