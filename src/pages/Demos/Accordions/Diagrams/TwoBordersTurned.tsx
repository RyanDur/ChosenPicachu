import {FC} from 'react';
import {Chevron, Diagram, Label} from '../../Recipe/Drawing';
import './Diagrams.css';

export const TwoBordersTurned: FC = () =>
  <Diagram title="Two borders, turned" height={100}
    says="An empty box with only its top and right borders points right at 45 degrees and down at 135.">
    <Chevron x={90} y={44} turn={45}/>
    <Label x={90} y={88}>closed, 45°</Label>
    <Chevron x={230} y={40} turn={135}/>
    <Label x={230} y={88}>open, 135°</Label>
  </Diagram>;
