import {FC, useState} from 'react';
import {PillGlider} from '@components/PillGlider';
import {Motion, Origin, Pace} from './Controls';
import {Recipe} from './Recipe';
import {ResizeRecipe} from './Recipe/ResizeRecipe';
import './Tutorials.css';

type Props = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  onPace: (pace: Pace) => void;
  onOrigin: (origin: Origin) => void;
  onMotion: (motion: Motion) => void;
};

export const Tutorials: FC<Props> = props => {
  const [shown, setShown] = useState<'sort' | 'resize'>('sort');
  return <div className="tutorials">
    <PillGlider label="tutorial"
                name="tutorial"
                options={[
                  {display: 'Drag sort', value: 'sort'},
                  {display: 'Drag resize', value: 'resize'}
                ]}
                chosen={shown}
                onChoose={setShown}/>
    {shown === 'sort' ? <Recipe {...props}/> : <ResizeRecipe/>}
  </div>;
};
