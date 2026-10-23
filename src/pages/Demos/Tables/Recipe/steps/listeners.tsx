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
        remembers the world as it stood when the listener was made, and a vanilla listener attaches once, when the element connects. Sharing only works if a handler holds no state at all: it asks
        at event time and writes back through one dispatch.</Says>
    </Words>
    <Reveal>
      <Says>No listener here holds state. Where a handler needs the order, it takes the order
        as a function and calls it when the event fires. React remakes its handlers every render
        and never needed the discipline; the vanilla element attaches once and cannot live without it.</Says>
      {world === 'vanilla' && <Says>The element provides its parts a context: the mounted table and the verbs its pace decides, <code>lifted</code>, <code>moved</code> and <code>dropped</code> for a drag, and <code>rowNudged</code> and <code>rowMoved</code> for a row walked by the arrow keys. A grip or a handle asks for it from inside the table each time an event fires, and nothing is passed by hand.</Says>}
      <Says>Writing back is the same shape in reverse. Every handler ends in a dispatch of an action (<code>columnMovedBeside</code>, <code>lifted</code>, <code>dropped</code>), a record of what happened that one reducer turns into the next state. The context’s <code>lifted</code>, <code>moved</code> and <code>dropped</code> are the vanilla element’s own functions, not those actions: <code>lifted</code> dispatches the <code>lifted</code> action, <code>moved</code> dispatches <code>drifted</code>, and <code>dropped</code> dispatches <code>released</code>. Whatever changes the order goes up to the page as an event, <code>onColumnMoved</code> or <code>onRowMoved</code> in React and <code>column-moved</code> or <code>row-moved</code> from the element, and comes back down as the next order.</Says>
      <Says>Ask, dispatch and subscribe together are the store, one plain object that both worlds mount unchanged. What differs is who subscribes: React subscribes a component, which re-renders; the vanilla element takes the order the page gives it and reconciles, which moves nodes.</Says>
      <Says>Every shared listener from here on, the lift, the travel and the arrows, reads the order and calls the function its world gives it. It keeps no state and changes no world’s state itself, which is why each is in one shared file and every shared block below appears in both worlds unchanged. In React that function dispatches to the table’s store or calls the <code>onColumnMoved</code> or <code>onRowMoved</code> function the page gave the table; in the vanilla element it dispatches to the table’s store, or raises the event, writes the move report and moves the cells. The move report is the output that tells a screen reader where the moved column or row now sits.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(storeSource, 'export type Store'), gap,
          ...span(liftSource, 'export const columnLift', ') => (event: GrabEvent): void => {'),
          aside('// the order is a question the event asks, not a value the listener keeps')
        ]}/>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(elementSource, 'export const DragSortableTable')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(buildSrc, 'readonly #hand = tableStore();', 'readonly #hand = tableStore();'), gap,
            ...span(buildSrc, 'hand.subscribe(', 'hand.subscribe('), gap,
            ...unit(buildSrc, '#context(): Maybe<TableContext>')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
