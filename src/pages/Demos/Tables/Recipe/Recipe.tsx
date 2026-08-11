import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Picks} from '../Picks';
import {Motion, Origin, Pace, motionParam, originParam, paceParam} from '../../Controls';
import {Stories} from '../../Recipe';
import {Track} from './shared-steps';
import {EagerKeepAnimatedRecipe} from './EagerKeepAnimated';
import {EagerKeepStaticRecipe} from './EagerKeepStatic';
import {EagerHideAnimatedRecipe} from './EagerHideAnimated';
import {EagerHideStaticRecipe} from './EagerHideStatic';
import {LazyKeepAnimatedRecipe} from './LazyKeepAnimated';
import {LazyKeepStaticRecipe} from './LazyKeepStatic';
import {LazyHideAnimatedRecipe} from './LazyHideAnimated';
import {LazyHideStaticRecipe} from './LazyHideStatic';
import '../../Recipe/Recipe.css';

export type {Track} from './shared-steps';
export {trackParam} from './shared-steps';

const recipes: Record<Pace, Record<Origin, Record<Motion, FC<{track: Track}>>>> = {
  eager: {
    keep: {animated: EagerKeepAnimatedRecipe, static: EagerKeepStaticRecipe},
    hide: {animated: EagerHideAnimatedRecipe, static: EagerHideStaticRecipe}
  },
  lazy: {
    keep: {animated: LazyKeepAnimatedRecipe, static: LazyKeepStaticRecipe},
    hide: {animated: LazyHideAnimatedRecipe, static: LazyHideStaticRecipe}
  }
};

type Props = {
  track: Track;
  onTrack: (track: Track) => void;
};

export const Recipe: FC<Props> = ({track, onTrack}) => {
  const {pace = 'eager', origin = 'hide', motion = 'animated'} =
    useSearchParamsObject({pace: paceParam, origin: originParam, motion: motionParam});
  const Chosen = recipes[pace][origin][motion];
  return <section aria-label="build the drag sort yourself" className="build-steps">
    <Picks label="input track"
           className="track-picks"
           options={[
             {display: 'By pointer', value: 'pointer'},
             {display: 'By keyboard', value: 'keyboard'}
           ]}
           chosen={track}
           onPick={onTrack}/>
    <Stories><Chosen track={track}/></Stories>
  </section>;
};
