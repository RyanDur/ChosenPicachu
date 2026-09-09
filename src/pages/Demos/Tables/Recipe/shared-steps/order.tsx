import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {arrangementSource, gap, headersSource, placingSource, rowSource} from './sources';

export const orderInState = (world: World, tableSource: string, buildSrc: string): ReactNode =>
  <Step title="Keep the order in state, not in the data">
    <Words want="Every story runs against the stream: a reorder that rewrote the data would lose to the next trade, so order and data must never fight.">
      <Says>So the order is the page’s state, the columns and the rows as they stand, held beside
        the data and never inside it; a trade rewrites a row’s values and never touches its seat.
        The table shows what it is handed, and what the hand does to it comes back as an event
        the page answers. The open
        question is how each world makes the page follow a value: React renders the markup
        through it; a vanilla build has to <Term word="reconcile">reconcile</Term> the DOM against
        it by hand.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>Rows and columns arrive in whatever order the fold produced. The page holds the
          columns and the <Term word="seats">seats</Term>, each in the order it stands, and hands the
          table both, the rows already in their standing. The page writes its header cells once,
          in any order it likes, and the header row places them by the columns as they stand;
          each row places its cells the same way. A moved column or row is an event the page
          dispatches into its own order. A reorder never touches the data, and nothing reads the
          markup back: the same key finds its new seat and React moves the real nodes.</Says>
        : <Says>Rows and columns arrive in the markup’s order, and the markup is the source of the
          structural knowledge: JavaScript reads the columns off the header classes and names
          every lane after its row header. Both seed the arrangement, and every dispatch
          reconciles the page against the new order, so a reorder never touches the data: the
          same lane finds its new seat, and insertBefore moves the real node only when its seat
          actually changed.</Says>}
      {world === 'react'
        ? <Codes>
          <Snippet label="TS" lines={[
            ...unit(arrangementSource, 'export type Arrangement')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(tableSource, '<DragSortableTable className', 'rows={seated(rows)}>'), gap,
            ...span(tableSource, '<Headers className="row"', '</Headers>'), gap,
            ...span(tableSource, '<Body className="body"', '</Body>')
          ]}/>
          <Snippet label="TS" lines={[
            ...unit(headersSource, 'export const Headers'), gap,
            ...unit(rowSource, 'export const Row'), gap,
            ...unit(placingSource, 'export const placed')
          ]}/>
        </Codes>
        : <Codes>
          <Snippet label="TS" lines={[
            ...unit(arrangementSource, 'export type Arrangement'), gap,
            ...span(buildSrc, "const order = [...table.querySelectorAll('thead th')]",
              "const order = [...table.querySelectorAll('thead th')]"), gap,
            ...span(buildSrc, 'const lanes = new Map(', 'const lanes = new Map('), gap,
            ...span(buildSrc, 'const arrangement = store(', 'const hand = tableStore(')
          ]}/>
          <Snippet label="TS" lines={[
            ...span(buildSrc, 'const reseatRows = ',
              'body.insertBefore(desired, body.children[position] ?? null);'),
            aside('// the same lane, its new seat: the reconcile moves the node, not a copy')
          ]}/>
        </Codes>}
    </Reveal>
  </Step>;
