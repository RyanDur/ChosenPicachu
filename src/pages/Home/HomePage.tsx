import {FC} from 'react';
import {Opener} from './Opener';
import {PagePulledApart} from './PagePulledApart';
import {Doors} from './Doors';
import './Home.css';

export const HomePage: FC = () =>
  <article className="home">
    <PagePulledApart/>
    <Opener/>
    <Doors/>
  </article>;
