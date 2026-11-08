import {FC} from 'react';
import {Box, Diagram, Label} from '../../Recipe/Drawing';
import './Diagrams.css';

export const TheKnownHeight: FC = () =>
  <Diagram title="The known height" height={150}
    says="Every panel opens to the same ten lines, so a short fold leaves room under its text and a tall one scrolls inside its panel.">
    <Label x={160} y={18}>height: 10lh</Label>
    <Box x={40} y={30} width={100} height={96} kind="clip"/>
    <Box x={50} y={40} width={80} height={24} kind="native"/>
    <Label x={90} y={146}>short text, room below</Label>
    <Box x={180} y={30} width={100} height={96} kind="clip"/>
    <Box x={190} y={40} width={80} height={86} kind="native"/>
    <Box x={190} y={126} width={80} height={10} kind="clipped"/>
    <Label x={230} y={146}>tall text, scrolls</Label>
  </Diagram>;
