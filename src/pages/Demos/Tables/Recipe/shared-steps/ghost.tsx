import {ReactNode} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameGhosts, frameHtml, gap, ghostCss, ghostSource, travelSource} from './sources';

export const ghostByHand = (world: World, tableSource: string): ReactNode =>
  <Step title="Draw the ghost by hand">
    <Words want="The carried column has to be visible in the hand, smoothly, on slow machines too.">
      {world === 'react'
        ? <Says>The column in your hand is not a clone of DOM nodes. It is a second table rendered
          from the same data. The flight is where you grabbed it; the drift is how far you have
          moved since; both are state, and the ghost renders at the flight, translated by the
          drift. The first move seeds the origin; every move after sets the drift against it
          and React paints the translation; CSS keeps the
          ghost out of hit-testing with <Mdn path="Web/CSS/pointer-events">pointer-events</Mdn>: none
          and promises the browser motion with <Mdn path="Web/CSS/will-change">will-change</Mdn>.
          Nothing is measured per move, which is what keeps slower engines smooth.</Says>
        : <Says>The column in your hand is not a clone of live nodes. It is a second table stamped
          from a template the page already carries: the lift fills its header and its cells once,
          at the lift, from the lanes as they stand. The flight is where you grabbed it; the drift
          is how far you have moved since; both ride custom properties a transform composes, so
          every move writes two numbers and nothing is measured per move, which is what keeps
          slower engines smooth. CSS keeps the
          ghost out of hit-testing with <Mdn path="Web/CSS/pointer-events">pointer-events</Mdn>: none
          and promises the browser motion with <Mdn path="Web/CSS/will-change">will-change</Mdn>.</Says>}
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="HTML" lines={[
          ...span(ghostSource, 'export const Ghost', '</table>;'),
          aside('{/* the same cells, rendered again from the data */}')
        ]}/>
        : <Snippet label="HTML" lines={[
          ...span(frameHtml, '<template id="column-ghost">', '</template>'),
          aside('<!-- the shape is the page’s own; the lift only fills it -->')
        ]}/>}
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...unit(tableSource, 'const drifting = ')
        ]}/>
        : <Snippet label="TS" lines={[
          ...unit(frameGhosts, 'export const columnGhost'), gap,
          ...unit(frameGhosts, 'const flown = ')
        ]}/>}
      <Snippet label="TS" lines={[
        ...unit(travelSource, 'export const drifted'),
        aside('// both worlds measure the drift with the same word')
      ]}/>
      <Snippet label="CSS" lines={[
        ...unit(ghostCss, '.column-ghost {')
      ]}/>
    </Codes>
  </Step>;
