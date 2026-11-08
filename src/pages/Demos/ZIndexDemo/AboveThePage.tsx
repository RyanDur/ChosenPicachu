import {FC} from 'react';
import {Box, Diagram, Label} from '../Recipe/Drawing';

export const AboveThePage: FC = () =>
  <Diagram title="Above the page" height={240}
    says="The top layer sits over the page and every stacking context in it. Nothing is compared with the new menu, so it is drawn last, over both cards.">
    <Box kind="clip" x={10} y={10} width={300} height={44}/>
    <Label x={20} y={26} anchor="start">the top layer</Label>
    <Box kind="topmost" x={150} y={20} width={148} height={26}/>
    <Label x={224} y={37}>new menu</Label>
    <Box kind="clip" x={10} y={66} width={300} height={150}/>
    <Label x={20} y={82} anchor="start">the tab’s content, the context that holds both cards</Label>
    <Box kind="clip" x={22} y={94} width={148} height={110}/>
    <Label x={32} y={110} anchor="start">card one, 1</Label>
    <Box kind="piece" x={34} y={122} width={124} height={26}/>
    <Label x={96} y={139}>old menu, 9999</Label>
    <Box kind="piece" x={34} y={158} width={124} height={34}/>
    <Label x={96} y={179}>face, auto</Label>
    <Box kind="piece" x={182} y={94} width={116} height={110}/>
    <Label x={240} y={110}>card two, 1</Label>
    <Label x={160} y={234}>nothing below is compared with it</Label>
  </Diagram>;
