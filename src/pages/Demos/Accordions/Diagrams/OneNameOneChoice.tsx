import {FC} from 'react';
import {Circle, Diagram, Label} from '../../Recipe/Drawing';
import './Diagrams.css';

export const OneNameOneChoice: FC = () =>
  <Diagram title="One name, one choice" height={150}
    says="Radios that share a name make one group, so choosing one fold unchooses the last, and Close is the choice that shows nothing.">
    {['Close', 'first fold', 'second fold', 'third fold'].map((fold, at) =>
      <g key={fold}>
        <Circle kind="piece" cx={40} cy={26 + at * 30} r={9}/>
        {at === 1 && <circle className="drawn-filled" cx={40} cy={26 + at * 30} r={4}/>}
        <Label x={60} y={30 + at * 30} anchor="start">{fold}</Label>
      </g>)}
    <polyline className="arrow hollow drawn" points="180,17 190,17 190,125 180,125"/>
    <Label x={200} y={75} anchor="start">name="group"</Label>
  </Diagram>;
