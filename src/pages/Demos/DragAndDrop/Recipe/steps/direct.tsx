import {FC} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Sample, Says, Snippet, Step, Words, lines, carve} from '../../../Recipe';

export const DirectState: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Start the static list with motion off" dial={<MotionDial name="native-motion"/>}>
    <Words want="Motion is not free: it competes with the drag, costs a frame, and some readers ask for none.">
      <Says>This is the static list. It runs the same reducer as the others, started with{' '}
        <code className="monospaced">animated: false</code>, so a move changes the order and records no slide. React draws the new order on
        the next frame, and a keyboard move works the same way.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.span(listSource, 'const [sort, dispatch] = useReducer(', 'const [sort, dispatch] = useReducer('),
        lines.aside('// animated: false, so no slide is ever recorded')
      ]}/>
    </Codes>
  </Step>;
