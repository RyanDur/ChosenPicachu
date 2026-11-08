import {FC} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';

export const StaticMotion: FC<{world: World; cssSource: Sample}> = ({world, cssSource}) =>
  <Step title="Leave the motion out" dial={<MotionDial name="step-motion"/>} id="step-motion">
    <Words want="Motion is not free: it competes with the pointer, costs a frame budget, and some traders ask for none at all.">
      <Says>No motion should be the style sheet’s decision, not a second table: the same marks
        are dispatched and worn, and when the table wears static the style sheet gives them no time to play.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The static table is the animated table wearing a different word. Every drop and
          every walk still marks what settles and what is shoved, because the marks are what
          happened; the style sheet runs each mark for no time at all, so the keyframe ends the moment
          it starts and the mark clears in the same breath. Its value is that nothing competes with the
          pointer.</Says>
        : <Says>The static build is the animated build wearing a different word. Every drop and
          every walk still marks what settles and what is shoved, because the marks are what
          happened; the style sheet runs each mark for no time at all, so the keyframe ends the moment
          it starts and the cells clear their classes at once. Its value is that nothing competes with the
          pointer.</Says>}
      <Codes>
        <Snippet label="CSS" lines={[
          ...carve.unit(cssSource, '.sortable.static :is(.settling, .shoved-start, .shoved-end, .shoved-up, .shoved-down) {'),
          lines.aside('/* the marks still land; the style sheet gives them no time */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
