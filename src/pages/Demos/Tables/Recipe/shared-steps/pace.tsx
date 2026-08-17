import {ReactNode} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {flightsSource, frameMount, gap, travelSource} from './sources';

export const eagerPace = (world: World, tableSource: string, buildSrc: string): ReactNode =>
  <Step title="Commit inside the move" dial={<PaceDial name="step-pace"/>}>
    <Words want="The trader wants the table to answer inside the move, so that they can change their mind before the drop.">
      <Says>If the table answers mid-drag, then a strike is simply a commit: the same state
        change a drop would make, made early. What we would check: that the reorder moves real
        nodes, not copies, so the drag keeps flying over a table that has already obeyed, and
        that carrying the column back home is nothing special, just more strikes.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>With eager pace, settle as soon as a neighbour is struck: the order state updates
          mid-drag, and because the markup renders through that order, the same key finds its new
          seat and React moves the real cells. Carrying the column back is just more crossings:
          home is always reachable. No style changes hands here at all.</Says>
        : <Says>With eager pace, commit as soon as a neighbour is struck: the commit writes a new
          column order into the state, and the reconcile moves the real cells to match it. Carrying the
          column back is just more crossings: home is always reachable. No style changes hands
          here at all.</Says>}
      {world === 'react'
        ? <Says>This is the whole eager hook’s handler, and there is no landing state to keep anywhere
          in it: buttons at zero heals a drag whose release was swallowed, the surface claims the
          pointer capture, the drift feeds the ghost, and a strike settles on the spot.</Says>
        : <Says>This is the whole travel of the eager build, and there is no landing state to keep
          anywhere in it: the drift feeds the ghost, columnUnder answers from the survey, and a
          strike commits on the spot; the buttons-at-zero healing lives in the shared surface
          listener, once, for every build.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(tableSource, 'const settleColumn = '), gap,
            ...span(tableSource, 'const columnFlight = eagerColumnFlight', 'const columnFlight = eagerColumnFlight')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(flightsSource, 'export const eagerColumnFlight'), gap,
            ...span(buildSrc, 'column: eagerColumnFlight', 'column: eagerColumnFlight')
          ]}/>}
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            plain('<DraggableHeader key={key} ... />'),
            aside('{/* same key, new seat: React moves the node, not a copy */}')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(frameMount, 'const reconcileColumns = '),
            aside('// the same cells, new seats: the reconcile moves the node, not a copy')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(travelSource, 'export const eagerTravel'),
          aside('// one travel ruling; each world answers with its own settle')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const lazyPace = (world: World, tableSource: string, buildSrc: string): ReactNode =>
  <Step title="Stash the landing, commit on release" dial={<PaceDial name="step-pace"/>}>
    <Words want="The trader wants the table calm while they drag, because mid-flight churn distracts and only the destination matters.">
      <Says>A calm table stashes instead of committing: a strike only remembers a landing, and
        the release commits it. What we would watch for: the stash is state like everything
        else, drifting back over home must clear it, and every path out of the drag (release,
        cancel, lost capture) must resolve the same one way.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>With lazy pace, remember the last neighbour struck and do nothing else. The table
          holds still, and one moveToIndex runs on pointer up. Drifting back over your own slot
          clears the landing, so a drop at home changes nothing.</Says>
        : <Says>With lazy pace, remember the last neighbour struck and do nothing else. The table
          holds still, and one commit runs at the landing. Drifting back over your own slot
          clears the landing, so a drop at home changes nothing.</Says>}
      {world === 'react'
        ? <Says>The lazy hook is its own handler, not a flag on the eager one: a strike is only ever
          remembered as the landing, and drop, which also answers cancel and a lost capture,
          commits it.</Says>
        : <Says>The lazy build is its own file, not a flag on the eager one: the travel records the
          landing in the state, and the land, which also answers cancel and a lost capture,
          commits whatever the state is holding.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(tableSource, 'const settleColumn = '), gap,
            ...span(tableSource, 'const columnFlight = lazyColumnFlight', 'const columnFlight = lazyColumnFlight')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(flightsSource, 'export const lazyColumnFlight'), gap,
            ...span(buildSrc, 'column: lazyColumnFlight', 'column: lazyColumnFlight')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(travelSource, 'export const lazyTravel'),
          aside('// one travel ruling; the fold is its value, each world keeps it its own way')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
