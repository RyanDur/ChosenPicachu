import {ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {frameGhosts, frameHtml, gap, ghostCss, ghostSource, travelSource} from './sources';

export const ghostByHand = (world: World, tableSource: string): ReactNode =>
  <Step title="Draw the ghost by hand">
    <Words want="The carried column has to be visible in the hand, smoothly, on slow machines too.">
      <Says>Cloning the grabbed node is the obvious move, but a clone of live cells goes stale
        the moment the stream writes. The <Term word="ghost">ghost</Term> gets drawn instead from what the lift already
        holds, the data and the <Term word="survey">survey</Term>, with two CSS
        promises: <Mdn path="Web/CSS/pointer-events">pointer-events</Mdn>: none so it never
        blocks hit-testing, and <Mdn path="Web/CSS/will-change">will-change</Mdn> so the browser
        prepares for motion.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The ghost is a second table rendered from the same data. The <Term word="flight">flight</Term> is where you
          grabbed it; the <Term word="drift">drift</Term> is how far you have moved since; both are state, and the ghost
          renders at the flight, translated by the drift. The first move seeds the origin; every
          move after sets the drift against it and React paints the translation. Nothing is
          measured per move, which is what keeps slower engines smooth.</Says>
        : <Says>The ghost is a second table stamped from a template the page already carries: the
          lift fills its header and its cells once, from the lanes as they stand. The <Term word="flight">flight</Term> is
          where you grabbed it; the <Term word="drift">drift</Term> is how far you have moved since; both ride custom
          properties a transform composes, so every move writes two numbers. Nothing is measured
          per move, which is what keeps slower engines smooth.</Says>}
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
    </Reveal>
  </Step>;
