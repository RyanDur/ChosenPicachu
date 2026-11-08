import {FC} from 'react';
import {Arrow, Box, Diagram, Label} from '../../Recipe/Drawing';
import './Diagrams.css';

export const FocusOnTheBar: FC = () =>
  <Diagram title="Focus on the box, drawn on the bar" height={110}
    says="The box off screen holds the keyboard’s focus, and a sibling rule lights the bar the reader sees.">
    <Box x={110} y={20} width={200} height={70} kind="piece"/>
    <Label x={210} y={36}>the viewport</Label>
    <Box x={125} y={48} width={170} height={26} kind="ring"/>
    <Label x={210} y={65}>label, lit and ringed</Label>
    <Box x={14} y={48} width={40} height={26} kind="unseen-ring"/>
    <Label x={34} y={65}>focus</Label>
    <Arrow through={[{x: 54, y: 61}, {x: 123, y: 61}]}/>
    <Label x={88} y={104}>:focus-visible ~</Label>
  </Diagram>;
