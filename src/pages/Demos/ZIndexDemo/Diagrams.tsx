import {FC, Fragment} from 'react';
import {Arrow, Box, Diagram, Kind, Words} from '../Recipe/Drawing';

type Layer = {kind: Kind; says: string};

const SeenFromTheSide: FC<{layers: [Layer, Layer, Layer]; under: string}> = ({layers, under}) => <>
  <Words x={60} y={14}>the reader</Words>
  <Arrow through={[{x: 60, y: 22}, {x: 60, y: 50}]}/>
  {layers.map(({kind, says}, at) => <Fragment key={says}>
    <Box kind={kind} x={20} y={60 + at * 28} width={180} height={16}/>
    <Words x={210} y={72 + at * 28} anchor="start">{says}</Words>
  </Fragment>)}
  <Box kind="native" x={10} y={144} width={200} height={16}/>
  <Words x={218} y={156} anchor="start">the page</Words>
  <Words x={110} y={184}>{under}</Words>
</>;

export const PileFromTheSide: FC = () =>
  <Diagram title="The pile from the side" height={190}
    says="With no z-index, the browser paints the cards in the order the code lists them, so the last one listed lands on top.">
    <SeenFromTheSide under="later in the code, nearer the reader" layers={[
      {kind: 'piece', says: 'Third, painted last'},
      {kind: 'piece', says: 'Second'},
      {kind: 'piece', says: 'First, painted first'}
    ]}/>
  </Diagram>;

export const OneNumberLiftsOneCard: FC = () =>
  <Diagram title="One number lifts one card" height={190}
    says="A positioned card with z-index: 1 is painted after every card left at auto, so First leaves the bottom and lands on top.">
    <SeenFromTheSide under="the others keep their order under it" layers={[
      {kind: 'ring', says: 'First, z-index: 1'},
      {kind: 'piece', says: 'Third'},
      {kind: 'piece', says: 'Second'}
    ]}/>
  </Diagram>;
