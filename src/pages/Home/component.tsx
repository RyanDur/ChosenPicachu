import {FC} from 'react';
import {Opener} from './Opener';
import {Timeline} from './Timeline';
import {Structure} from './Structure';
import {Presentation} from './Presentation';
import {DynamicInteraction} from './DynamicInteraction';
import {Bibliography} from './Bibliography';
import {TeeUp} from './TeeUp';
import './Home.css';

export const HomePage: FC = () =>
  <article className="home">
    <Opener/>
    <Structure/>
    <Presentation/>
    <DynamicInteraction/>
    <Timeline/>
    <TeeUp>
      <Bibliography/>
    </TeeUp>
  </article>;
