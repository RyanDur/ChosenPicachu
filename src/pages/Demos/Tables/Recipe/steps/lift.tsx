import {FC} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {gap, sortableCss, stateSource, liftSource} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const LiftOnce: FC<{world: World; headerSource: Sample; buildSrc: Sample}> = ({world, headerSource, buildSrc}) =>
  <Step title="Lift on pointer down, and measure the table once" id="step-lift">
    <Words want="A carry must know the ground it stands on without asking the DOM again on every move.">
      <Says>Asking the DOM where things are mid-drag can force a layout on any move that changed the
        page, the stutter you came here to avoid, so everything gets measured once, at the grab: the
        table’s <Mdn path="Web/API/Element/getBoundingClientRect">bounding rect</Mdn> and every
        header in it. Every later answer is arithmetic against that one <Term word="survey">survey</Term>. The first
        and last columns hold the table in place and cannot be lifted.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The cursor’s hand is CSS before anything happens, grab on hover, grabbing on press, and <code>touch-action: none</code> is why the pointer can drag on touch at all. On <code>pointerdown</code> the
          header takes the survey, takes the pointer, and lifts. That is one dispatch, and after it the store
          holds the drag beside the columns and the seats: the one mark of what
          is <Term word="aloft">carried</Term>, a key a table with no carry never
          has. One word in the code comes from a small library
          called <a className="signpost"
          href="https://ryandur.github.io/sand/"
          target="_blank"
          rel="noreferrer">sand</a>: <code>has</code>, its null check, false for nothing and for
          empty.</Says>
        : <Says>The cursor’s hand is CSS before anything happens, grab on hover, grabbing on press, and <code>touch-action: none</code> is why the pointer can drag on touch at all. On <code>pointerdown</code>, the header’s listener takes the survey and the pointer and calls the context’s <code>lifted</code>, which is the build’s lift, and one dispatch puts the drag in the store beside the columns and the seats, the one mark of what is carried. One word in the code
          comes from a small library called <a className="signpost"
          href="https://ryandur.github.io/sand/"
          target="_blank"
          rel="noreferrer">sand</a>: <code>has</code>, its null check, false for nothing and for
          empty.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(headerSource, 'onPointerDown={travels ? columnLift(column', 'onPointerDown={travels ? columnLift(column'), gap,
            ...unit(headerSource, 'const lift = '), gap,
            ...unit(stateSource, 'export const dragOf'), gap,
            ...unit(stateSource, 'export const lift = ')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(buildSrc, "th.addEventListener('pointerdown', columnLift",
              "th.addEventListener('pointerdown', columnLift"), gap,
            ...unit(buildSrc, 'const lift = '), gap,
            ...unit(stateSource, 'export const dragOf'), gap,
            ...unit(stateSource, 'export const lift = ')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(liftSource, 'export const columnLift'),
          aside('// one lift; each world grabs in its own way')
        ]}/>
        <Snippet label="CSS" lines={[
          ...unit(sortableCss, '.grabbable {')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
