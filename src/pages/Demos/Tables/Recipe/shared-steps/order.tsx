import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {stateSource, frameMount, gap, useTableStateSource} from './sources';

export const orderInState = (world: World): ReactNode =>
  <Step title="Keep the order in state, not in the data">
    <Words want="Every story runs against the stream: a reorder that rewrote the data would lose to the next trade, so order and data must never fight.">
      <Says>A reorder that rewrites the data loses the moment the stream deals again: the next
        trade arrives in the old order, and the trader’s work is undone. So we would keep the
        order as its own state beside the data, one value behind one commit, and look at how
        each world makes the page follow a value: React renders the markup through it; a vanilla
        build must reconcile the DOM against it by hand, moving a node with insertBefore only
        when its seat actually changed.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>Rows and columns arrive in whatever order the fold produced. The table holds the
          ordered columns and the seats as one state value behind one commit, and renders the
          markup through it, so a reorder never touches the data: the same key finds its new seat
          and React moves the real nodes.</Says>
        : <Says>Rows and columns arrive dealt by the markup, and the markup is the source of the
          structural knowledge: JavaScript reads the order off the header classes and seats every
          lane by its birth index. Both live in the table state, one immutable value behind one commit,
          and every commit reconciles the page against the new state, so a reorder never touches
          the data: the same lane finds its new seat, and insertBefore moves the real node only
          when its seat actually changed.</Says>}
      {world === 'react'
        ? <Codes>
          <Snippet label="TS" lines={[
            ...unit(stateSource, 'export type TableState'), gap,
            ...unit(useTableStateSource, 'export const useTableState')
          ]}/>
          <Snippet label="HTML" lines={[
            plain('<tr>{order.map(key =>'),
            plain('    <DraggableHeader key={key} column={byKey.get(key)} ... />)}</tr>')
          ]}/>
        </Codes>
        : <Codes>
          <Snippet label="TS" lines={[
            ...unit(stateSource, 'export type TableState'), gap,
            ...span(frameMount, "const order = [...table.querySelectorAll('thead th')]",
              'aloft: undefined, bounds: undefined, flight: undefined, origin: undefined, drift: still'),
            plain('  };')
          ]}/>
          <Snippet label="TS" lines={[
            ...span(frameMount, 'seated.forEach((at, position) => {',
              'body.insertBefore(desired, body.children[position] ?? null);'),
            aside('// the same lane, its new seat: the reconcile moves the node, not a copy')
          ]}/>
        </Codes>}
    </Reveal>
  </Step>;
