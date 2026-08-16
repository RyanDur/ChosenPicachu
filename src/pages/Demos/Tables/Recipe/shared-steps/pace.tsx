import {ReactNode} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {flightsSource, frameStand, gap, travelSource} from './sources';

export const eagerPace = (world: World, tableSource: string, buildSrc: string): ReactNode =>
  <Step title="Commit inside the move" dial={<PaceDial name="step-pace"/>}>
    <Words want="The trader wants the table to answer inside the move, so that they can change their mind before the drop.">
      {world === 'react'
        ? <Says>With eager pace, settle as soon as a neighbour is struck: the order state updates
          mid-drag, and because the markup renders through that order, the same key finds its new
          seat and React moves the real cells. Carrying the column back is just more crossings:
          home is always reachable. No style changes hands here at all.</Says>
        : <Says>With eager pace, commit as soon as a neighbour is struck: the commit deals a new
          order onto the desk, and the reconcile moves the real cells to match it. Carrying the
          column back is just more crossings: home is always reachable. No style changes hands
          here at all.</Says>}
      {world === 'react'
        ? <Says>This is the whole eager hook’s handler, and there is no landing state to keep anywhere
          in it: buttons at zero heals a drag whose release was swallowed, the surface claims the
          pointer capture, the drift feeds the ghost, and a strike settles on the spot.</Says>
        : <Says>This is the whole travel of the eager shell, and there is no landing state to keep
          anywhere in it: the drift feeds the ghost, columnUnder answers from the survey, and a
          strike commits on the spot; the buttons-at-zero healing lives back in takeFlight, once,
          for every shell.</Says>}
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...unit(tableSource, 'const settleColumn = '), gap,
          ...unit(tableSource, 'const columnTravel = ')
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
          ...unit(frameStand, 'const reconcileColumns = '),
          aside('// the same cells, new seats: the shell moves the node, not a copy')
        ]}/>}
      <Snippet label="TS" lines={[
        ...unit(travelSource, 'export const eagerTravel'),
        aside('// one travel ruling; each world answers with its own settle')
      ]}/>
    </Codes>
  </Step>;

export const lazyPace = (world: World, tableSource: string, buildSrc: string): ReactNode =>
  <Step title="Stash the landing, commit on release" dial={<PaceDial name="step-pace"/>}>
    <Words want="The trader wants the table calm while they drag, because mid-flight churn distracts and only the destination matters.">
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
        : <Says>The lazy shell is its own file, not a flag on the eager one: the flight folds every
          move into a carried landing, and the land of the flight, which also answers cancel and
          a lost capture, commits whatever the fold is holding.</Says>}
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...unit(tableSource, 'const settleColumn = '), gap,
          ...unit(tableSource, 'const columnTravel = '), gap,
          ...unit(tableSource, 'const columnLand = ')
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
  </Step>;
