import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {motionParam, originParam, paceParam} from '../Controls';
import {World, worldParam} from './params';
import {PillGlider} from '@components/PillGlider';

const worldCopy: Record<World, string> = {
  react: 'React builds and rebuilds this table; the page you read is its render.',
  vanilla: 'The table stands in its own document: markup, stylesheet, and script, no framework.'
};
import {TableControls} from './TableControls';
import {Picks} from './Picks';
import {Recipe, Track} from './Recipe';
import {Overview} from '../Recipe';
import {LivingTableRecipe} from './Recipe/LivingTableRecipe';
import {MenuRecipe} from './Recipe/MenuRecipe';
import {ResizeRecipe} from './Recipe/ResizeRecipe';
import '../Tutorials.css';

import {Tutorial} from './params';

export type {Tutorial} from './params';

export {tutorialParam} from './params';

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
    <Overview builds="this site’s live trading table"
              reads="table"
              quote="I watch the market all day. I need the numbers to keep themselves current, and I need them arranged the way I think: what I am comparing side by side, what matters most on top. When I sort something, it should just happen."
              by="a trader"/>
    <LivingTableRecipe/>
    <Picks label="tutorials"
           className="tutorial-picks"
           options={[
             {display: 'Drag sort', value: 'sort'},
             {display: 'Sort menu', value: 'menu'},
             {display: 'Drag resize', value: 'resize'}
           ]}
           chosen={shown}
           onPick={onShow}/>
    {shown === 'sort' && <TableControls pace={pace} origin={origin} motion={motion} world={world}
                                        onPace={next => updateSearchParams({pace: next})}
                                        onOrigin={next => updateSearchParams({origin: next})}
                                        onMotion={next => updateSearchParams({motion: next})}/>}
    {shown === 'sort' && <Recipe track={track} onTrack={onTrack}/>}
    {shown === 'menu' && <MenuRecipe/>}
    {shown === 'resize' && <ResizeRecipe/>}
  </section>;
};
