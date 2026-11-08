import {FC} from 'react';
import {Arrow, Box, Diagram, Label, Part} from '../../Recipe/Drawing';
import './Diagrams.css';

export const OffScreenNotGone: FC = () =>
  <Diagram title="Off screen, not gone" height={120}
    says="The box sits past the left edge, so it takes no room and draws nothing, yet Tab still stops on it.">
    <Box x={110} y={20} width={200} height={70} kind="piece"/>
    <Label x={210} y={36}>the viewport</Label>
    <Part x={125} y={48} width={170} height={26} kind="native" name="label, the bar"/>
    <Part x={14} y={48} width={40} height={26} kind="unseen" name="input"/>
    <Label x={34} y={40}>Tab</Label>
    <Arrow through={[{x: 310, y: 104}, {x: 54, y: 104}]}/>
    <Label x={182} y={116}>right: 1000vw</Label>
  </Diagram>;
