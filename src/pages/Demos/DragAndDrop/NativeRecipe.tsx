import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Motion, Origin, Pace, motionParam, originParam, paceParam} from '../Controls';
import {Stories} from '../Recipe';
import {EagerKeepAnimatedRecipe} from './Recipe/EagerKeepAnimated';
import {EagerKeepStaticRecipe} from './Recipe/EagerKeepStatic';
import {EagerHideAnimatedRecipe} from './Recipe/EagerHideAnimated';
import {EagerHideStaticRecipe} from './Recipe/EagerHideStatic';
import {LazyKeepAnimatedRecipe} from './Recipe/LazyKeepAnimated';
import {LazyKeepStaticRecipe} from './Recipe/LazyKeepStatic';
import {LazyHideAnimatedRecipe} from './Recipe/LazyHideAnimated';
import {LazyHideStaticRecipe} from './Recipe/LazyHideStatic';
import '../Recipe/Recipe.css';

const recipes: Record<Pace, Record<Origin, Record<Motion, FC>>> = {
  eager: {
    keep: {animated: EagerKeepAnimatedRecipe, static: EagerKeepStaticRecipe},
    hide: {animated: EagerHideAnimatedRecipe, static: EagerHideStaticRecipe}
  },
  lazy: {
    keep: {animated: LazyKeepAnimatedRecipe, static: LazyKeepStaticRecipe},
    hide: {animated: LazyHideAnimatedRecipe, static: LazyHideStaticRecipe}
  }
};

export const NativeRecipe: FC = () => {
  const {pace = 'eager', origin = 'hide', motion = 'animated'} =
    useSearchParamsObject({pace: paceParam, origin: originParam, motion: motionParam});
  const Recipe = recipes[pace][origin][motion];
  return <section aria-label="build the native drag sort yourself" className="build-steps">
    <Stories>
      <Recipe/>
    </Stories>
  </section>;
};
