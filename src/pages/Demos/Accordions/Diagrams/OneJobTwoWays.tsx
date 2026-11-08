import {FC} from 'react';
import {Arrow, Box, Diagram, Label, Part} from '../../Recipe/Drawing';
import {FoldInput} from '../fold-type';
import './Diagrams.css';

export const OneJobTwoWays: FC<{input: FoldInput}> = ({input}) =>
  <Diagram title="One job, two ways" height={150}
    says={`Details holds its summary and its content, where the trick needs a ${input}, a label that presses it through for, and the text, in that order.`}>
    <Label x={80} y={14}>natively</Label>
    <Box x={10} y={22} width={140} height={116} kind="native"/>
    <Label x={80} y={38}>details</Label>
    <Part x={22} y={46} width={116} height={26} kind="piece" name="summary"/>
    <Part x={22} y={80} width={116} height={46} kind="piece" name="content"/>
    <Label x={240} y={14}>by trick</Label>
    <Box x={170} y={22} width={140} height={116} kind="clip"/>
    <Label x={240} y={38}>li</Label>
    <Part x={182} y={46} width={40} height={26} kind="piece" name="input"/>
    <Part x={242} y={46} width={56} height={26} kind="piece" name="label"/>
    <Part x={182} y={80} width={116} height={46} kind="piece" name="p"/>
    <Arrow through={[{x: 242, y: 59}, {x: 224, y: 59}]}/>
  </Diagram>;
