import {FC} from 'react';
import {Arrow, Box, Diagram, Label} from '../Recipe/Drawing';

export const AThirdFromTheHand: FC = () =>
  <Diagram title="A third from the hand" height={356}
    says="The drag marks where the hand grabbed the chart. When the hand is a third of that chart’s height from the mark, up or down, the chart swaps with its neighbour, and the mark moves to where the hand is. The short chart has just dropped a whole tall chart’s height, and the hand has not moved. Had the mark stayed on the chart, the hand would now be far above it, and the two would swap straight back.">
    <Label x={20} y={12} anchor="start">before</Label>
    <Box kind="unseen" x={20} y={20} width={150} height={42}/>
    <Label x={28} y={45} anchor="start">short chart, held</Label>
    <line className="edge" x1={12} y1={27} x2={178} y2={27}/>
    <line className="edge" x1={12} y1={55} x2={178} y2={55}/>
    <circle className="ring" cx={146} cy={41} r={5}/>
    <Arrow through={[{x: 160, y: 41}, {x: 160, y: 55}]}/>
    <Label x={186} y={31} anchor="start">a third up</Label>
    <Label x={186} y={45} anchor="start">the mark: grabbed here</Label>
    <Label x={186} y={59} anchor="start">a third down: swap</Label>
    <Box kind="piece" x={20} y={70} width={150} height={84}/>
    <Label x={95} y={116}>tall chart</Label>

    <Label x={20} y={188} anchor="start">after the swap</Label>
    <Box kind="piece" x={20} y={196} width={150} height={84}/>
    <Label x={95} y={268}>tall chart</Label>
    <line className="edge" x1={12} y1={217} x2={178} y2={217}/>
    <line className="edge" x1={12} y1={245} x2={178} y2={245}/>
    <circle className="ring" cx={160} cy={231} r={5}/>
    <Label x={186} y={221} anchor="start">a third up</Label>
    <Label x={186} y={235} anchor="start">the mark: at the hand</Label>
    <Label x={186} y={249} anchor="start">a third down</Label>
    <Box kind="unseen" x={20} y={288} width={150} height={42}/>
    <Label x={28} y={313} anchor="start">short chart, held</Label>
    <Label x={20} y={350} anchor="start">the hand stayed where it was; the mark came to it</Label>
  </Diagram>;
