import {FC} from 'react';
import {Codes, Says, Snippet, Step, Steps, Story, Tell, Words, carve, Sample, lines} from '../../../Recipe';

const blankLine = lines.plain(' ');

export const StraightToOrder: FC<{gripSource: Sample}> = ({gripSource}) =>
  <Story param="native" id="keyboard"
    can="The user can arrange the list from the keyboard"
    soThat="the keys go straight to the order">
    <Tell>Drag and drop has no keyboard events, and it does not matter: dragging was never the goal, the order
      changing is.</Tell>
    <Steps>
      <Step title="Arrows go straight to the order">
        <Words want="A keyboard user needs the same reorders, and drag and drop cannot give them.">
          <Says>The grip is a real button, so focus reaches it with no extra code. Its keydown handler turns a left or
            right arrow into a step of one place and dispatches it, with no drag involved. The reducer moves the item,
            and an item already at an end stays where it is. While the item, or the neighbor it would step past, is
            still sliding, the reducer ignores the step.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(gripSource, 'const steps'), blankLine,
            ...carve.unit(gripSource, 'onKeyDown={event =>')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
