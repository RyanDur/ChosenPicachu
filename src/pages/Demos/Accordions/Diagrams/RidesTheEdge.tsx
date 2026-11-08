import {FC} from 'react';
import {Box, Diagram, Label, Part} from '../../Recipe/Drawing';
import './Diagrams.css';

export const RidesTheEdge: FC = () =>
  <Diagram title="The text rides the row’s edge" height={170}
    says="The row grows with the text set at its bottom, so the text’s bottom edge stays on the row’s growing edge.">
    {[{open: 0, stage: 'start'}, {open: 0.5, stage: 'halfway'}, {open: 1, stage: 'open'}].map(({open, stage}, at) => {
      const x = 12 + at * 104;
      const edge = 88 + open * 50;
      return <g key={open}>
        <Box x={x} y={edge - 50} width={88} height={50} kind="clipped"/>
        <Box x={x} y={88} width={88} height={edge - 88} kind="native"/>
        <Part x={x} y={62} width={88} height={26} kind="piece" name="bar"/>
        <line className="edge drawn" x1={x - 6} y1={edge} x2={x + 94} y2={edge}/>
        <Label x={x + 44} y={162}>{stage}</Label>
      </g>;
    })}
  </Diagram>;
