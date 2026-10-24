import {FC} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {Term} from '../Term';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {gap, elementSource, storeSource, liftSource} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const ListenersOnce: FC<{world: World; buildSrc: Sample}> = ({world, buildSrc}) =>
  <Step title="Write each listener once, for both worlds">
    <Words want={<>A pointer does not know which world it landed in: the lift, the <Term word="travel">travel</Term>, and the arrows should each be one function, written once and attached twice.</>}>
      <Says>The trap to check before sharing anything: a listener that closes over state
        remembers the world as it stood when the listener was made. Sharing only works if a handler holds no state at all: it asks
        at event time and writes back through one dispatch.</Says>
      {world === 'vanilla' && <Says>Every vanilla listener attaches once, when boot calls <code>dragSortable</code>: the
        table’s, and each grip’s, handle’s and menu’s. A move re-inserts cells, and a node keeps its listeners when it is
        moved, so nothing is attached twice and nothing is lost.</Says>}
    </Words>
    <Reveal>
      <Says>No listener here holds state. Where a handler needs the order, it takes the order
        as a function and calls it when the event fires. React remakes its handlers every render
        and never needed the discipline; the vanilla listeners are never remade, so they live by it.</Says>
      {world === 'vanilla' && <Says><code>dragSortable</code> provides the parts a context: the mounted table and the verbs its pace decides, <code>lifted</code>, <code>moved</code> and <code>dropped</code> for a drag, and <code>rowNudged</code> and <code>rowMoved</code> for a row walked by the arrow keys. <code>dragSortable</code> gives each grip, handle and menu its context as it wires it; what the context answers about the order it still reads at event time, through the functions the page gave.</Says>}
      <Says>Writing back is the same shape in reverse. Every handler ends in a dispatch of an action (<code>columnMovedBeside</code>, <code>lifted</code>, <code>dropped</code>), a record of what happened that one reducer turns into the next state. Whatever changes the order goes up to the page as an event, <code>onColumnMoved</code> or <code>onRowMoved</code> in React and <code>column-moved</code> or <code>row-moved</code> from the table, and comes back down as the next order.</Says>
      {world === 'vanilla' && <Says>The context’s verbs are the build’s own functions, not the actions of the same name: <code>lifted</code> dispatches the <code>lifted</code> action, <code>moved</code> dispatches <code>drifted</code>, and <code>dropped</code> dispatches <code>released</code>.</Says>}
      <Says>Ask, dispatch and subscribe together are the store, one plain object that both worlds mount unchanged. What differs is who subscribes: React subscribes a component, which re-renders; the vanilla page subscribes a listener that calls <code>reconcile</code>, and the table reads the order through the functions it was given and moves its nodes to match.</Says>
      <Says>Every shared listener from here on, the lift, the travel and the arrows, reads the order and calls the function its world gives it. It keeps no state and changes no world’s state itself, which is why each is in one shared file and every shared block below appears in both worlds unchanged. In React that function dispatches to the table’s store or calls the <code>onColumnMoved</code> or <code>onRowMoved</code> function the page gave the headers or the body; in the vanilla build it dispatches to the table’s store, or raises the event, writes the move report and moves the cells. The move report is the output that tells a screen reader where the moved column or row now sits.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(storeSource, 'export type Store'), gap,
          ...span(liftSource, 'export const columnLift', ') => (event: GrabEvent): void => {'),
          aside('// the order is a question the event asks, not a value the listener keeps')
        ]}/>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(elementSource, 'export const useDragSortable')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'export const dragSortable = '), gap,
            ...span(buildSrc, 'hand.subscribe(', 'hand.subscribe(')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
