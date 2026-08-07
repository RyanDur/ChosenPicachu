import {FC} from 'react';
import * as D from 'schemawax';
import {Motion, Origin, Pace} from '../Controls';
import {TableControls} from './TableControls';
import {Picks} from './Picks';
import {Recipe, Track} from './Recipe';
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
    <h2 className="tutorials-title">how it’s built</h2>
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
