import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameMount, gap, stateSource, travelSource} from './sources';

export const listenersOnce = (world: World, tableSource: string): ReactNode =>
  <Step title="Write each listener once, for both worlds">
    <Words want="A pointer does not know which world it landed in: the lift, the travel, and the arrows should each be one function, written once and attached twice.">
      <Says>The trap to check before sharing anything: a listener that closes over state
        remembers the world as it stood when the listener was made, and a vanilla listener
        attaches once, at mount. Sharing only works if a handler holds no state at all: it asks
        at event time and writes back through one commit.</Says>
    </Words>
    <Reveal>
      <Says>No listener here holds state. Where a handler needs the order, it takes the order
        as a function and calls it when the event fires. React remakes its handlers every render
        and never needed the discipline; the vanilla page attaches once and cannot live without
        it.</Says>
      <Says>Writing back is the same shape in reverse: every handler ends in a commit, a function
        taking a pure transition from the old state to the new. Ask and commit together are the
        cell: React’s is useState wearing the commit signature, the vanilla build’s is a variable
        behind a reconcile. Every listener from here on speaks to the cell and nothing else,
        which is why each lives in one shared file and every shared block below appears in both
        worlds unchanged.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(stateSource, 'export type Cell'), gap,
          ...span(travelSource, 'export const columnLift', ') => (event: GrabEvent): void => {'),
          aside('// the order is a question the event asks, not a value the listener keeps')
        ]}/>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(tableSource, 'const [state, commit] = useTableState', 'const cell: Cell = ')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(frameMount, '  const commit = '), gap,
            ...span(frameMount, 'const mounted: MountedTable', 'const mounted: MountedTable')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
