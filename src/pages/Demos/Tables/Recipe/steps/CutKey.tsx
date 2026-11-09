import {FC} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';
import {sources} from './sources';

export const CutKey: FC<{world: World; headerSource: Sample; buildSrc: Sample}> = ({world, headerSource, buildSrc}) =>
  <Step title="Cut on the keypress" dial={<MotionDial name="step-motion"/>}>
    <Words want="Motion is not free, a held key multiplies it, and some traders ask for none at all.">
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
            ...carve.span(headerSource, 'onKeyDown={travels ? arrows.column', 'walkedTo(to, widths)) : undefined}'), lines.blank,
            ...carve.unit(headerSource, 'const walkedTo = '),
            lines.aside('// the whole walk; the marks land and clear at once, nothing to wait for')
          ]}/>
          : <Snippet label="TS" lines={[
            ...carve.unit(sources.arrows, 'const column: Arrows'), lines.blank,
            ...carve.unit(buildSrc, 'const columnTo = '), lines.blank,
            ...carve.span(buildSrc, "th.addEventListener('keydown', arrows.column", "th.addEventListener('keydown', arrows.column"),
            lines.aside('// the whole walk; the marks land and clear at once, nothing to wait for')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
