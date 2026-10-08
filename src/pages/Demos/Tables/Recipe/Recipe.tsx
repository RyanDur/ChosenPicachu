import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Picks} from '../Picks';
import {motionParam, originParam, paceParam} from '../../Controls';
import {worldParam} from '../params';
import {Stories} from '../../Recipe';
import {Track} from './steps';
import {EagerRecipe} from './EagerRecipe';
import {LazyRecipe} from './LazyRecipe';
import '../../Recipe/Recipe.css';

export type {Track} from './steps';
export {trackParam} from './steps';

type Props = {
  track: Track;
  onTrackChosen: (track: Track) => void;
};

export const Recipe: FC<Props> = ({track, onTrackChosen}) => {
  const {pace = 'eager', origin = 'hide', motion = 'animated', world = 'react'} =
    useSearchParamsObject({pace: paceParam, origin: originParam, motion: motionParam, world: worldParam});
  const Chosen = pace === 'eager' ? EagerRecipe : LazyRecipe;
  return <section aria-label="build the drag sort yourself" className="build-steps">
    <Picks label="input track"
      size="paragraph"
      options={[
        {display: 'By pointer', value: 'pointer'},
        {display: 'By keyboard', value: 'keyboard'}
      ]}
      chosen={track}
      onPicked={onTrackChosen}/>
    <Stories><Chosen track={track} world={world} origin={origin} motion={motion}/></Stories>
  </section>;
};
