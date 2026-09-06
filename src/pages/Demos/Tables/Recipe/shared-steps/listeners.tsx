import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {Term} from '../Term';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameMount, gap, seatedTableSource, stateSource, travelSource} from './sources';

export const listenersOnce = (world: World): ReactNode =>
  <Step title="Write each listener once, for both worlds">
    <Words want={<>A pointer does not know which world it landed in: the lift, the <Term word="travel">travel</Term>, and the arrows should each be one function, written once and attached twice.</>}>
      <Says>The trap to check before sharing anything: a listener that closes over state
        remembers the world as it stood when the listener was made, and a vanilla listener
        attaches once, at mount. Sharing only works if a handler holds no state at all: it asks
        at event time and writes back through one dispatch.</Says>
    </Words>
    <Reveal>
      <Says>No listener here holds state. Where a handler needs the order, it takes the order
        as a function and calls it when the event fires. React remakes its handlers every render
        and never needed the discipline; the vanilla page attaches once and cannot live without
        it.</Says>
      <Says>Writing back is the same shape in reverse: every handler ends in a dispatch, a function
        taking a pure transition from the old state to the new. Ask, dispatch and subscribe together
        are the store, and it is one plain object that both worlds mount unchanged. What differs is
        who subscribes: React subscribes a component, which re-renders; the vanilla build subscribes
        a reconcile, which moves nodes. Every listener from here on speaks to the store and nothing
        else, which is why each lives in one shared file and every shared block below appears in
        both worlds unchanged.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(stateSource, 'export type TableStore'), gap,
          ...unit(stateSource, 'export const tableStore'), gap,
          ...span(travelSource, 'export const columnLift', ') => (event: GrabEvent): void => {'),
          aside('// the order is a question the event asks, not a value the listener keeps')
        ]}/>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(seatedTableSource, 'export const SeatedTable')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(frameMount, 'const store = tableStore(', '  });'), gap,
            ...span(frameMount, 'const mounted: MountedTable', 'const mounted: MountedTable')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
