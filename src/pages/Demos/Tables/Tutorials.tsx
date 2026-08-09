import {FC} from 'react';
import * as D from 'schemawax';
import {Motion, Origin, Pace} from '../Controls';
import {TableControls} from './TableControls';
import {Picks} from './Picks';
import {Recipe, Track} from './Recipe';
import {LivingTable} from './Recipe/LivingTable';
import {MenuRecipe} from './Recipe/MenuRecipe';
import {ResizeRecipe} from './Recipe/ResizeRecipe';
import './Tutorials.css';

export type Tutorial = 'sort' | 'menu' | 'resize';

export const tutorialParam: D.Decoder<Tutorial> = D.literalUnion('sort', 'menu', 'resize');

type Props = {
  shown: Tutorial;
  onShow: (tutorial: Tutorial) => void;
  track: Track;
  onTrack: (track: Track) => void;
  pace: Pace;
  origin: Origin;
  motion: Motion;
  onPace: (pace: Pace) => void;
  onOrigin: (origin: Origin) => void;
  onMotion: (motion: Motion) => void;
};

export const Tutorials: FC<Props> = ({shown, onShow, track, onTrack, ...props}) =>
  <div className="tutorials">
    <h2 className="tutorials-title">let’s build this feature</h2>
    <p className="overview">
      We are going to build this site’s live trading table, feature by feature. Here is how to
      use this page: every card below is a feature, told as a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>. Open a card and you
      get the plan for that feature and the steps that build it, with the real code from this
      site, so what you read is what runs. The dials change which table you are reading
      about, and Eager, Lazy, Keep, Hide, Animate, and Static are this page’s names for the
      choices, not platform keywords. Where a step depends on a dial, that dial sits on the step. The dashed code is the wrong way you would probably try first, and the
      links go to MDN if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote">
        I watch the market all day. I need the numbers to keep themselves current, and I need
        them arranged the way I think: what I am comparing side by side, what matters most on
        top. When I sort something, it should just happen.
      </blockquote>
      <figcaption className="attribution">a trader</figcaption>
    </figure>
    <p className="overview">
      The table is our interpretation of that. The cards below break the interpretation into
      features; open one to see how we built it.
    </p>
    <LivingTable/>
    <Picks label="tutorials"
           className="tutorial-picks"
           options={[
             {display: 'Drag sort', value: 'sort'},
             {display: 'Sort menu', value: 'menu'},
             {display: 'Drag resize', value: 'resize'}
           ]}
           chosen={shown}
           onPick={onShow}/>
    {shown === 'sort' && <TableControls {...props}/>}
    {shown === 'sort' && <Recipe track={track} onTrack={onTrack} {...props}/>}
    {shown === 'menu' && <MenuRecipe pace={props.pace} origin={props.origin}
                                     motion={props.motion} onMotion={props.onMotion}/>}
    {shown === 'resize' && <ResizeRecipe/>}
  </div>;
