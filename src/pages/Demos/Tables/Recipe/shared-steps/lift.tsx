import {ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {frameMount, gap, sortableCss, travelSource} from './sources';

export const liftOnce = (world: World, tableSource: string): ReactNode =>
  <Step title="Lift on pointer down, and measure the table once" id="step-lift">
    <Words want="A carry must know the ground it stands on without asking the DOM again on every move.">
      <Says>Asking the DOM where things are mid-drag causes the layout thrash we came here to
        avoid, so everything gets measured once, at the grab: the
        table’s <Mdn path="Web/API/Element/getBoundingClientRect">bounding rect</Mdn> and every
        header in it. Every later answer is arithmetic against that one <Term word="survey">survey</Term>.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The hand is CSS before anything happens, grab on hover, grabbing on press, and
          touch-action: none is why the pointer can drag on touch at all. On pointerdown,
          JavaScript records which key is <Term word="aloft">aloft</Term> and takes the survey. Two words in
          the code come from a small library called <a className="signpost"
            href="https://ryandur.github.io/sand/"
            target="_blank"
            rel="noreferrer">sand</a>: aloft rides its Maybe, nothing until a lift, and has is
          its null check, false for nothing and for empty.</Says>
        : <Says>The hand is CSS before anything happens, grab on hover, grabbing on press, and
          touch-action: none is why the pointer can drag on touch at all. On pointerdown,
          JavaScript takes the survey; then the grab fills the <Term word="ghost">ghost</Term> and the carry
          begins. One word in the code comes from a small library called <a className="signpost"
            href="https://ryandur.github.io/sand/"
            target="_blank"
            rel="noreferrer">sand</a>: has, its null check, false for nothing and for
          empty.</Says>}
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
