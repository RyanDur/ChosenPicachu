import {FC} from 'react';
import {Stories} from '../Recipe';
import {NativeStories} from './Recipe';
import '../Recipe/Recipe.css';

export const NativeRecipe: FC = () =>
  <section aria-label="build the native drag sort yourself" className="build-steps">
    <Stories>
      <NativeStories/>
    </Stories>
  </section>;
