import {FC, PropsWithChildren, ReactNode} from 'react';
import {Defined} from '@pages/Demos/Recipe';

export type Word =
  | 'aloft' | 'survey' | 'drift'
  | 'strike' | 'settle' | 'landing' | 'seats' | 'share' | 'travel' | 'reconcile'
  | 'sort' | 'standing'
  | 'store' | 'slice' | 'action' | 'reducer' | 'selector' | 'middleware'
  | 'provider' | 'hook' | 'effect' | 'hydrate' | 'ledger';

const definitions: Record<Word, ReactNode> = {
  aloft: 'whatever the hand is carrying, a column by its name or a row by its key; the store holds it as the drag, absent until a lift',
  survey: 'the one measurement taken at the grab: the table’s box, every column’s width, later the row heights',
  drift: 'how far the pointer has moved since the grab; state on the drag, dispatched on every move',
  strike: 'the moment the pointer crosses far enough into a neighbour to count',
  settle: 'what a strike does: the reorder, and the shove it hands the neighbours it passed',
  landing: 'the destination a lazy drag remembers instead of settling',
  seats: 'the rows’ order: a row keeps its key while its seat changes',
  share: 'a column’s slice of the table’s width: a fraction, not a pixel',
  travel: 'everything between the lift and the drop: the shared move handling',
  reconcile: 'changing the page’s elements to match the state, touching only the ones that differ',
  sort: 'the chosen column and direction: what the rows rank by, held by the page beside its order',
  standing: 'the rows’ order on screen: the seats as they stand, ranked by the sort while one holds',
  store: 'one object that holds the state. You read the state from it, send it an action with dispatch to change it, and subscribe to be told when it has changed',
  slice: 'a reducer together with the state it starts from. A store with more than one concern joins several slices, each under its own key and each seeing only its own part',
  action: 'a plain record of something that happened: a type that names it, and the facts about it. dispatch hands it to the reducer',
  reducer: 'the function that takes the state as it was and an action, and returns the state as it now is. It never changes the old state',
  selector: 'a named function that takes the state and returns one answer from it. Its name says what is being asked',
  middleware: 'code that sits between dispatch and the reducer. It sees every action first, passes it on or not, and can dispatch actions of its own',
  provider: 'a React component that makes one value, here the store’s state and its dispatch, available to every component inside it',
  hook: 'a function, named use and something, that a React component calls to get state or behaviour from React',
  effect: 'code React runs after it has updated the page',
  hydrate: 'fill the table with the recent past, fetched once, and join it to the live trades',
  ledger: 'the table’s record of each column’s share of the width. It starts at the first touch of a resize handle, by focus or by press, and what one column gains its neighbour gives up'
};

export const Term: FC<PropsWithChildren<{word: Word}>> = ({word, children}) =>
  <Defined term={word} definition={definitions[word]}>{children ?? word}</Defined>;
