import {FC} from 'react';
import {Picks} from '../Picks';
import {useControls} from '../../Controls';
import {Stories} from '../../Recipe';
import {EagerRecipe} from './EagerRecipe';
import {LazyRecipe} from './LazyRecipe';
import '../../Recipe/Recipe.css';

export const Recipe: FC = () => {
  const {pace, track, change} = useControls();
  const Chosen = pace === 'eager' ? EagerRecipe : LazyRecipe;
  return <section aria-label="build the drag sort yourself" className="build-steps">
    <Picks label="input track"
      size="paragraph"
      options={[
        {display: 'By pointer', value: 'pointer'},
        {display: 'By keyboard', value: 'keyboard'}
      ]}
      chosen={track}
      onPicked={next => change({track: next})}/>
    <Stories><Chosen/></Stories>
  </section>;
};
