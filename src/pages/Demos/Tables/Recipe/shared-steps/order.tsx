import {ReactNode} from 'react';
import {Codes, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {stateSource, frameStand, gap, useTableStateSource} from './sources';

export const orderInState = (world: World): ReactNode =>
  <Step title="Keep the order in state, not in the data">
    <Words want="Every story runs against the stream: a reorder that rewrote the data would lose to the next trade, so order and data must never fight.">
      {world === 'react'
        ? <Says>Rows and columns arrive in whatever order the fold produced. The table holds the
          ordered columns and the seats on the desk, one value behind one commit, and renders the
          markup through it, so a reorder never touches the data: the same key finds its new seat
          and React moves the real nodes.</Says>
        : <Says>Rows and columns arrive dealt by the markup, and the markup is the source of the
          structural knowledge: the shell reads the order off the header classes and seats every
          lane by its birth index. Both live on the desk, one immutable value behind one commit,
          and every commit reconciles the page against the new desk, so a reorder never touches
          the data: the same lane finds its new seat, and insertBefore moves the real node only
          when its seat actually changed.</Says>}
    </Words>
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
          ...span(frameStand, "const order = [...table.querySelectorAll('thead th')]",
            'aloft: undefined, bounds: undefined, flight: undefined, origin: undefined, drift: still'),
          plain('  };')
        ]}/>
        <Snippet label="TS" lines={[
          ...span(frameStand, 'seated.forEach((at, position) => {',
            'body.insertBefore(desired, body.children[position] ?? null);'),
          aside('// the same lane, its new seat: the shell moves the node, not a copy')
        ]}/>
      </Codes>}
  </Step>;
