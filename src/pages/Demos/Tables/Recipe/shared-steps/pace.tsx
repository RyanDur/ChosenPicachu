import {ReactNode} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {gap, travelSource} from './sources';

export const eagerPace = (world: World, headerSource: string, buildSrc: string): ReactNode =>
  <Step title="Commit inside the move" dial={<PaceDial name="step-pace"/>}>
    <Words want="The trader wants the table to answer inside the move, so they can change their mind before the drop.">
      <Says>Answering mid-drag means a <Term word="strike">strike</Term> is simply a dispatch: the same state change a drop
        would make, made early. One thing has to hold: the reorder moves real nodes, not copies,
        so the drag keeps flying over a table that has already reordered.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says><Term word="settle">Settle</Term> as soon as a neighbour is struck: the order updates mid-drag, the markup
          renders through it, and the same key finds its new seat. Carrying the column back is
          just more crossings: home is always reachable. The only style that changes hands is
          the shove the animated builds mark, and that is the motion step’s story.</Says>
        : <Says>Dispatch as soon as a neighbour is struck: the dispatch writes a new column order
          into the state, and the <Term word="reconcile">reconcile</Term> moves the real cells to match it. Carrying the
          column back is just more crossings: home is always reachable. The only style that
          changes hands is the shove the animated builds mark, and that is the motion step’s
          story.</Says>}
      {world === 'react'
        ? <Says>This is the whole of the eager table’s travel, and there is no landing to keep
          anywhere in it: the header keeps the pointer capture, columnUnder answers from the
          survey, and a strike dispatches on the spot. Eager listens on the move.</Says>
        : <Says>This is the whole travel of the eager build, and there is no landing state to keep
          anywhere in it: columnUnder answers from the survey, and a strike dispatches on the
          spot; the buttons-at-zero healing lives in the shared pointer travel, once, for every
          build.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(headerSource, 'const walkedTo = '), gap,
            ...unit(headerSource, 'const beside = '), gap,
            ...unit(headerSource, 'const moved = ')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'const columnBeside = '), gap,
            ...unit(buildSrc, 'const moved = ')
          ]}/>}
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            plain('<DraggableColumn column="trades">trades ...</DraggableColumn>'),
            aside('{/* same key, new seat: React moves the node, not a copy */}')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'const reconcileColumns = '),
            aside('// the same cells, new seats: the reconcile moves the node, not a copy')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(travelSource, 'export const eagerTravel'),
          aside('// one shared travel; each world answers with its own settle')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const lazyPace = (world: World, headerSource: string, paceSource: string, buildSrc: string): ReactNode =>
  <Step title="Hold still, dispatch on release" dial={<PaceDial name="step-pace"/>}>
    <Words want="The trader wants the table calm while they drag, because motion during the drag distracts, and only the destination matters.">
      <Says>Instead of dispatching the order, a <Term word="strike">strike</Term> only remembers a <Term word="landing">landing</Term>, and the
        release dispatches it. The landing rides in the drag slice, never in the order:
        drifting back over home must clear it, and release and cancel must resolve it the same
        way.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The table holds still, and one dispatch runs on pointer up. Drifting back over
          your own slot clears the landing, so a drop at home changes nothing.</Says>
        : <Says>The table holds still, and one dispatch runs at the landing. Drifting back over
          your own slot clears the landing, so a drop at home changes nothing.</Says>}
      {world === 'react'
        ? <Says>The lazy table is its own file, not a flag on the eager one: its travel only ever
          dispatches the landing into the drag, and its release, which also answers cancel,
          dispatches the order. Lazy listens on the drop.</Says>
        : <Says>The lazy build is its own file, not a flag on the eager one: its travel records the
          landing in the drag, and its release, which also answers cancel, dispatches whatever
          the drag is holding.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(headerSource, 'const moved = '), gap,
            ...unit(headerSource, 'const release = '), gap,
            ...unit(paceSource, 'export const travelledColumn'), gap,
            ...unit(paceSource, 'export const releasedColumn')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'const moved = '), gap,
            ...unit(buildSrc, 'const landed = ')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(travelSource, 'export const lazyTravel'),
          aside('// one shared travel; the fold is its value, each world keeps it its own way')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
