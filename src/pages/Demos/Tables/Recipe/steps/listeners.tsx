import {FC} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import {Term} from '../Term';
import type {World} from '../../../Controls';
import {sources} from './sources';
import {gap} from './gap';

export const ListenersOnce: FC<{world: World; buildSrc: Sample}> = ({world, buildSrc}) =>
  <Step title="Write each listener once, for both worlds">
    <Words want={<>A pointer does not know which world it landed in: the lift, the <Term word="travel">travel</Term>,
      and the arrows should each be one function, written once and attached twice.</>}>
      <Says>The trap to check before sharing anything: a listener that closes over state
        remembers the world as it stood when the listener was made. Sharing only works if a handler holds no state at
        all: it asks at event time and writes back through one dispatch.</Says>
      {world === 'vanilla' && <Says>Every vanilla listener attaches once, when boot
        calls <code className="monospaced">dragSortable</code>: the
        table’s, and each grip’s, handle’s and menu’s. A move re-inserts cells, and a node keeps its listeners when it
        is moved, so nothing is attached twice and nothing is lost.</Says>}
    </Words>
    <Reveal>
      <Says>No listener here holds state. Where a handler needs the order, it takes the order
        as a function and calls it when the event fires. React remakes its handlers every render
        and never needed the discipline; the vanilla listeners are never remade, so they live by it.</Says>
      {world === 'vanilla' && <Says><code className="monospaced">dragSortable</code> provides the parts a context: the
        mounted table and the verbs its pace
        decides, <code className="monospaced">lifted</code>, <code className="monospaced">moved</code> and <code className="monospaced">dropped</code> for a drag, and <code className="monospaced">rowNudged</code> and <code className="monospaced">rowMoved</code> for a row walked by the arrow keys. <code className="monospaced">dragSortable</code> gives each grip, handle and menu its context as it wires it; what the context answers about the order it still reads at event time, through the functions the page gave.</Says>}
      <Says>Writing back is the same shape in reverse. Every handler ends in a dispatch of an action
        (<code className="monospaced">columnMovedBeside</code>, <code className="monospaced">lifted</code>, <code className="monospaced">dropped</code>), a record of what happened that one reducer turns into the next state. Whatever changes the order goes up to the page as an event, <code className="monospaced">onColumnMoved</code> or <code className="monospaced">onRowMoved</code> in React and <code className="monospaced">column-moved</code> or <code className="monospaced">row-moved</code> from the table, and comes back down as the next order.</Says>
      {world === 'vanilla' && <Says>The context’s verbs are the build’s own functions, not the actions of the same
        name: <code className="monospaced">lifted</code> dispatches
        the <code className="monospaced">lifted</code> action, <code className="monospaced">moved</code> dispatches <code className="monospaced">drifted</code>, and <code className="monospaced">dropped</code> dispatches <code className="monospaced">released</code>.</Says>}
      <Says>Ask, dispatch and subscribe together are the store, one plain object that both worlds mount unchanged. What
        differs is who subscribes: React subscribes a component, which re-renders; the vanilla page subscribes a
        listener that calls <code className="monospaced">reconcile</code>, and the table reads the order through the
        functions it was given and moves its nodes to match.</Says>
      <Says>Every shared listener from here on, the lift, the travel and the arrows, reads the order and calls the
        function its world gives it. It keeps no state and changes no world’s state itself, which is why each is in one
        shared file and every shared block below appears in both worlds unchanged. In React that function dispatches to
        the table’s store or calls
        the <code className="monospaced">onColumnMoved</code> or <code className="monospaced">onRowMoved</code> function
        the page gave the headers or the body; in the vanilla build it dispatches to the table’s store, or raises the
        event, writes the move report and moves the cells. The move report is the output that tells a screen reader
        where the moved column or row now sits.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...carve.unit(sources.store, 'export type Store'), gap,
          ...carve.span(sources.lift, 'export const columnLift', ') => (event: GrabEvent): void => {'),
          lines.aside('// the order is a question the event asks, not a value the listener keeps')
        ]}/>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...carve.unit(sources.element, 'export const useDragSortable')
          ]}/>
          : <Snippet label="TS" lines={[
            ...carve.unit(buildSrc, 'export const dragSortable = '), gap,
            ...carve.span(buildSrc, 'hand.subscribe(', 'hand.subscribe(')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
