import {FC} from 'react';
import {MotionDial, useControls} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import {sources} from './sources';

export const WalkSlides: FC<{headerSource: Sample; buildSource: Sample}> =
  ({headerSource, buildSource}) => {
    const {world} = useControls();
    return <Step title="Both parties slide" dial={<MotionDial name="step-motion"/>}>
      <Words want="A pointer swap explains itself with the column in hand; the trader’s keyboard swap has no pointer, and if only the neighbor slid, the walked column would simply jump.">
        <Says>Both parties should explain themselves: each starts where it was and slides to
          where it now sits. A walk is a reorder, and it wears the same marks a strike does, plus
          one for the column that walked.</Says>
      </Words>
      <Reveal>
        <Says>The arrow measures the header row at the keypress, the way the lift takes its
          survey, and passes the widths to the walk. The walk dispatches the reorder with two
          marks: the neighbor is shoved by the walked column’s width, and the walked column
          settles from across the neighbor’s. The style sheet slides both, and each clears its
          own mark when its keyframe ends, so a held key walks the column step by step, sliding
          every step.</Says>
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...carve.unit(sources.arrows, 'const column: Arrows'), lines.blank,
              ...carve.unit(headerSource, 'const walkedTo = '), lines.blank,
              ...carve.span(headerSource, 'onAnimationEnd={() => dispatch(tableActions.settled', 'onAnimationEnd={() => dispatch(tableActions.settled'),
              lines.aside('// the walk marks both parties; the style sheet slides them; the keyframe’s end clears the mark')
            ]}/>
            : <Snippet label="TS" lines={[
              ...carve.unit(sources.arrows, 'const column: Arrows'), lines.blank,
              ...carve.unit(buildSource, 'const columnTo = '), lines.blank,
              ...carve.unit(sources.frameSettle, 'const untilSettled = '),
              lines.aside('// the walk marks both parties; the style sheet slides them; the keyframe’s end clears the mark')
            ]}/>}
        </Codes>
      </Reveal>
    </Step>;
  };
