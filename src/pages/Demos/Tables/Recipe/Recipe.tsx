import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {Picks} from '../Picks';
import {Motion, Origin, Pace} from '../../Controls';
import {Stories} from '../../Recipe';
import {Dials, Track} from './shared-steps';
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

const recipes: Record<Pace, Record<Origin, Record<Motion, FC<{dials: Dials; track: Track}>>>> = {
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
  pace: Pace;
  origin: Origin;
  motion: Motion;
  onPace: (pace: Pace) => void;
  onOrigin: (origin: Origin) => void;
  onMotion: (motion: Motion) => void;
};

export const Recipe: FC<Props> = ({track, onTrack, pace, origin, motion, onPace, onOrigin, onMotion}) => {
  const dials: Dials = {
    pace: <PillGlider label="pace"
                      name="step-pace"
                      options={[
                        {display: 'Eager', value: 'eager'},
                        {display: 'Lazy', value: 'lazy'}
                      ]}
                      chosen={pace}
                      onChoose={onPace}/>,
    origin: <PillGlider label="origin"
                        name="step-origin"
                        options={[
                          {display: 'Keep', value: 'keep'},
                          {display: 'Hide', value: 'hide'}
                        ]}
                        chosen={origin}
                        onChoose={onOrigin}/>,
    motion: <PillGlider label="motion"
                        name="step-motion"
                        options={[
                          {display: 'Animate', value: 'animated'},
                          {display: 'Static', value: 'static'}
                        ]}
                        chosen={motion}
                        onChoose={onMotion}/>
  };
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
    <Stories><Chosen dials={dials} track={track}/></Stories>
  </section>;
};
