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
    <p className="overview paragraph">
      We are going to build this site’s live trading table, feature by feature. Here is how to
      use this page: every card below is a feature, told as a <a className="signpost"
                                                                 href="https://initialcapacity.io/insights/user-story"
                                                                 target="_blank"
                                                                 rel="noreferrer">user story</a>. Open a card and you
      get the plan for that feature and the steps that build it, with the real code from this
      site, so what you read is what runs. The dials change which table you are reading
      about, and Eager, Lazy, Keep, Hide, Animate, and Static are this page’s names for the
      choices, not platform keywords. Where a step depends on a dial, that dial sits on the step. The
      links go to MDN if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic">
        I watch the market all day. I need the numbers to keep themselves current, and I need
        them arranged the way I think: what I am comparing side by side, what matters most on
        top. When I sort something, it should just happen.
      </blockquote>
      <figcaption className="attribution">a trader</figcaption>
    </figure>
    <p className="overview paragraph">
      If you want the exercise, stop here and build the story yourself first. The table is
      our interpretation of that; the cards below break the interpretation into features.
      Open one to see how we built it, or to compare it with yours.
    </p>
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
