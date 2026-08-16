import {ReactNode} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {gap, sortableCss, travelSource} from './sources';

export const liftOnce = (world: World, tableSource: string, shellSrc: string): ReactNode =>
  <Step title="Lift on pointer down, and measure the table once">
    <Words want="A carry must know the ground it stands on without asking the DOM again on every twitch of the hand.">
      {world === 'react'
        ? <Says>The hand is CSS before anything happens, grab on hover, grabbing on press, and
          touch-action: none is why the pointer can drag on touch at all. On pointerdown,
          JavaScript records which key is aloft and measures the
          table’s <Mdn path="Web/API/Element/getBoundingClientRect">bounding rect</Mdn>, and every
          header in it, a single time: the survey. Everything that follows is math against the survey; measuring per move
          would fight the reorder you are about to apply.</Says>
        : <Says>The hand is CSS before anything happens, grab on hover, grabbing on press, and
          touch-action: none is why the pointer can drag on touch at all. On pointerdown,
          the shell measures the
          table’s <Mdn path="Web/API/Element/getBoundingClientRect">bounding rect</Mdn>, and every
          header in it, a single time: the survey. Then it summons the ghost and takes flight.
          Everything that follows is math against the survey; measuring per move
          would fight the reorder you are about to apply.</Says>}
      {world === 'react'
        ? <Says>A few words you will see in every block from here. Aloft is whatever you are
          carrying, named by its key. It rides in a Maybe from a small library
          called <a className="signpost"
            href="https://ryandur.github.io/sand/"
            target="_blank"
            rel="noreferrer">sand</a>: nothing until a lift, and map runs only while something is
          held. The survey is a plain record of that one measurement: the table’s box, each
          column’s width, and later the row heights. And has is the same library’s null check;
          it answers false for nothing and for empty.</Says>
        : <Says>A few words you will see in every block from here. Held is whatever you are
          carrying, named by its column or its seat, and it lives in the listener’s own closure:
          no state store anywhere. The survey is a plain record of that one measurement: the
          table’s box, each column’s width, and later the row heights. And has is the null check
          from a small library
          called <a className="signpost"
            href="https://ryandur.github.io/sand/"
            target="_blank"
            rel="noreferrer">sand</a>; it answers false for nothing and for empty.</Says>}
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...unit(tableSource, 'const grabbedColumn = '), gap,
          ...span(tableSource, 'onLift={column => columnLift(column', 'onLift={column => columnLift(column')
        ]}/>
        : <Snippet label="TS" lines={[
          ...unit(shellSrc, '  const grabbed = '), gap,
          ...span(shellSrc, "th.addEventListener('pointerdown', columnLift",
            "th.addEventListener('pointerdown', columnLift")
        ]}/>}
      <Snippet label="TS" lines={[
        ...unit(travelSource, 'export const columnLift'),
        aside('// one lift; each world grabs with its own hands')
      ]}/>
      <Snippet label="CSS" lines={[
        ...unit(sortableCss, '.grabbable {')
      ]}/>
    </Codes>
  </Step>;
