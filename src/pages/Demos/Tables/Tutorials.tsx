import {FC} from 'react';
import * as D from 'schemawax';
import {Controls, Motion, Origin, Pace} from './Controls';
import {Picks} from './Picks';
import {Recipe, Track} from './Recipe';
import {ResizeRecipe} from './Recipe/ResizeRecipe';
import './Tutorials.css';

export type Tutorial = 'sort' | 'resize';

export const tutorialParam: D.Decoder<Tutorial> = D.literalUnion('sort', 'resize');

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
    <h2 className="tutorials-title">how it’s built</h2>
    <Picks label="tutorials"
           className="tutorial-picks"
           options={[
             {display: 'Drag sort', value: 'sort'},
             {display: 'Drag resize', value: 'resize'}
           ]}
           chosen={shown}
           onPick={onShow}/>
    {shown === 'sort' && <Controls {...props}/>}
    {shown === 'sort' ? <Recipe track={track} onTrack={onTrack} {...props}/> : <ResizeRecipe/>}
  </div>;
