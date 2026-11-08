import {FC} from 'react';
import {Arrow, Box, Diagram, Label} from '../Recipe/Drawing';

export const ANumberInsideALayer: FC = () =>
  <Diagram title="A number inside a layer" height={200}
    says="Card one is painted as one layer, menu and all, so the menu is on top of card one’s face and still under card two.">
    <Label x={60} y={14}>the reader</Label>
    <Arrow through={[{x: 60, y: 22}, {x: 60, y: 46}]}/>
    <Box kind="piece" x={20} y={54} width={180} height={16}/>
    <Label x={210} y={66} anchor="start">card two, 1</Label>
    <Box kind="clip" x={14} y={82} width={192} height={64}/>
    <Label x={214} y={98} anchor="start">card one, 1</Label>
    <Box kind="topmost" x={24} y={92} width={120} height={16}/>
    <Label x={84} y={104}>menu, 9999</Label>
    <Box kind="piece" x={24} y={120} width={172} height={16}/>
    <Label x={110} y={132}>card one’s face</Label>
    <Box kind="native" x={10} y={158} width={200} height={16}/>
    <Label x={218} y={170} anchor="start">the page</Label>
    <Label x={110} y={194}>9999 is on top only inside its card</Label>
  </Diagram>;
