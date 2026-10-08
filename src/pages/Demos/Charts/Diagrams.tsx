import {FC} from 'react';
import {Arrow, Box, Circle, Diagram, Label} from '../Recipe/Drawing';

export const AThirdFromTheHand: FC = () =>
  <Diagram title="A third from the hand" height={392}
    says="The drag marks where the hand grabbed the chart. When the hand is a third of that chart’s height from the mark, up or down, the chart swaps with its neighbour, and the mark moves to where the hand is. The short chart has just dropped a whole tall chart’s height, and the hand has not moved. Had the mark stayed on the chart, the hand would now be far above it, and the two would swap straight back.">
    <Label x={20} y={12} anchor="start">before</Label>
    <Box kind="unseen" x={20} y={20} width={130} height={60}/>
    <Label x={28} y={54} anchor="start">short, held</Label>
    <line className="edge drawn" x1={12} y1={30} x2={158} y2={30}/>
    <line className="edge drawn" x1={12} y1={70} x2={158} y2={70}/>
    <Circle kind="ring" cx={126} cy={50} r={5}/>
    <Arrow through={[{x: 140, y: 50}, {x: 140, y: 70}]}/>
    <Label x={166} y={34} anchor="start">a third up</Label>
    <Label x={166} y={54} anchor="start">the mark</Label>
    <Label x={166} y={74} anchor="start">a third down</Label>
    <Box kind="piece" x={20} y={88} width={130} height={96}/>
    <Label x={85} y={140}>tall chart</Label>

    <Label x={20} y={212} anchor="start">after the swap</Label>
    <Box kind="piece" x={20} y={220} width={130} height={96}/>
    <Label x={85} y={308}>tall chart</Label>
    <line className="edge drawn" x1={12} y1={250} x2={158} y2={250}/>
    <line className="edge drawn" x1={12} y1={290} x2={158} y2={290}/>
    <Circle kind="ring" cx={140} cy={270} r={5}/>
    <Label x={166} y={254} anchor="start">a third up</Label>
    <Label x={166} y={274} anchor="start">the mark, moved</Label>
    <Label x={166} y={294} anchor="start">a third down</Label>
    <Box kind="unseen" x={20} y={324} width={130} height={60}/>
    <Label x={28} y={358} anchor="start">short, held</Label>
  </Diagram>;
