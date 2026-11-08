import {FC} from 'react';
import {Motion, Origin, Pace, useControls} from '../Controls';
import {Stories} from '../Recipe';
import {
  EagerHideAnimatedRecipe, EagerHideStaticRecipe, EagerKeepAnimatedRecipe, EagerKeepStaticRecipe,
  LazyHideAnimatedRecipe, LazyHideStaticRecipe, LazyKeepAnimatedRecipe, LazyKeepStaticRecipe
} from './Recipe';
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
  const {pace, origin, motion} = useControls();
  const Recipe = recipes[pace][origin][motion];
  return <section aria-label="build the native drag sort yourself" className="build-steps">
    <Stories>
      <Recipe/>
    </Stories>
  </section>;
};
