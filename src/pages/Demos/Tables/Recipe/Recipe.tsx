import {FC} from 'react';
import {TrackDial, useControls} from '../../Controls';
import {Stories} from '../../Recipe';
import {SortStories} from './SortStories';
import {eagerBuild} from './eagerBuild';
import {lazyBuild} from './lazyBuild';
import '../../Recipe/Recipe.css';

export const Recipe: FC = () => {
  const {pace} = useControls();
  return <section aria-label="build the drag sort yourself" className="build-steps">
    <TrackDial/>
    <Stories><SortStories build={pace === 'eager' ? eagerBuild : lazyBuild}/></Stories>
  </section>;
};
