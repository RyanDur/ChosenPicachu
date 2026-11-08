import {Listener, Store, store} from '@components/store';
import {UsersAction} from './usersActions';
import {UsersState, usersSlice} from './usersSlice';

export type UsersStore = Store<UsersState, UsersAction>;
export type UsersListener = Listener<UsersState, UsersAction>;

export const usersStore = (...listeners: UsersListener[]): UsersStore => {
  const users = store({slice: usersSlice});
  listeners.forEach(listener => users.subscribe(listener));
  return users;
};
