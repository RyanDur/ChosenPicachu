import {Listener, Store, sliced, store} from '@components/store';
import {NewUser, User, UserEdit} from '@components/Users';
import {Arrangement, ArrangementAction, arrangementOf, arrangementReducer, movedTo, seatingOf, standingOf} from '@components/DragSortableTable/arrangement';
import {TableColumn} from '@components/DragSortableTable/table-state';
import {Candidate, columns, seated} from './columns';

export type UsersState = {
  readonly users: readonly User[];
  readonly arrangement: Arrangement;
};

export type UsersAction =
  | ArrangementAction
  | {readonly type: 'opened'}
  | {readonly type: 'usersArrived'; readonly users: readonly User[]}
  | {readonly type: 'userAdded'; readonly user: NewUser}
  | {readonly type: 'userUpdated'; readonly edit: UserEdit}
  | {readonly type: 'userRemoved'; readonly user: User}
  | {readonly type: 'friendsChanged'; readonly user: User; readonly friends: readonly string[]};

export type UsersStore = Store<UsersState, UsersAction>;
export type UsersListener = Listener<UsersState, UsersAction>;

export const opened = (): UsersAction => ({type: 'opened'});
export const usersArrived = (users: readonly User[]): UsersAction => ({type: 'usersArrived', users});
export const userAdded = (user: NewUser): UsersAction => ({type: 'userAdded', user});
export const userUpdated = ({friends: _friends, ...edit}: User): UsersAction => ({type: 'userUpdated', edit});
export const userRemoved = (user: User): UsersAction => ({type: 'userRemoved', user});
export const friendsChanged = (user: User, friends: readonly string[]): UsersAction => ({type: 'friendsChanged', user, friends});

export const userWithId = (id?: string) => ({users}: UsersState): User | undefined =>
  users.find(user => user.id === id);

const ids = (users: readonly User[]): readonly string[] => users.map(({id}) => id);

const inOrder = (users: readonly User[], order: readonly string[]): readonly User[] =>
  order.flatMap(id => users.filter(user => user.id === id));

const roster = (users: readonly User[], action: UsersAction): readonly User[] => {
  switch (action.type) {
    case 'usersArrived': return inOrder(action.users, seatingOf(ids(users), ids(action.users)));
    case 'rowMoved': return inOrder(users, movedTo(action.standing, action.row, action.to));
    default: return users;
  }
};

export const usersSlice = sliced<UsersState, UsersAction>({
  users: {initial: [], reduce: roster},
  arrangement: {initial: arrangementOf(columns.map(({name}) => name)), reduce: arrangementReducer}
});

const valueOf = (users: readonly User[]) => (row: string, column: string) =>
  seated(users).find(({key}) => key === row)?.values[column];

export const selectUsers = ({users, arrangement}: UsersState): readonly User[] =>
  inOrder(users, standingOf({...arrangement, rows: ids(users)}, valueOf(users)));

export const selectColumns = ({arrangement}: UsersState): readonly TableColumn<Candidate>[] =>
  arrangement.columns.map(name => ({
    name,
    data: columns.find(column => column.name === name)?.data ?? {label: name},
    sorted: arrangement.sort?.column === name ? arrangement.sort.direction : undefined
  }));

export const usersStore = (...listeners: UsersListener[]): UsersStore => {
  const users = store({slice: usersSlice});
  listeners.forEach(listener => users.subscribe(listener));
  return users;
};
