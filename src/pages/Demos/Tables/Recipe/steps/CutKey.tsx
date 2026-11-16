import {FC} from 'react';
import {MotionDial, useControls} from '../../../Controls';
import {carve, Codes, DialStep, lines, Reveal, Sample, Says, Snippet, StepHeading, Want, Words} from '../../../Recipe';
import {sources} from './sources';

export const CutKey: FC<{headerSource: Sample; buildSource: Sample}> = ({headerSource, buildSource}) => {
  const {world} = useControls();
  return <DialStep>
    <StepHeading title="Cut on the keypress"><MotionDial name="step-motion"/></StepHeading>
    <Words>
      <Want>Motion is not free, a held key multiplies it, and some traders ask for none at all.</Want>
      <Says>Motion off should cost nothing extra: no waiting. The static walk should be the arrow
        handler with the slides simply absent.</Says>
    </Words>
    <Reveal>
      <Says>Apply the order; the marks still land, and the zero-length animation clears them at once,
        so the swap paints on the next frame. With no
        animation running there is nothing to pace, so a held arrow walks the column exactly as
        fast as the key repeats.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...carve.unit(sources.arrows, 'const column: Arrows'), lines.blank,
            ...carve.between(headerSource, 'onKeyDown={travels ? arrows.column', 'walkedTo(to, widths)) : undefined}'), lines.blank,
            ...carve.unit(headerSource, 'const walkedTo = '),
            lines.aside('// the whole walk; the marks land and clear at once, nothing to wait for')
          ]}/>
          : <Snippet label="TS" lines={[
            ...carve.unit(sources.arrows, 'const column: Arrows'), lines.blank,
            ...carve.unit(buildSource, 'const columnTo = '), lines.blank,
            ...carve.between(buildSource, "th.addEventListener('keydown', arrows.column", "th.addEventListener('keydown', arrows.column"),
            lines.aside('// the whole walk; the marks land and clear at once, nothing to wait for')
          ]}/>}
      </Codes>
    </Reveal>
  </DialStep>;
};
