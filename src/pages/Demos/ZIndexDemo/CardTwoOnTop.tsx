import {FC} from 'react';
import {Box, Diagram, Label} from '../Recipe/Drawing';

export const CardTwoOnTop: FC = () =>
  <Diagram title="Why card two is on top" height={180}
    says="The list is drawn inside card one, the context its 9999 counts in. The three cards are drawn side by side inside .cards, the context they are compared in.">
    <Box kind="clip" x={10} y={10} width={300} height={150}/>
    <Label x={20} y={26} anchor="start">.cards</Label>
    <Box kind="clip" x={20} y={38} width={84} height={110}/>
    <Label x={62} y={54}>card one, 1</Label>
    <Box kind="piece" x={27} y={66} width={70} height={26}/>
    <Label x={62} y={83}>list, 9999</Label>
    <Box kind="topmost" x={110} y={38} width={84} height={110}/>
    <Label x={152} y={54}>card two, 2</Label>
    <Box kind="piece" x={200} y={38} width={104} height={110}/>
    <Label x={252} y={54}>card three, auto</Label>
    <Label x={252} y={100}>later in the code</Label>
    <Label x={160} y={176}>2 beats 1, and auto paints under both</Label>
  </Diagram>;
