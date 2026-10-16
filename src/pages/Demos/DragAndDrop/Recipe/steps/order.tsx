import {FC} from 'react';
import {Codes, Says, Snippet, Step, Steps, Story, Tell, Words} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {gap} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const StraightToOrder: FC<{gripSource: Sample}> = ({gripSource}) =>
  <Story param="native" id="keyboard"
    can="The user can arrange the list from the keyboard"
    soThat="the keys go straight to the order">
    <Tell>Drag and drop has no keyboard events, and it does not matter: dragging was never the goal, the order
      changing is.</Tell>
    <Steps>
      <Step title="Arrows go straight to the order">
        <Words want="A keyboard user needs the same reorders, and drag and drop cannot give them: it has pointer events only.">
          <Says>The grip is a real button, so focus reaches it with no extra code, and the item handles its own keys: the arrow keys compute
            the move and report the result upward, with no drag involved. An item that is still sliding ignores the keys
            until it lands.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(gripSource, 'const steps'), gap,
            ...unit(gripSource, 'onKeyDown={event =>')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
