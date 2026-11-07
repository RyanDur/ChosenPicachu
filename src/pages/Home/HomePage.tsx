import {FC} from 'react';
import {Opener} from './Opener';
import {WhereThePageIsMade} from './WhereThePageIsMade';
import './Home.css';

export const HomePage: FC = () =>
  <article className="home">
    <Opener/>
    <WhereThePageIsMade/>
  </article>;
