import {FC} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {gap, travelSource} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const DragSurface: FC<{world: World; headerSource: Sample; buildSrc: Sample}> = ({world, headerSource, buildSrc}) =>
  <Step title="Hold the pointer from the lift">
    <Words want="The carry outruns the header it grabbed: the pointer leaves the element mid-drag, and the release can land anywhere, even outside the window.">
      <Says>So nothing can wait for the pointer to come back. Whoever lifts
        takes <Mdn path="Web/API/Element/setPointerCapture">pointer capture</Mdn> on the
        pointerdown itself, and from then on every move and the release come to it wherever
        the pointer goes. No surface, no document listeners, no copy of the thing to be
        hit: the header that lifted is the listener.</Says>
    </Words>
    <Reveal>
      <Says>Your first instinct is a full-viewport surface, or the document itself: add listeners
        at lift, remove them at drop. Both add an element or a cleanup whose only job is to be
        hit. Capture makes the platform route the pointer to the holder instead.</Says>
      {world === 'react'
        ? <Says>While something is <Term word="aloft">aloft</Term>, the header cell carries the move and
          release handlers, and only then: the props are there when the state says the column
          is held and gone when it is not, so nothing is ever stale. Every move retakes the
          capture. Treat a cancel or a move with no buttons pressed as the drop, because a pointerup does not
          always arrive. Losing the capture is not the drop. When a settle moves the header cell in the DOM, the browser
          drops the capture with it and fires lostpointercapture at the next move, with that move’s coordinates on the
          event. So the handler treats the loss as the move it is, and retakes the pointer in the same handler.</Says>
        : <Says>While something is <Term word="aloft">aloft</Term>, the header that lifted, or the grip
          for a row, handles the move and the release, and a guard on the store stops the
          listeners when nothing is held. Every move retakes the capture. Treat a cancel
          or a move with no buttons pressed as the drop, because a pointerup does not always arrive. Losing the capture is
          not the drop. When the reconcile moves the cell in the DOM, the browser drops the capture with it and fires
          lostpointercapture at the next move, with that move’s coordinates on the event. So the handler treats the
          loss as the move it is, and retakes the pointer in the same handler.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(headerSource, 'onPointerMove={has(drag) ? pointerTravel(', 'onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}'), gap,
            ...unit(headerSource, 'const release = '),
            aside('// a cancel, or a move with no buttons down, is the drop itself')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'const wireCarry = '),
            aside('// a cancel, or a move with no buttons down, is the drop itself')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(travelSource, 'export const pointerTravel'),
          aside('// one move; each world moves and drops its own way; losing the capture is a move too')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
