import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {ControlsProps, Motion, Origin, Pace} from '../Controls';
import {Stories} from '../Recipe';
import {Dials} from './Recipe/shared-steps';
import {EagerKeepAnimatedRecipe} from './Recipe/EagerKeepAnimated';
import {EagerKeepStaticRecipe} from './Recipe/EagerKeepStatic';
import {EagerHideAnimatedRecipe} from './Recipe/EagerHideAnimated';
import {EagerHideStaticRecipe} from './Recipe/EagerHideStatic';
import {LazyKeepAnimatedRecipe} from './Recipe/LazyKeepAnimated';
import {LazyKeepStaticRecipe} from './Recipe/LazyKeepStatic';
import {LazyHideAnimatedRecipe} from './Recipe/LazyHideAnimated';
import {LazyHideStaticRecipe} from './Recipe/LazyHideStatic';
import '../Recipe/Recipe.css';

const recipes: Record<Pace, Record<Origin, Record<Motion, FC<Dials>>>> = {
  eager: {
    keep: {animated: EagerKeepAnimatedRecipe, static: EagerKeepStaticRecipe},
    hide: {animated: EagerHideAnimatedRecipe, static: EagerHideStaticRecipe}
  },
  lazy: {
    keep: {animated: LazyKeepAnimatedRecipe, static: LazyKeepStaticRecipe},
    hide: {animated: LazyHideAnimatedRecipe, static: LazyHideStaticRecipe}
  }
};

export const NativeRecipe: FC<ControlsProps> = ({pace, origin, motion, onPace, onOrigin, onMotion}) => {
  const Recipe = recipes[pace][origin][motion];
  const dials: Dials = {
    pace: <PillGlider label="pace"
                      name="native-pace"
                      options={[
                        {display: 'Eager', value: 'eager'},
                        {display: 'Lazy', value: 'lazy'}
                      ]}
                      chosen={pace}
                      onChoose={onPace}/>,
    origin: <PillGlider label="origin"
                        name="native-origin"
                        options={[
                          {display: 'Keep', value: 'keep'},
                          {display: 'Hide', value: 'hide'}
                        ]}
                        chosen={origin}
                        onChoose={onOrigin}/>,
    motion: <PillGlider label="motion"
                        name="native-motion"
                        options={[
                          {display: 'Animate', value: 'animated'},
                          {display: 'Static', value: 'static'}
                        ]}
                        chosen={motion}
                        onChoose={onMotion}/>
  };
  return <section aria-label="build the native drag sort yourself" className="build-steps">
    <Stories>
      <Recipe {...dials}/>
    </Stories>
  </section>;
};
