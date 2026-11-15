import {FC} from 'react';
import {Box, Diagram, Label} from '../Recipe/Drawing';

export const CardTwoOnTop: FC = () =>
  <Diagram title="Which card is on top" height={180}
    says="Card one and card two each form a stacking context. The list’s 9999 is compared only inside card one. In the tab’s content, card one at 1, card two at 2 and card three at auto are compared, and card two is on top.">
    <Box kind="clip" x={10} y={10} width={300} height={150}/>
    <Label x={20} y={26} anchor="start">the tab’s content</Label>
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
