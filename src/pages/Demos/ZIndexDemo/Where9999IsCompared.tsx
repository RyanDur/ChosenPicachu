import {FC} from 'react';
import {Box, Diagram, Label} from '../Recipe/Drawing';

export const Where9999IsCompared: FC = () =>
  <Diagram title="Where 9999 is compared" height={180}
    says="Each card with a z-index makes its own stacking context. The menu’s 9999 is compared only inside card one; in the tab’s content, card one and card two are compared at 1 and 1.">
    <Box kind="clip" x={10} y={10} width={300} height={150}/>
    <Label x={20} y={26} anchor="start">the tab’s content, the context that holds both cards</Label>
    <Box kind="clip" x={22} y={38} width={148} height={110}/>
    <Label x={32} y={54} anchor="start">card one, 1</Label>
    <Box kind="topmost" x={34} y={66} width={124} height={26}/>
    <Label x={96} y={83}>menu, 9999</Label>
    <Box kind="piece" x={34} y={102} width={124} height={34}/>
    <Label x={96} y={123}>face, auto</Label>
    <Box kind="piece" x={182} y={38} width={116} height={110}/>
    <Label x={240} y={54}>card two, 1</Label>
    <Label x={240} y={100}>later in the code</Label>
    <Label x={160} y={176}>1 against 1, and the later card wins</Label>
  </Diagram>;
