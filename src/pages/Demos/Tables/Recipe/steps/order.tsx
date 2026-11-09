import {FC} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import {useControls} from '../../../Controls';
import {Term} from '../Term';
import {sources} from './sources';
import {elidedHeaders} from '../elidedHeaders';

export const OrderInState: FC<{tableSource: Sample; buildSource: Sample}> =
  ({tableSource, buildSource}) => {
    const {world} = useControls();
    return <Step title="Keep the order in state, not in the data">
      <Words want="Every story runs against the stream: a reorder that rewrote the data would lose to the next trade, so order and data must never fight.">
        <Says>So the order is the page’s state, the columns and the rows as they stand, held beside
          the data and never inside it; a trade rewrites a row’s values and never touches its seat.
          The table shows what it is given, and what the trader does to it comes back as an event
          the page handles. The open
          question is how each world makes the page follow a value: React renders the markup
          through it; a vanilla script has to <Term word="reconcile">reconcile</Term> the DOM against
          it by hand.</Says>
      </Words>
      <Reveal>
        {world === 'react'
          ? <Says>Rows and columns arrive in whatever order the fold produced. The page holds the
            columns and the <Term word="seats">seats</Term>, each in the order it stands, and passes both
            to <code className="monospaced">useDragSortable</code>, the rows already in their standing. The page writes
            its header cells once, in any order it likes, and the header row places them by the columns as they stand;
            each row places its cells the same way. A moved column or row is an event the page
            dispatches into its own order. A reorder never touches the data, and nothing reads the
            markup back: the same key finds its new seat and React moves the real nodes.</Says>
          : <Says>Rows and columns stand in the order the page
            holds: <code className="monospaced">dragSortable</code> reads the columns and rows through the two functions
            boot gave it, so the order and the standing are always the page’s as they stand. The structure is still the
            markup’s: the build names every row element (a lane, in the code) after its row header. Every time the
            page’s store changes, the page calls <code className="monospaced">reconcile</code>, so a reorder never
            touches the data: the same lane finds its new seat, and <code className="monospaced">insertBefore</code> moves
            the real node only when its seat changed.</Says>}
        {world === 'react'
          ? <Codes>
            <Snippet label="TS" lines={[
              ...carve.unit(sources.arrangement, 'export type Arrangement')
            ]}/>
            <Snippet label="TS" lines={[
              ...carve.span(tableSource, 'const sortable = useDragSortable(', 'const sortable = useDragSortable(')
            ]}/>
            <Snippet label="HTML" lines={[
              ...elidedHeaders(carve.span(tableSource, '<Headers onColumnMoved', '</Headers>')), lines.blank,
              ...carve.span(tableSource, '<Body onRowMoved', '</Body>')
            ]}/>
            <Snippet label="TS" lines={[
              ...carve.unit(sources.headers, 'export const Headers'), lines.blank,
              ...carve.unit(sources.row, 'export const Row'), lines.blank,
              ...carve.unit(sources.placing, 'export const placed')
            ]}/>
          </Codes>
          : <Codes>
            <Snippet label="TS" lines={[
              ...carve.unit(sources.arrangement, 'export type Arrangement'), lines.blank,
              ...carve.span(buildSource, 'order: () => columns().map', 'standing: () => rows().map'), lines.blank,
              ...carve.unit(sources.boot, 'const fed = ')
            ]}/>
            <Snippet label="TS" lines={[
              ...carve.span(sources.frameRows, 'const reseat = ',
                'body.insertBefore(desired, body.children[position] ?? null);'),
              lines.aside('// the same lane, its new seat: the reconcile moves the node, not a copy')
            ]}/>
          </Codes>}
      </Reveal>
    </Step>;
  };
