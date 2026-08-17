import {ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {aloftSource, frameMount, gap, sortableCss, travelSource} from './sources';

export const dragSurface = (world: World, tableSource: string): ReactNode =>
  <Step title="Give the drag a surface of its own">
    <Words want="The carry outruns the header it grabbed: the pointer leaves the element mid-drag, and the release can land anywhere, even outside the window.">
      <Says>Halfway through the carry the pointer slides off the header it grabbed, and the
        release can land outside the window, so the listeners cannot live on the header. We
        would look at giving the drag its own element, alive for exactly as long as the drag is,
        and at pointer capture, whose loss is the one drop signal the platform always
        delivers.</Says>
    </Words>
    <Reveal>
      <Says>Your first surface is the document: add two listeners at lift, remove them at drop.
        Now travel is running against the order as it stood when the drag began, and every path
        out of the drag owes you a cleanup.</Says>
      {world === 'react'
        ? <Says>While something is aloft, the markup grows a fixed, full-viewport element carrying
          the move and drop handlers. Because React re-renders it on every settle, the handlers are
          always fresh: no stale closures, no document listeners. CSS gives it the grabbing cursor
          and, by mere existence, it blocks hover styles beneath it, with no state and no
          class-toggling. Hold <Mdn path="Web/API/Element/setPointerCapture">pointer capture</Mdn> on
          it, and treat <Mdn path="Web/API/Element/lostpointercapture_event">losing the capture</Mdn> as
          the drop: releases can vanish into odd corners of the platform, and the capture going
          away is the one signal that always arrives.</Says>
        : <Says>While something is aloft, JavaScript appends a fixed, full-viewport surface carrying
          the move and drop handlers, and removes it at the landing: the surface exists exactly as
          long as the drag does, so nothing can go stale. CSS gives it the grabbing cursor
          and, by mere existence, it blocks hover styles beneath it, with no state and no
          class-toggling. Hold <Mdn path="Web/API/Element/setPointerCapture">pointer capture</Mdn> on
          it, and treat <Mdn path="Web/API/Element/lostpointercapture_event">losing the capture</Mdn>,
          or a move with no buttons pressed, as the drop: releases can vanish into odd corners of
          the platform, and the capture going away is the one signal that always arrives.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            ...span(aloftSource, '(!columnsTravel.aloft.isNothing || !rowsTravel.aloft.isNothing)', '{...surface}')
          ]}/>
          : undefined}
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(tableSource, 'onPointerMove: surfaceTravel(drifting, travel,', 'onLostPointerCapture:'), gap,
            ...unit(tableSource, 'const drop = '),
            aside('// cancel and lost capture are not delegates; they ARE the drop')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(frameMount, '  const mountSurface = '),
            aside('// cancel, lost capture, and buttons at zero are not delegates; they ARE the drop')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(travelSource, 'export const surfaceTravel'),
          aside('// one surface move; each world drifts, strikes, and drops its own way')
        ]}/>
        <Snippet label="CSS" lines={[
          ...unit(sortableCss, '.drag-surface {'),
          aside('/* hover below is blocked by existence */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
