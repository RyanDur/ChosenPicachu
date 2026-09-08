import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {bodySource, elementSource, gap, placingSource, rowSource, stateSource} from './sources';

export const orderInState = (world: World, tableSource: string, buildSrc: string): ReactNode =>
  <Step title="Keep the order in state, not in the data">
    <Words want="Every story runs against the stream: a reorder that rewrote the data would lose to the next trade, so order and data must never fight.">
      <Says>So the rows and the columns are the state, standing in their order, each carrying its
        own data; a trade writes into the row that holds its seat and never moves it. The open
        question is how each world makes the page follow a value: React renders the markup
        through it; a vanilla build has to <Term word="reconcile">reconcile</Term> the DOM against
        it by hand.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>Rows and columns arrive in whatever order the fold produced. The table element
          holds the columns and the <Term word="seats">seats</Term>, each in the order it stands, and the page writes
          its own markup once, in any order it likes: the header row places the headers it was
          given by the columns as they stand, the body places the rows it was given by their
          standing, and each row places its cells by column. A reorder never touches the data,
          and nothing reads the markup back: the same key finds its new seat and React moves the
          real nodes.</Says>
        : <Says>Rows and columns arrive in the markup’s order, and the markup is the source of the
          structural knowledge: JavaScript reads the columns off the header classes and names
          every lane after its row header. Both seed the table’s state, and every dispatch
          reconciles the page against the new state, so a reorder never touches the data: the
          same lane finds its new seat, and insertBefore moves the real node only when its seat
          actually changed.</Says>}
      {world === 'react'
        ? <Codes>
          <Snippet label="TS" lines={[
            ...unit(stateSource, 'export type TableState'), gap,
            ...unit(elementSource, 'export const DragSortableTable')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(tableSource, '<DragSortableTable className', 'rows={seated(rows)}>'), gap,
            ...span(tableSource, '<Headers className="row">', '</Headers>'), gap,
            ...span(tableSource, '<Body className="body">', '</Body>'), gap,
            ...unit(bodySource, 'export const Body'), gap,
            ...unit(rowSource, 'export const Row'), gap,
            ...unit(placingSource, 'export const placed')
          ]}/>
        </Codes>
        : <Codes>
          <Snippet label="TS" lines={[
            ...unit(stateSource, 'export type TableState'), gap,
            ...span(buildSrc, "const order = [...table.querySelectorAll('thead th')]",
              "const order = [...table.querySelectorAll('thead th')]"), gap,
            ...span(buildSrc, 'const lanes = new Map(', 'const lanes = new Map('), gap,
            ...span(buildSrc, 'const store = tableStore(', 'const store = tableStore(')
          ]}/>
          <Snippet label="TS" lines={[
            ...span(buildSrc, 'const reseatRows = ',
              'body.insertBefore(desired, body.children[position] ?? null);'),
            aside('// the same lane, its new seat: the reconcile moves the node, not a copy')
          ]}/>
        </Codes>}
    </Reveal>
  </Step>;
