import {FC, useState} from 'react';
import {join} from '@components/class-names';
import {Controls, Motion, Origin, Pace} from './Controls';
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
  const pick = (tutorial: 'sort' | 'resize', display: string) =>
    <button type="button"
            className={join('pick', shown === tutorial && 'current')}
            aria-pressed={shown === tutorial}
            onClick={() => setShown(tutorial)}>{display}</button>;
  return <div className="tutorials">
    <h2 className="tutorials-title">how it’s built</h2>
    <nav className="tutorial-picks" aria-label="tutorials">
      {pick('sort', 'Drag sort')}
      {pick('resize', 'Drag resize')}
    </nav>
    {shown === 'sort' && <Controls {...props}/>}
    {shown === 'sort' ? <Recipe {...props}/> : <ResizeRecipe/>}
  </div>;
};
