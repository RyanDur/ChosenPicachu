import {FC} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World} from '../params';
import {Term} from './Term';
import stateSource from '@components/DragSortableTable/table-state.ts?sample';
import arrangementSource from '@components/DragSortableTable/arrangement.ts?sample';
import actionsSource from '@components/DragSortableTable/actions.ts?sample';
import reducerSource from '@components/DragSortableTable/reducer.ts?sample';
import storeSource from '@components/store.ts?sample';
import contextSource from '@components/DragSortableTable/context.ts?sample';
import selectorsSource from '@components/DragSortableTable/selectors.ts?sample';
import elementSource from '@components/DragSortableTable/useDragSortable.ts?sample';
import demosSource from '@pages/Demos/store.ts?sample';
import exchangeSource from '@pages/Demos/exchange.ts?sample';
import openingSource from '@pages/Demos/useExchange.ts?sample';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import buildSrc from '../Frame/builds/Eager.ts?sample';
import bootSource from '../Frame/boot.ts?sample';

const gap = plain(' ');

const OneState: FC<{world: World}> = ({world}) =>
  <Step title="Two states, two stores">
    <Words want="A live table is state before it is pixels, and two worlds have to agree on what that state is before either can render it.">
      <Says>The page’s state is the trades it holds, the candles the charts have asked for, and the arrangement
        it shows the trades in: the columns and the rows, each in the order they stand, and the sort while one
        holds.</Says>
      <Says>A table’s state is only what the trader does to it: what the pointer is carrying, the widths once
        measured, and in React the marks a move leaves. Never the data, and never the order.</Says>
      <Says>A <Term word="store">store</Term> holds each value, and its dispatch is the only way in.</Says>
      <Says>The charts and the tables read the page’s store. Every part inside a table reads the table’s
        own.</Says>
      <Says>Nothing ever edits a value in place: the previous value is never mutated, only replaced.</Says>
    </Words>
    <Reveal>
      <Says>The store is a value, a dispatch and a subscribe, and nothing else. It knows nothing about
        tables.</Says>
      <Says>It holds the state and its listeners together and replaces them whole on every change, so the single
        mutable reference in either world lives here and nowhere else.</Says>
      <Says>The store is frozen once built, and it is one plain object both worlds mount unchanged.</Says>
      <Says>The seam between the worlds is exactly here: the store is identical, and what differs is who
        subscribes. That is the last step of this story.</Says>
      {world === 'react'
        ? <>
          <Says>The page creates its store once, with the exchange as its middleware, and passes it to
            a <Term word="provider">provider</Term>. The charts and the tables below the provider read the same trades and the
            same arrangement.</Says>
          <Says>The hook creates the table’s own store once, empty, and every part inside the provider reads and
            writes through that one.</Says>
        </>
        : <Says>The page and the table split the stores as React does. The page, in boot.ts, builds the trades and the arrangement in one store with the same exchange as middleware, and gives <code>dragSortable</code> two functions that read its columns and rows. <code>dragSortable</code> keeps only the hand, empty, as a store of its own. Its listeners dispatch the drag and the widths to the hand, and raise on the table whatever changes the order.</Says>}
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
            ...unit(buildSrc, 'export const dragSortable = '), gap,
            ...span(bootSource, 'const page = demosStore(', 'page.dispatch(feedRequested());')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

const ActionsAreData: FC = () =>
  <Step title="Actions are data, and one reducer reads them">
    <Words want="A change must say what happened, not how to poke the state, and it must leave the old value untouched.">
      <Says>An <Term word="action">action</Term> is a record of what happened: a type and the facts. columnMoved carries the
        column and where it landed. rowMoved carries the row, where it landed and the standing it left, the rows’ order as shown, ranked while a sort
        holds.
        columnMovedBeside carries the neighbour and the widths.</Says>
      <Says>A creator named for the verb makes the record. One <Term word="reducer">reducer</Term> reads the type and returns the
        next state.</Says>
    </Words>
    <Reveal>
      <Says>My first draft dispatched functions from state to state and called them reducers. They were not
        reducers: a reducer interprets an action it did not write.</Says>
      <Says>Making the action data costs a union of types and one switch. It gets what the shape guarantees: the
        store knows nothing about tables, a layer of middleware can read what kind of action is passing, and a
        dispatch can be logged or replayed as a record.</Says>
      <Says>A <Term word="slice">slice</Term> is a reducer with the state it starts from, and a store starts from its slice’s
        beginning, so nobody names an initial state.</Says>
      <Says>Slices combine by key when a state has more than one concern, each seeing only its own. The page’s
        store is three: the trades, the candles and the arrangement.</Says>
      <Says>The arrangement’s reducer handles what a drag and the menu decided: a column moved to a position, a row
        moved in the standing it was shown, a sort chosen or cleared, keys that arrived. A moved row ends the sort
        first, so the ranked order becomes the real one and the move lands in it.</Says>
      <Says>The table’s reducer is four small reducers combined, one per concern: motion, widths, dragging and
        sorting. Each is a short switch that handles the actions it cares about and returns the state untouched
        for the rest.</Says>
      <Says>Each case passes the state and the facts to one verb of the table’s own, the way a move passes its
        neighbours a shove and the thing that moved a <Term word="settle">settle</Term>.</Says>
      <Says>The marks a move leaves are measured from the order the page showed, which is carried in the action,
        because the table keeps no order of its own.</Says>
      <Says>The drag is a key on the same state, absent from a table that never lifts, and dragging is the only
        reducer that writes it.</Says>
      <Says>The parts hold no state and compose no reducers: they ask the store, and they dispatch to it.</Says>
      <Says>The table is never given the trades. The page projects them into rows, a key and the value under each
        column, ranked by the sort while one holds, and passes that projection to the table element beside its
        markup in the order it should stand.</Says>
      <Says>What the table shows is what it was given, and what the trader does to it comes back as an event.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...span(arrangementSource, 'export type ArrangementAction', 'readonly keys: readonly string[]}'), gap,
          ...unit(arrangementSource, 'export const columnMoved'), gap,
          ...unit(actionsSource, 'export const columnMovedBeside'),
          aside('// the record says what happened; the creator is named for the verb')
        ]}/>
        <Snippet label="TS" lines={[
          ...unit(demosSource, 'export const demosSlice'), gap,
          ...unit(storeSource, 'export type Slice'), gap,
          ...unit(arrangementSource, 'const answering = '), gap,
          ...unit(reducerSource, 'export const tableReducer'),
          aside('// three slices by key; the arrangement handles the drag and the menu; four table reducers read the type in turn')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

const SelectorsAnswer: FC<{world: World}> = ({world}) =>
  <Step title="Selectors answer questions">
    <Words want="A component should ask for what it means, not search the state to find it.">
      <Says>Every read is a named <Term word="selector">selector</Term>: columnNamed, positionOfRow, columnTravels,
        neighbourOfColumn. The name carries the question, and the state’s shape is known in one
        file.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <>
          <Says>A header asks useTableSelector with a selector and gets the answer for the current state. When the
            state changes, it asks again.</Says>
          <Says>Anything a component would derive from state is a selector instead, so the component holds no
            arithmetic over the store.</Says>
        </>
        : <Says>The table reads the order and the standing from the page’s store, through the two functions it was given, at the moment it needs an answer, so a listener never keeps a stale copy of either.</Says>}
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

const ExchangeIsMiddleware: FC<{world: World}> = ({world}) =>
  <Step title="The exchange is middleware">
    <Words want="Trades must reach the store without any chart or table knowing where they come from.">
      <Says><Term word="middleware">Middleware</Term> has that same shape. A layer is given a view of the store, its state and its
        dispatch, then the next dispatch, and it returns the dispatch for its place in the chain.</Says>
      <Says>The chain is composed inside the store’s own dispatch, so every action passes through it before the
        reducer runs. The path is strict: middleware, then the reducer, then the listeners.</Says>
      <Says>A store built with no middleware has a chain of one.</Says>
      <Says>A layer holds two dispatches. next sends an action down to the layer beneath it, and at last to the
        reducer.</Says>
      <Says>The other is the store’s own dispatch, on the view the layer was given. It sends an action back in at
        the top, so an action a layer raises itself is seen by every layer, including its own.</Says>
    </Words>
    <Reveal>
      <Says>The exchange is that layer, in both worlds, and it handles three actions.</Says>
      <Says>On feedRequested it fetches the recent history and opens the socket. From then on it dispatches what the
        exchange did: historyArrived, feedOpened, tradeArrived, feedFailed.</Says>
      <Says>On candlesAsked it fetches the candles for one period, and dispatches candlesArrived or
        candlesRefused.</Says>
      <Says>On feedReleased it hangs up.</Says>
      <Says>It lets every other action through untouched. Nothing in the page or in the table knows a socket exists: the page dispatches that it wants the feed, and it sees the store change.</Says>
      {world === 'react'
        ? <Says>A <Term word="hook">hook</Term> builds the store with the layer, and its
          one <Term word="effect">effect</Term> dispatches the request
          when the page arrives and the release when it leaves.</Says>
        : <>
          <Says>The page builds the store with the same layer and dispatches the request last, once it has called <code>dragSortable</code> on the table and is listening for what the trader does.</Says>
          <Says>The frame’s socket lives as long as the frame does.</Says>
        </>}
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
            ...span(bootSource, 'page.dispatch(feedRequested());', 'page.dispatch(feedRequested());')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

const WhoSubscribes: FC<{world: World}> = ({world}) =>
  <Step title="Who subscribes">
    <Words want="The page must follow the state, and each world has its own way to follow.">
      <Says>The store gives out one subscribe and never learns who took it.</Says>
      <Says>A listener is told the state before the change, given a way to read the state now, given the dispatch,
        and told the action that made the change.</Says>
      <Says>React subscribes a component and ignores all four. The vanilla page subscribes a listener that calls <Term word="reconcile">reconcile</Term>, the function the vanilla build returned, with the columns as they stood before the change, so the table follows the order the page now holds.</Says>
      {world === 'vanilla' && <Says><code>dragSortable</code> subscribes once itself, to its own hand.</Says>}
      <Says>A listener that mirrored the state to a backend would read the action and know exactly what to send.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <>
          <Says>The page’s provider and <code>useDragSortable</code> each subscribe through useSyncExternalStore, React’s hook
            for reading a store kept outside React.</Says>
          <Says>So a trade or a move re-renders the page’s rows, and a drag re-renders the carried cells’ marks. The markup
            renders through the new state, and React reconciles the page’s elements, moving only the ones whose
            place changed.</Says>
          <Says>The table raises what the trader did as an event, onColumnMoved, onRowMoved or onSorted, and the page
            dispatches it.</Says>
          <Says>You never touch the page’s elements yourself. You only dispatch what happened.</Says>
        </>
        : <>
          <Says>The page listens three times and subscribes once.</Says>
          <Says>The three listeners take the events the table raises, <code>column-moved</code>, <code>row-moved</code> and <code>sorted</code>, each dispatched into the arrangement; the one subscription calls <code>reconcile</code> whenever the store changes, and <code>reconcile</code> moves the real cells, touching only the ones whose place changed.</Says>
          <Says>A listener on the hand, which the code names dress, adds and removes the carried cells’ classes and
            custom properties and sets the widths.</Says>
          <Says><code>reconcile</code> writes only the text that differs, and reseats the rows whenever their order changes, by a sort or a move.</Says>
          <Says>The store gives every listener the state before the change and a way to read the state now. The page’s listener uses the state before the change, the columns as they stood, and keeps nothing of its own.</Says>
        </>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(elementSource, 'export const useDragSortable')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(buildSrc, 'hand.subscribe(', 'hand.subscribe('), gap,
            ...span(bootSource, "table.addEventListener('column-moved'", 'page.subscribe(previous =>')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

export const StoreStory: FC<{world: World}> = ({world}) =>
  <Story param="living" id="store"
    can="The page is a store, and so is the table"
    soThat="the charts and the tables read one stream, the page owns the order it shows, and both worlds write them one way">
    <Tell>I could let each chart and each table keep its own copy of the trades. They would drift from each other
      and from the stream, and every listener would need to know which world it landed in.</Tell>
    <Tell>So the page is a <Term word="store">store</Term> in the Redux shape, without Redux. Redux is a JavaScript library
      that keeps an application’s state in one store, and this page borrows that shape and none of its code.</Tell>
    <Tell>One value holds the trades, the candles the charts ask for, and the arrangement. <Term word="action">Actions</Term> are
      records of what happened, one <Term word="reducer">reducer</Term> reads them, <Term word="selector">selectors</Term> are named,
      and the exchange comes in as <Term word="middleware">middleware</Term>.</Tell>
    <Tell>In the vanilla build the code calls the table’s store the hand. It holds the drag and the widths once
      measured. The React build calls it store and keeps the marks a move leaves in it too; the vanilla build writes
      those marks onto the cells as classes. Each table has one. It holds only what the trader
      does to it, and it raises what the trader did back to the page.</Tell>
    <Tell>The stores are the same objects in both worlds. Only the subscriber differs.</Tell>
    <Steps>
      <OneState world={world}/>
      <ActionsAreData/>
      <SelectorsAnswer world={world}/>
      <ExchangeIsMiddleware world={world}/>
      <WhoSubscribes world={world}/>
    </Steps>
  </Story>;
