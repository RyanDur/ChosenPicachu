import {FC} from 'react';
import {TrackDial, useControls} from '../../Controls';
import {Stories} from '../../Recipe';
import {SortStories} from './SortStories';
import {EagerPace, LazyPace} from './steps';
import {eagerBuild} from './eagerBuild';
import {lazyBuild} from './lazyBuild';
import '../../Recipe/Recipe.css';

export const Recipe: FC = () => {
  const {pace} = useControls();
  return <section aria-label="build the drag sort yourself" className="build-steps">
    <TrackDial/>
    <Stories>{pace === 'eager'
      ? <SortStories build={eagerBuild}>
        <EagerPace headerSource={eagerBuild.headerSource} buildSource={eagerBuild.buildSource}/>
      </SortStories>
      : <SortStories build={lazyBuild}>
        <LazyPace headerSource={lazyBuild.headerSource} paceSource={lazyBuild.paceSource}
          buildSource={lazyBuild.buildSource}/>
      </SortStories>}</Stories>
  </section>;
};
