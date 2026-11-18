import {FC} from 'react';
import {Claim} from './Claim';
import {Opener} from './Opener';
import {PagePulledApart} from './PagePulledApart';
import {Doors} from './Doors';
import './Home.css';

export const HomePage: FC = () =>
  <article className="home">
    <Claim/>
    <PagePulledApart/>
    <Opener/>
    <Doors/>
  </article>;
