import {FC} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {gap, travelSource} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const EagerPace: FC<{world: World; headerSource: Sample; buildSrc: Sample}> = ({world, headerSource, buildSrc}) =>
  <Step title="Commit inside the move" dial={<PaceDial name="step-pace"/>}>
    <Words want="The trader wants the table to answer inside the move, so they can change their mind before the drop.">
      <Says>Answering mid-drag means a <Term word="strike">strike</Term> is simply a dispatch: the same state change a drop
        would make, made early. One thing has to hold: the reorder moves real nodes, not copies,
        so the drag keeps flying over a table that has already reordered.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says><Term word="settle">Settle</Term> as soon as a neighbour is struck: the order updates mid-drag, the markup
          renders through it, and the same key finds its new place. Carrying the column back is
          just more crossings: where it started is always reachable. The only style that moves between them is
          the shove the animated builds mark, and that is the motion step’s story.</Says>
        : <Says>Dispatch as soon as a neighbour is struck: the dispatch writes a new column order
          into the state, and the <Term word="reconcile">reconcile</Term> moves the real cells to match it. Carrying the
          column back is just more crossings: where it started is always reachable. The only style that
          moves between them is the shove the animated builds mark, and that is the motion step’s
          story.</Says>}
      {world === 'react'
        ? <Says>This is the whole of the eager table’s travel, and there is no landing to keep
          anywhere in it: the header keeps the pointer capture, columnUnder reads the
          survey, and a strike dispatches on the spot.</Says>
        : <Says>This is the whole travel of the eager build, and there is no landing state to keep
          anywhere in it: columnUnder reads the survey, and a strike dispatches on the
          spot; the buttons-at-zero recovery is in the shared pointer travel, once, for every
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
            aside('{/* same key, new place: React moves the node, not a copy */}')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, '#reconcileColumns('),
            aside('// the same cells, new places: the reconcile moves the node, not a copy')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(travelSource, 'export const eagerTravel'),
          aside('// one shared travel; each world answers with its own settle')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const LazyPace: FC<{world: World; headerSource: Sample; paceSource: Sample; buildSrc: Sample}> = ({world, headerSource, paceSource, buildSrc}) =>
  <Step title="Hold still, dispatch on release" dial={<PaceDial name="step-pace"/>}>
    <Words want="The trader wants the table calm while they drag, because motion during the drag distracts, and only the destination matters.">
      <Says>Instead of dispatching the order, a <Term word="strike">strike</Term> only remembers a <Term word="landing">landing</Term>, and the
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
        : <Says>The lazy build is its own file, not a flag on the eager one: its travel records the
          landing in the drag, and its release, which also handles cancel, dispatches whatever
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
