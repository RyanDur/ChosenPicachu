import {FC} from 'react';
import {Diagram} from '../Recipe/Drawing';
import {SeenFromTheSide} from './SeenFromTheSide';

export const PileFromTheSide: FC = () =>
  <Diagram title="The pile from the side" height={190}
    says="With no z-index, the browser paints the cards in the order the code lists them, so the last one listed lands on top.">
    <SeenFromTheSide under="later in the code, nearer the reader" layers={[
      {kind: 'piece', says: 'Third, painted last'},
      {kind: 'piece', says: 'Second'},
      {kind: 'piece', says: 'First, painted first'}
    ]}/>
  </Diagram>;
