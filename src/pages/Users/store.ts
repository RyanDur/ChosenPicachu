import {Listener, Store, sliced, store} from '@components/store';
import {NewUser, User, UserEdit} from '@components/Users';

export type UsersState = {
  readonly users: readonly User[];
};

export type UsersAction =
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

const roster = (users: readonly User[], action: UsersAction): readonly User[] =>
  action.type === 'usersArrived' ? action.users : users;

export const usersSlice = sliced<UsersState, UsersAction>({
  users: {initial: [], reduce: roster}
});

export const selectUsers = ({users}: UsersState): readonly User[] => users;

export const usersStore = (...listeners: UsersListener[]): UsersStore => {
  const users = store({slice: usersSlice});
  listeners.forEach(listener => users.subscribe(listener));
  return users;
};
