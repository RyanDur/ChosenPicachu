import {FC} from 'react';
import {Arrow, Diagram, Label, Part} from '../../Recipe/Drawing';
import './Diagrams.css';

export const TheRuleMatchesTheBox: FC = () =>
  <Diagram title="The rule matches the box" height={110}
    says="The rule matches an unchecked box, then reaches forward to the text after it and collapses it. Nothing before the box can be reached.">
    <Label x={160} y={18}>.info-toggle:not(:checked) ~ .info</Label>
    <Part x={16} y={34} width={70} height={26} kind="unseen" name="input"/>
    <Part x={125} y={34} width={70} height={26} kind="piece" name="label"/>
    <Part x={234} y={34} width={70} height={26} kind="native" name="p"/>
    <Arrow through={[{x: 51, y: 60}, {x: 51, y: 84}, {x: 269, y: 84}, {x: 269, y: 62}]}/>
    <Label x={160} y={102}>~ looks forward only</Label>
  </Diagram>;
