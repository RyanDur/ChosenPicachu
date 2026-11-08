import {FC} from 'react';
import {Box, Diagram, Label, Part} from '../../Recipe/Drawing';
import './Diagrams.css';

export const PaddingInsideTheClip: FC = () =>
  <Diagram title="The padding inside the clip" height={150}
    says="The paragraph is a grid of one row that clips, its item is a span with no minimum height, and the padding sits on a span inside that one, so a closed row reaches 0 and no strip of text shows under the bar.">
    <Box x={10} y={10} width={300} height={130} kind="clip"/>
    <Label x={20} y={26} anchor="start">p, 0fr, clips</Label>
    <Box x={24} y={36} width={272} height={94} kind="piece"/>
    <Label x={34} y={52} anchor="start">span, the row’s item: min-height 0</Label>
    <Part x={38} y={62} width={244} height={58} kind="clipped" name="span, the text inside its padding"/>
  </Diagram>;
