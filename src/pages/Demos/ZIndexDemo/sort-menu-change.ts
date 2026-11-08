import {SortChoice} from './sort-choices';

type Opened = {readonly type: 'opened'};
type Closed = {readonly type: 'closed'};
type Chosen = {readonly type: 'chosen'; readonly choice: SortChoice};

export type SortMenuChange = Opened | Closed | Chosen;

export const sortMenuChange = {
  opened: (): Opened => ({type: 'opened'}),
  closed: (): Closed => ({type: 'closed'}),
  chosen: (choice: SortChoice): Chosen => ({type: 'chosen', choice})
};
