import {FC} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';
import {Term} from '../Term';
import {sources} from './sources';

export const LazyPace: FC<{world: World; headerSource: Sample; paceSource: Sample; buildSrc: Sample}> =
  ({world, headerSource, paceSource, buildSrc}) =>
    <Step title="Hold still, dispatch on release" dial={<PaceDial name="step-pace"/>}>
      <Words want="The trader wants the table calm while they drag, because motion during the drag distracts, and only the destination matters.">
        <Says>Instead of dispatching the order, a <Term word="strike">strike</Term> only remembers
          a <Term word="landing">landing</Term>, and the
          release dispatches it. The landing is kept in the drag slice, never in the order:
          carrying the column back over where it started must clear it, and release and cancel must resolve it the same
          way.</Says>
      </Words>
      <Reveal>
        {world === 'react'
          ? <Says>The table holds still, and one dispatch runs on pointer up. With no landing left to
            dispatch, a drop where it started changes nothing.</Says>
          : <Says>The table holds still, and one dispatch runs at the landing. With no landing left to
            dispatch, a drop where it started changes nothing.</Says>}
        {world === 'react'
          ? <Says>The lazy table is its own file, not a flag on the eager one: its travel only ever
            dispatches the landing into the drag, and its release, which also handles cancel,
            dispatches the order.</Says>
          : <Says>The lazy build is its own file, not a flag on the eager one: its travel records the landing in the
            hand, and its release, which also handles cancel, raises whatever the hand is holding on the table and then
            lets the hand go.</Says>}
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...carve.unit(headerSource, 'const moved = '), lines.blank,
              ...carve.unit(headerSource, 'const release = '), lines.blank,
              ...carve.unit(paceSource, 'const column'), lines.blank,
              ...carve.unit(paceSource, 'const released')
            ]}/>
            : <Snippet label="TS" lines={[
              ...carve.unit(buildSrc, 'const moved = '), lines.blank,
              ...carve.unit(buildSrc, 'const landed = ')
            ]}/>}
          <Snippet label="TS" lines={[
            ...carve.unit(sources.travel, 'const lazy'),
            lines.aside('// one shared travel; the fold is its value, each world keeps it its own way')
          ]}/>
        </Codes>
      </Reveal>
    </Step>;
