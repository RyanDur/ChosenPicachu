import {FC, PropsWithChildren, ReactNode} from 'react';
import {Defined} from '../../Recipe/Defined';

export type Word =
  | 'aloft' | 'survey' | 'drift'
  | 'strike' | 'settle' | 'landing' | 'seats' | 'share' | 'travel' | 'reconcile'
  | 'sort' | 'standing'
  | 'store' | 'action' | 'reducer' | 'selector' | 'middleware';

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
  reconcile: 'walking the DOM to match the state, moving only what changed',
  sort: 'the chosen column and direction: what the rows rank by, held by the page beside its order',
  standing: 'the rows’ order on screen: the seats as they stand, ranked by the sort while one holds',
  store: 'one value, one dispatch, one subscribe: a state and the only way in or out',
  action: 'a record of what happened: a type and the facts; dispatch hands it to the reducer',
  reducer: 'the one function from the old state and an action to the new state; it reads the type and calls the verb',
  selector: 'a named function from the state to an answer; the name is the question',
  middleware: 'given the store’s face, then the next dispatch, the dispatch for its place in the chain: it sees every action before the reducer, and may dispatch itself'
};

export const Term: FC<PropsWithChildren<{word: Word}>> = ({word, children}) =>
  <Defined term={word} definition={definitions[word]}>{children ?? word}</Defined>;
