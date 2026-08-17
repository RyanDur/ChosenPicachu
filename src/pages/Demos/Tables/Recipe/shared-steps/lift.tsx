import {ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameMount, gap, sortableCss, travelSource} from './sources';

export const liftOnce = (world: World, tableSource: string): ReactNode =>
  <Step title="Lift on pointer down, and measure the table once">
    <Words want="A carry must know the ground it stands on without asking the DOM again on every move.">
      <Says>Asking the DOM where things are mid-drag causes the layout thrash we came here to
        avoid, so everything gets measured once, at the grab: the
        table’s <Mdn path="Web/API/Element/getBoundingClientRect">bounding rect</Mdn> and every
        header in it. Every later answer is arithmetic against that one survey.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The hand is CSS before anything happens, grab on hover, grabbing on press, and
          touch-action: none is why the pointer can drag on touch at all. On pointerdown,
          JavaScript records which key is aloft and takes the survey.</Says>
        : <Says>The hand is CSS before anything happens, grab on hover, grabbing on press, and
          touch-action: none is why the pointer can drag on touch at all. On pointerdown,
          JavaScript takes the survey; then the grab fills the ghost and the carry begins.</Says>}
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
        : <Says>A few words you will see in every block from here. Aloft is whatever you are
          carrying, named by its column or its seat, and it lives in the table state like everything
          else: the grab is just another commit. The survey is a plain record of that one
          measurement: the table’s box, each column’s width, and later the row heights. And has
          is the null check from a small library
          called <a className="signpost"
            href="https://ryandur.github.io/sand/"
            target="_blank"
            rel="noreferrer">sand</a>; it answers false for nothing and for empty.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(tableSource, 'const grabbedColumn = '), gap,
            ...span(tableSource, 'onLift={column => columnLift(column', 'onLift={column => columnLift(column')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(frameMount, '    const grabbed = '), gap,
            ...span(frameMount, "th.addEventListener('pointerdown', columnLift",
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
    </Reveal>
  </Step>;
