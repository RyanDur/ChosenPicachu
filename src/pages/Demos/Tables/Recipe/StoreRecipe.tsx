import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World} from '../params';
import {Term} from './Term';
import stateSource from '@components/DragSortableTable/table-state.ts?raw';
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
import buildSrc from '../Frame/builds/EagerHideAnimated.ts?raw';

const gap = plain(' ');

const oneState = (world: World): ReactNode =>
  <Step title="Two states, two stores">
    <Words want="A live table is state before it is pixels, and two worlds have to agree on what that state is before either can render it.">
      <Says>The page’s state is the trades it holds. A table’s state is its arrangement: the
        columns and the seats, each in the order it stands, the rule, the widths, and whatever
        the hand is carrying. Never the data. A <Term word="store">store</Term> holds each value, and its
        dispatch is the only way in. The charts and the tables read the trades from the page’s
        store; every part inside a table reads its arrangement from the table’s own. Nothing ever
        edits a value in place: the previous value is never mutated, only replaced.</Says>
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
          to a provider; the charts and the tables below the provider read the same trades. The
          table element creates its own store once, seeded from the columns and the row keys it
          was handed, and every part inside it reads and writes through that one.</Says>
        : <Says>The mount creates the same two stores: the trades, with the same exchange as
          middleware, and the arrangement, seeded from the markup it was given. Every listener it
          wires speaks to one of the two.</Says>}
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(demosSource, 'export type DemosState'), gap,
          ...unit(stateSource, 'export type TableState'), gap,
          ...unit(storeSource, 'export type Store'), gap,
          ...unit(storeSource, 'export const store'), gap,
          ...unit(demosSource, 'export const demosStore'),
          aside('// a value, a dispatch, a subscribe; the whole store, and the page only names its state')
        ]}/>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(openingSource, 'export const useExchange'), gap,
            ...unit(elementSource, 'export const DragSortableTable')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(buildSrc, 'const trades = demosStore(', 'const store = tableStore(')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

const actionsAreData =
  <Step title="Actions are data, and one reducer reads them">
    <Words want="A change must say what happened, not how to poke the state, and it must leave the old value untouched.">
      <Says>An <Term word="action">action</Term> is a record of what happened: a type and the facts, orderedTo with its from
        and to, rowLifted with its seat and the standing, columnMovedBeside with the neighbour and the widths. A creator
        named for the verb makes the record. One <Term word="reducer">reducer</Term> reads the type and returns the next
        state.</Says>
    </Words>
    <Reveal>
      <Says>The first draft dispatched functions from state to state and called them reducers.
        They were not: a reducer interprets an action it did not write. Making the action data
        costs a union of types and one switch, and buys what Redux promises: the store knows
        nothing about tables, a layer of middleware can read what kind of action is passing, and
        a dispatch can be logged or replayed as a record.</Says>
      <Says>A slice is a reducer with the state it starts from. The page’s slice is its trades,
        the table’s is its arrangement, and a store starts from its slice’s beginning, so nobody
        names an initial state. Slices combine by key when a state has more than one concern,
        each seeing only its own state. The table’s reducer is six small reducers combined, one per concern:
        motion, holding, sorting, ordering, widths, dragging. Each is a short switch that answers the actions it
        cares about and returns the state untouched for the rest, and each case hands the state
        and the facts to a verb in the table’s vocabulary, reorder, rule, seat, drift. One action
        can be answered by several of them: a walked column is marked by motion, then moved by
        ordering, and the order they are combined in is the order they read the state, marks
        first, because the shove is measured from where the neighbour stood before the move, and
        dragging last, because the drop’s settle is measured from the drag before it is
        cleared. The drag is its own slice, absent from a table that never lifts. Components
        compose nothing.</Says>
      <Says>Nothing feeds the table. The trades never enter its store: the page projects them
        into rows, a key and the value under each column, and hands that projection to the table
        element beside its markup. The element seats the keys it is handed, keeping every seat
        still seated and adding the new ones after, and the standing under a rule is a selector
        over the arrangement and the projection, so a sort is never stored and never goes
        stale.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...span(actionsSource, 'export type TableAction', "readonly to: number}"), plain('  | ...'), gap,
          ...unit(actionsSource, 'export const orderedTo'), gap,
          ...unit(actionsSource, 'export const columnMovedBeside'),
          aside('// the record says what happened; the creator is named for the verb')
        ]}/>
        <Snippet label="TS" lines={[
          ...unit(demosSource, 'export const demosSlice'), gap,
          ...unit(storeSource, 'export type Slice'), gap,
          ...unit(storeSource, 'export const sliced'), gap,
          ...unit(storeSource, 'export const combined'), gap,
          ...unit(reducerSource, 'export const tableReducer'), gap,
          ...unit(reducerSource, 'const ordering = '), gap,
          ...unit(stateSource, 'export const reorder'), gap,
          ...unit(stateSource, 'export const seat'), gap,
          ...unit(selectorsSource, 'export const selectStanding'), gap,
          ...unit(demosSource, 'export const demosStore'),
          aside('// a slice is a reducer and its beginning; six table reducers read the type in turn; the standing is a question, not a feed')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

const selectorsAnswer = (world: World): ReactNode =>
  <Step title="Selectors answer questions">
    <Words want="A component should ask for what it means, not walk the state to find it.">
      <Says>Every read is a named <Term word="selector">selector</Term>: columnNamed, positionOfRow, columnTravels,
        restOfColumn. The name carries the question, and the state’s shape is known in one
        file.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>A header asks useTableSelector with a selector and gets the answer for the current
          state; when the state changes, it asks again. Anything a component would derive from
          state is a selector instead, so the component holds no arithmetic over the store.</Says>
        : <Says>The mount calls the same selectors against store.state at the moment it needs an
          answer, so a listener never keeps a stale copy of the order or the standing.</Says>}
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
            ...span(headerSource, 'const {width, sorted, carried', '(column));'), gap,
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
            ...span(buildSrc, 'const trades = demosStore(', 'const store = tableStore(')
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
          useSyncExternalStore, so a trade re-renders the rows and a drag re-renders the
          arrangement; the markup renders through the new state, and React reconciles the real
          DOM, moving only the nodes whose place changed. You never touch the DOM; you only
          dispatch the next state.</Says>
        : <Says>The mount subscribes twice. A reconcile on the arrangement walks the DOM from the
          previous state to the current one, moving only the cells whose place changed; a writer
          on the trades writes only the text that differs and reseats the rows when the rule ranks
          them anew. The store hands every listener the state before the change and a way to read
          the state now, so the mount keeps nothing of its own.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(elementSource, 'export const DragSortableTable')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(buildSrc, 'store.subscribe(', 'store.subscribe('), gap,
            ...span(buildSrc, 'trades.subscribe(', '});')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

export const storeStory = (world: World): ReactNode =>
  <Story param="living" id="store" steps={5}
         can="The page is a store, and so is the table"
         soThat="the charts and the tables read one stream, each table keeps its own arrangement, and both worlds write them one way">
    <Tell>We could let each chart and each table keep its own copy of the trades, but they would
      drift from each other and from the stream, and every listener would need to know which
      world it landed in; so the page is a store in the Redux shape, without Redux: one value
      holding the trades, actions that are records of what happened, one reducer that reads them,
      named selectors, and middleware where the exchange comes in. Each table is a store of the
      same shape holding its arrangement and never the data. The stores are the same objects in
      both worlds. Only the subscriber differs.</Tell>
    <Steps>
      {oneState(world)}
      {actionsAreData}
      {selectorsAnswer(world)}
      {exchangeIsMiddleware(world)}
      {whoSubscribes(world)}
    </Steps>
  </Story>;
