import {FC, Fragment} from 'react';
import {Arrow, Box, Kind, Label} from '../Recipe/Drawing';

export type Card = {kind: Kind; says: string};

export const SeenFromTheSide: FC<{cards: [Card, Card, Card]; under: string}> = ({cards, under}) => <>
  <Label x={60} y={14}>the reader</Label>
  <Arrow through={[{x: 60, y: 22}, {x: 60, y: 50}]}/>
  {cards.map(({kind, says}, at) => <Fragment key={says}>
    <Box kind={kind} x={20} y={60 + at * 28} width={180} height={16}/>
    <Label x={210} y={72 + at * 28} anchor="start">{says}</Label>
  </Fragment>)}
  <Box kind="native" x={10} y={144} width={200} height={16}/>
  <Label x={218} y={156} anchor="start">the page</Label>
  <Label x={110} y={184}>{under}</Label>
</>;
