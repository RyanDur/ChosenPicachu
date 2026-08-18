import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {motionParam, originParam, paceParam} from '../Controls';
import {World, worldParam} from './params';
import {PillGlider} from '@components/PillGlider';
import {TableControls} from './TableControls';
import {Picks} from './Picks';
import {Recipe, Track} from './Recipe';
import {LayerMap} from './Recipe/LayerMap';
import {DialNote} from '../Recipe';
import {StoryClues} from './Recipe/StoryClues';
import {DesignAsk} from './Recipe/DesignAsk';
import {StorySlices} from './Recipe/StorySlices';
import {FlowTableRecipe, StillTableRecipe} from './Recipe/LivingTableRecipe';
import {MenuRecipe} from './Recipe/MenuRecipe';
import {ResizeRecipe} from './Recipe/ResizeRecipe';
import '../Tutorials.css';
import './Arc.css';

import {Tutorial} from './params';

export type {Tutorial} from './params';

export {tutorialParam} from './params';

const worldCopy: Record<World, string> = {
  react: 'React builds and rebuilds this table; the page you read is its render.',
  vanilla: 'The table stands in its own document: markup, stylesheet, and script, no framework.'
};

type Props = {
  shown: Tutorial;
  onShow: (tutorial: Tutorial) => void;
  track: Track;
  onTrack: (track: Track) => void;
};

export const Tutorials: FC<Props> = ({shown, onShow, track, onTrack}) => {
  const {pace = 'eager', origin = 'hide', motion = 'animated', world = 'react', updateSearchParams} =
    useSearchParamsObject({pace: paceParam, origin: originParam, motion: motionParam, world: worldParam});
  return <section className="tutorials">
    <header className="tutorials-header">
      <h2 className="tutorials-title">let’s build this feature</h2>
      <PillGlider label="world"
                  name="table-world"
                  options={[
                    {display: 'React', value: 'react'},
                    {display: 'Vanilla', value: 'vanilla'}
                  ]}
                  chosen={world}
                  onChoose={next => updateSearchParams({world: next})}/>
    </header>
    <p className="paragraph">{worldCopy[world]}</p>
    <ol className="spine">
      <li className="station">
        <StoryClues/>
      </li>
      <li className="station">
        <DesignAsk/>
      </li>
      <li className="station">
        <StorySlices/>
        <p className="overview paragraph">
          If you want the exercise, stop here and build the story yourself first. The table is
          our interpretation of that; the cards below break the interpretation into features.
          Open one to see how we built it, or to compare it with yours. The links go to MDN if
          you want more.
        </p>
      </li>
      <li className="station">
        <StillTableRecipe/>
      </li>
      <li className="station">
        <FlowTableRecipe/>
      </li>
      <li className="station">
        <h3 className="phase-title">Layer on functionality, in the order it was asked for</h3>
        <LayerMap/>
        <Picks label="tutorials"
               className="tutorial-picks"
               options={[
                 {display: 'Drag sort', value: 'sort'},
                 {display: 'Sort menu', value: 'menu'},
                 {display: 'Drag resize', value: 'resize'}
               ]}
               chosen={shown}
               onPick={onShow}/>
        {shown === 'sort' && <DialNote reads="table"/>}
        {shown === 'sort' && <TableControls pace={pace} origin={origin} motion={motion} world={world}
                                            onPace={next => updateSearchParams({pace: next})}
                                            onOrigin={next => updateSearchParams({origin: next})}
                                            onMotion={next => updateSearchParams({motion: next})}/>}
        {shown === 'sort' && <Recipe track={track} onTrack={onTrack}/>}
        {shown === 'menu' && <MenuRecipe/>}
        {shown === 'resize' && <ResizeRecipe/>}
      </li>
    </ol>
  </section>;
};
