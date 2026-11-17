import {FC} from 'react';
import {Opener} from './Opener';
import {PagePulledApart} from './PagePulledApart';
import './Home.css';

export const HomePage: FC = () =>
  <article className="home">
    <Opener/>
    <PagePulledApart/>
  </article>;
