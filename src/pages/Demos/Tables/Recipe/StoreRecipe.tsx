import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World} from '../params';
import {Term} from './Term';
import stateSource from '@components/DragSortableTable/table-state.ts?raw';
import arrangementSource from '@components/DragSortableTable/arrangement.ts?raw';
import actionsSource from '@components/DragSortableTable/actions.ts?raw';
import reducerSource from '@components/DragSortableTable/reducer.ts?raw';
import storeSource from '@components/store.ts?raw';
import contextSource from '@components/DragSortableTable/context.ts?raw';
import selectorsSource from '@components/DragSortableTable/selectors.ts?raw';
import elementSource from '@components/DragSortableTable/DragSortableTable.tsx?raw';
import demosSource from '@pages/Demos/store.ts?raw';
import exchangeSource from '@pages/Demos/exchange.ts?raw';
import openingSource from '@pages/Demos/useExchange.ts?raw';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?raw';
import buildSrc from '../Frame/builds/Eager.ts?raw';

const gap = plain(' ');

const oneState = (world: World): ReactNode =>
  <Step title="Two states, two stores">
    <Words want="A live table is state before it is pixels, and two worlds have to agree on what that state is before either can render it.">
      <Says>The page’s state is the trades it holds and the arrangement it shows them in: the
        columns and the rows, each in the order they stand, and the sort while one holds. A
        table’s state is only what the hand does to it: what it is carrying, the marks a move
        leaves, the widths once measured. Never the data, and never the order. A <Term word="store">store</Term> holds
        each value, and its dispatch is the only way in. The charts and the tables read the
        page’s store; every part inside a table reads the table’s own. Nothing ever edits a
        value in place: the previous value is never mutated, only replaced.</Says>
    </Words>
    <Reveal>
      <Says>This is the Redux shape without Redux: a value, a dispatch, a subscribe, and nothing
        else. The store knows nothing about tables; it holds one cell, the state and its
        listeners together, and replaces that cell whole on every change, so the single mutable
        reference in either world lives here and nowhere else. The store is frozen once built,
        and it is one plain object both worlds mount unchanged. The seam between the worlds is
        exactly here: the store is identical; what differs is who subscribes, and that is the
        last step of this story.</Says>
      {world === 'react'
        ? <Says>The page creates its store once, with the exchange as its middleware, and hands it
          to a provider; the charts and the tables below the provider read the same trades and the
          same arrangement. The table element creates its own store once, empty, and every part
          inside it reads and writes through that one.</Says>
        : <Says>The mount creates the same stores: the trades, with the same exchange as
          middleware; the arrangement, seeded from the markup it was given; and the hand, empty.
          Every listener it wires speaks to one of them.</Says>}
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(demosSource, 'export type DemosState'), gap,
          ...unit(stateSource, 'export type TableState'), gap,
          ...unit(storeSource, 'export type Store'),
          aside('// a value, a dispatch, a subscribe; the whole store, and the page only names its state')
        ]}/>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(demosSource, 'export const demosStore')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(buildSrc, 'const trades = demosStore(', 'const hand = tableStore(')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

const actionsAreData =
  <Step title="Actions are data, and one reducer reads them">
    <Words want="A change must say what happened, not how to poke the state, and it must leave the old value untouched.">
      <Says>An <Term word="action">action</Term> is a record of what happened: a type and the facts, columnMoved with the
        column and where it landed, rowMoved with the row, where it landed and the standing it left,
        columnMovedBeside with the neighbour and the widths. A creator named for the verb makes
        the record. One <Term word="reducer">reducer</Term> reads the type and returns the next state.</Says>
    </Words>
    <Reveal>
      <Says>The first draft dispatched functions from state to state and called them reducers.
        They were not: a reducer interprets an action it did not write. Making the action data
        costs a union of types and one switch, and buys what Redux promises: the store knows
        nothing about tables, a layer of middleware can read what kind of action is passing, and
        a dispatch can be logged or replayed as a record.</Says>
      <Says>A slice is a reducer with the state it starts from, and a store starts from its
        slice’s beginning, so nobody names an initial state. Slices combine by key when a state
        has more than one concern, each seeing only its own: the page’s store is two, the trades
        and the arrangement. The arrangement’s reducer answers what the hand and the menu
        decided: a column moved to a seat, a row moved in the standing it was shown, a sort
        chosen or cleared, keys that arrived. A moved row ends the sort first, so the ranked
        order becomes the real one and the move lands in it.</Says>
      <Says>The table’s reducer is three small reducers combined, one per concern: motion,
        widths, dragging. Each is a short switch that answers the actions it cares about and
        returns the state untouched for the rest, and each case hands the state and the facts to
        a verb in the table’s vocabulary, shove, settle, lift, drift. The marks a move leaves are
        measured from the order the page showed, which rides in the action, because the table
        keeps no order of its own. The drag is a key on the same state, absent from a table that
        never lifts, and dragging is the only reducer that writes it. Components compose
        nothing.</Says>
      <Says>The table is never handed the trades. The page projects them into rows, a key and the
        value under each column, ranked by the sort while one holds, and hands that projection to
        the table element beside its markup in the order it should stand. What the table shows
        is what it was given, and what the hand does to it comes back as an event.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...span(arrangementSource, 'export type ArrangementAction', "readonly keys: readonly string[]}"), gap,
          ...unit(arrangementSource, 'export const columnMoved'), gap,
          ...unit(actionsSource, 'export const columnMovedBeside'),
          aside('// the record says what happened; the creator is named for the verb')
        ]}/>
        <Snippet label="TS" lines={[
          ...unit(demosSource, 'export const demosSlice'), gap,
          ...unit(storeSource, 'export type Slice'), gap,
          ...unit(arrangementSource, 'const answering = '), gap,
          ...unit(reducerSource, 'export const tableReducer'),
          aside('// two slices by key; the arrangement answers the hand and the menu; three table reducers read the type in turn')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

const selectorsAnswer = (world: World): ReactNode =>
  <Step title="Selectors answer questions">
    <Words want="A component should ask for what it means, not walk the state to find it.">
      <Says>Every read is a named <Term word="selector">selector</Term>: columnNamed, positionOfRow, columnTravels,
        neighbourOfColumn. The name carries the question, and the state’s shape is known in one
        file.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>A header asks useTableSelector with a selector and gets the answer for the current
          state; when the state changes, it asks again. Anything a component would derive from
          state is a selector instead, so the component holds no arithmetic over the store.</Says>
        : <Says>The mount asks the arrangement for the order and the standing at the moment it
          needs an answer, so a listener never keeps a stale copy of either.</Says>}
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(contextSource, 'export const useTableSelector'), gap,
          ...unit(selectorsSource, 'export const columnNamed'), gap,
          ...unit(selectorsSource, 'export const positionOfRow'), gap,
          ...unit(selectorsSource, 'export const columnTravels'),
          aside('// the question is the name; the state stays in one file')
        ]}/>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(headerSource, 'const {sorted, data} = useTableSelector(columnNamed', 'const carried = useTableSelector(columnHeld'), gap,
            ...span(headerSource, 'const travels = useTableSelector(columnTravels', 'const travels = useTableSelector(columnTravels')
          ]}/>
          : undefined}
      </Codes>
    </Reveal>
  </Step>;

const exchangeIsMiddleware = (world: World): ReactNode =>
  <Step title="The exchange is middleware">
    <Words want="Trades must reach the store without any chart or table knowing where they come from.">
      <Says><Term word="middleware">Middleware</Term> in the Redux shape: given the store’s face, then given the next
        dispatch, a layer returns the dispatch for its place in the chain. It is composed inside
        the store’s own dispatch, so every action passes through it before the reducer runs, and
        the path is strict: middleware, then the reducer, then the listeners. A store built with
        none has a chain of one. A layer holds two dispatches: next sends an action down to the
        layer beneath it and at last to the reducer; the store’s own dispatch, on the api it was
        handed, sends an action back in at the top, so an action a layer raises itself is seen by
        every layer, including its own.</Says>
    </Words>
    <Reveal>
      <Says>The exchange is that layer, in both worlds, and it answers two actions. On
        feedRequested it fetches the recent history and opens the socket, and from then on it
        dispatches what the exchange did: historyArrived, feedOpened, tradeArrived, feedFailed.
        On feedReleased it hangs up. It lets every other action through untouched. Nothing in
        the page or the mount knows a socket exists: they dispatch that they want the feed, and
        they see the store change.</Says>
      {world === 'react'
        ? <Says>A hook builds the store with the layer, and its one effect dispatches the request
          when the page arrives and the release when it leaves.</Says>
        : <Says>The mount builds the store with the same layer and dispatches the request last,
          once every listener is wired, and the frame’s socket lives as long as the frame
          does.</Says>}
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(storeSource, 'export type Middleware'), gap,
          ...unit(exchangeSource, 'export const exchange'),
          aside('// the socket lives in the middleware; the page and the mount ask for it with an action')
        ]}/>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(openingSource, 'export const useExchange')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(buildSrc, 'const trades = demosStore(', 'const hand = tableStore(')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

const whoSubscribes = (world: World): ReactNode =>
  <Step title="Who subscribes">
    <Words want="The page must follow the state, and each world has its own way to follow.">
      <Says>The store hands out one subscribe and never learns who took it. A listener is told the
        state before the change, given a way to read the state now, given the dispatch, and told
        the action that made the change. React subscribes a component and ignores all four; the
        vanilla build subscribes a reconcile and uses the first two; a listener that mirrors the
        state to a backend reads the action and knows exactly what to send.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The page’s provider and the table element each subscribe through
          useSyncExternalStore, so a trade or a move re-renders the page’s rows and a drag
          re-renders the hand’s marks; the markup renders through the new state, and React
          reconciles the real DOM, moving only the nodes whose place changed. The table raises
          what the hand did as an event, onColumnMoved, onRowMoved, onSorted, and the page
          dispatches it. You never touch the DOM; you only dispatch the next state.</Says>
        : <Says>The mount subscribes three times. A reconcile on the arrangement walks the DOM from
          the previous order to the current one, moving only the cells whose place changed; a
          dresser on the hand paints the carried cells and the widths; a writer on the trades
          writes only the text that differs and reseats the rows when the sort ranks them anew.
          The store hands every listener the state before the change and a way to read the state
          now, so the mount keeps nothing of its own.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(elementSource, 'export const DragSortableTable')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(buildSrc, 'arrangement.subscribe(', 'hand.subscribe('), gap,
            ...span(buildSrc, 'trades.subscribe(', '});')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

export const storeStory = (world: World): ReactNode =>
  <Story param="living" id="store" steps={5}
         can="The page is a store, and so is the table"
         soThat="the charts and the tables read one stream, the page owns the order it shows, and both worlds write them one way">
    <Tell>We could let each chart and each table keep its own copy of the trades, but they would
      drift from each other and from the stream, and every listener would need to know which
      world it landed in; so the page is a store in the Redux shape, without Redux: one value
      holding the trades and the arrangement, actions that are records of what happened, one
      reducer that reads them, named selectors, and middleware where the exchange comes in. Each
      table is a store of the same shape holding only what the hand does to it, and it raises
      what the hand did back to the page. The stores are the same objects in both worlds. Only
      the subscriber differs.</Tell>
    <Steps>
      {oneState(world)}
      {actionsAreData}
      {selectorsAnswer(world)}
      {exchangeIsMiddleware(world)}
      {whoSubscribes(world)}
    </Steps>
  </Story>;
