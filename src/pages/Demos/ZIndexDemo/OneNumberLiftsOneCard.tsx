import {FC} from 'react';
import {Diagram} from '../Recipe/Drawing';
import {SeenFromTheSide} from './SeenFromTheSide';

export const OneNumberLiftsOneCard: FC = () =>
  <Diagram title="One number lifts one card" height={190}
    says="A positioned card with z-index: 1 is painted after every card left at auto, so First leaves the bottom and lands on top.">
    <SeenFromTheSide under="the others keep their order under it" layers={[
      {kind: 'topmost', says: 'First, z-index: 1'},
      {kind: 'piece', says: 'Third'},
      {kind: 'piece', says: 'Second'}
    ]}/>
  </Diagram>;
