import {FC} from 'react';
import {Opener} from './Opener';
import {Structure} from './Structure';
import {Presentation} from './Presentation';
import {DynamicInteraction} from './DynamicInteraction';
import './Home.css';

export const HomePage: FC = () =>
  <article className="home">
    <Opener/>
    <Structure/>
    <Presentation/>
    <DynamicInteraction/>
  </article>;
