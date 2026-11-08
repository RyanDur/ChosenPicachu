import {FC} from 'react';
import {Arrow, Box, Diagram, Label, Part} from '../../Recipe/Drawing';
import './Diagrams.css';

export const ThreeBecomeTwo: FC = () =>
  <Diagram title="Three pieces become two" height={130}
    says="Summary is the bar and the control at once, so the box and its label fold into it, and the text becomes the details’ content.">
    <Part x={10} y={20} width={50} height={26} kind="unseen" name="input"/>
    <Part x={66} y={20} width={64} height={26} kind="piece" name="label"/>
    <Part x={10} y={54} width={120} height={46} kind="piece" name="p"/>
    <Arrow through={[{x: 140, y: 60}, {x: 176, y: 60}]}/>
    <Box x={186} y={10} width={124} height={100} kind="native"/>
    <Part x={196} y={20} width={104} height={26} kind="piece" name="summary"/>
    <Part x={196} y={54} width={104} height={46} kind="piece" name="content"/>
    <Label x={248} y={124}>details</Label>
  </Diagram>;
