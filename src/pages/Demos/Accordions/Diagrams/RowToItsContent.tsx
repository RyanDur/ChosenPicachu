import {FC} from 'react';
import {Diagram, Label, Part} from '../../Recipe/Drawing';
import './Diagrams.css';

export const RowToItsContent: FC = () =>
  <Diagram title="A row that grows to its content" height={130}
    says="The text’s row is 0fr while the fold is closed and 1fr while it is open, and 1fr is the height its content asks for.">
    <Part x={20} y={20} width={120} height={26} kind="piece" name="bar"/>
    <line className="edge drawn" x1={20} y1={50} x2={140} y2={50}/>
    <Label x={80} y={66}>0fr</Label>
    <Label x={80} y={124}>closed</Label>
    <Part x={180} y={20} width={120} height={26} kind="piece" name="bar"/>
    <Part x={180} y={50} width={120} height={50} kind="native" name="1fr, the content"/>
    <Label x={240} y={124}>open</Label>
  </Diagram>;
