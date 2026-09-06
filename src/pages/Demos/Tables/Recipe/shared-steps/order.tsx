import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {stateSource, frameMount, gap, pageSource, seatedTableSource} from './sources';

export const orderInState = (world: World): ReactNode =>
  <Step title="Keep the order in state, not in the data">
    <Words want="Every story runs against the stream: a reorder that rewrote the data would lose to the next trade, so order and data must never fight.">
      <Says>So the order lives beside the data, one value behind one dispatch. The open question
        is how each world makes the page follow a value: React renders the markup through it; a
        vanilla build has to <Term word="reconcile">reconcile</Term> the DOM against it by hand.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>Rows and columns arrive in whatever order the fold produced. The store holds the
          ordered columns and the <Term word="seats">seats</Term> as one state value, and the page renders its own
          markup through it: the headers it wrote, placed by the order; the rows it wrote, placed
          by the seats. A reorder never touches the data, and nothing reads the markup back: the
          same key finds its new seat and React moves the real nodes.</Says>
        : <Says>Rows and columns arrive dealt by the markup, and the markup is the source of the
          structural knowledge: JavaScript reads the order off the header classes and seats every
          lane by its birth index. Both live in the table state, and every dispatch reconciles the
          page against the new state, so a reorder never touches the data: the same lane finds
          its new seat, and insertBefore moves the real node only when its seat actually
          changed.</Says>}
      {world === 'react'
        ? <Codes>
          <Snippet label="TS" lines={[
            ...unit(stateSource, 'export type TableState'), gap,
            ...unit(seatedTableSource, 'export const SeatedTable')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(pageSource, 'const order = useSelector(state => state.order);', 'const standing = useStanding();'), gap,
            ...span(pageSource, '<tr className="row">{order.map(name => headers[name])}</tr>', '<tr className="row">{order.map(name => headers[name])}</tr>'), gap,
            ...span(pageSource, '{standing.map(seat => {', '</tr>;'),
            plain('    })}')
          ]}/>
        </Codes>
        : <Codes>
          <Snippet label="TS" lines={[
            ...unit(stateSource, 'export type TableState'), gap,
            ...span(frameMount, "const order = [...table.querySelectorAll('thead th')]",
              "const order = [...table.querySelectorAll('thead th')]"), gap,
            ...span(frameMount, 'const store = tableStore(', 'const store = tableStore(')
          ]}/>
          <Snippet label="TS" lines={[
            ...span(frameMount, 'standing.forEach((at, position) => {',
              'body.insertBefore(desired, body.children[position] ?? null);'),
            aside('// the same lane, its new seat: the reconcile moves the node, not a copy')
          ]}/>
        </Codes>}
    </Reveal>
  </Step>;
