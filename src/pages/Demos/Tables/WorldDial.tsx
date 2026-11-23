import {FC} from 'react';
import {WorldGlider, WorldNote} from './World';
import './WorldDial.css';

export const WorldDial: FC = () => <section className="world-dial">
  <WorldGlider/>
  <WorldNote/>
</section>;
