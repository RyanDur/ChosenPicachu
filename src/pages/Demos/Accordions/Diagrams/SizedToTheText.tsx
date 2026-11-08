import {FC} from 'react';
import {Diagram, Label, Part} from '../../Recipe/Drawing';
import './Diagrams.css';

export const SizedToTheText: FC = () =>
  <Diagram title="Sized to the text" height={130}
    says="Closed, the part a details hides has no height, and open, it takes exactly its text’s height.">
    <Part x={20} y={20} width={120} height={26} kind="piece" name="summary"/>
    <line className="edge drawn" x1={20} y1={50} x2={140} y2={50}/>
    <Label x={80} y={66}>block-size: 0</Label>
    <Label x={80} y={124}>closed</Label>
    <Part x={180} y={20} width={120} height={26} kind="piece" name="summary"/>
    <Part x={180} y={50} width={120} height={50} kind="native" name="::details-content"/>
    <Label x={240} y={124}>open, block-size: auto</Label>
  </Diagram>;
