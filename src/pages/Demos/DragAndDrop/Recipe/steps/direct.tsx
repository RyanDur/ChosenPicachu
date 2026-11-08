import {FC} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Sample, Says, Snippet, Step, Words, lines, carve} from '../../../Recipe';

export const DirectState: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Apply the state update directly" dial={<MotionDial name="native-motion"/>}>
    <Words want="Motion is not free: it competes with the drag, costs a frame, and some readers ask for none.">
      <Says>This is the static list, and it has no motion code. The handler sets the order and React draws it on the
        next frame; a keyboard move sets the order the same way.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.span(listSource, 'onArranged={(after, walker) => {', '}}/>'),
        lines.aside('// nothing marked, nothing competing with the browser’s drag')
      ]}/>
    </Codes>
  </Step>;
