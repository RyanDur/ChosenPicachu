import {ReactNode} from 'react';
import {Codes, Predict, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameMount, gap, stateSource, travelSource} from './sources';

export const listenersOnce = (world: World, tableSource: string): ReactNode =>
  <Step title="Write each listener once, for both worlds">
    <Words want="A pointer does not know which world it landed in: the lift, the travel, and the arrows should each be one function, written once and attached twice.">
      <Predict>The lift needs the current column order. Let the listener close over it: what does
        a vanilla listener, attached once at mount, remember after a minute of trading?</Predict>
      <Says>The order as it stood at mount, forever. A listener that closes over state remembers
        the world as it was when the listener was made; React escapes by remaking its handlers
        every render, and a vanilla page never re-renders. So no listener here holds state at
        all: where a handler needs the order, it takes a question, order as a function, and asks
        at the moment the event fires. Fresh by construction, in a component that re-renders and
        in a page that never does.</Says>
      <Says>Writing back is the same shape in reverse. Every handler ends in a commit, a function
        taking a pure transition from the old state to the new. Ask and commit together are the
        cell, and the cell is the entire seam between the worlds: React’s is useState wearing the
        commit signature, the vanilla build’s is a variable behind a reconcile. Every listener
        from here on speaks to the cell and nothing else, which is why each lives in one shared
        file and every shared block below appears in both worlds unchanged.</Says>
    </Words>
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
  </Step>;
