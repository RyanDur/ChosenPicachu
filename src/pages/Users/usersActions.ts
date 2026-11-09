import {ArrangementAction} from '@components/DragSortableTable/model';
import {NewUser, User, UserEdit} from './profile';

export type UsersAction =
  | ArrangementAction
  | {readonly type: 'opened'}
  | {readonly type: 'serverUnreachable'}
  | {readonly type: 'usersArrived'; readonly users: readonly User[]}
  | {readonly type: 'rosterRefused'}
  | {readonly type: 'userAdded'; readonly user: NewUser}
  | {readonly type: 'userAddConfirmed'}
  | {readonly type: 'userAddRefused'}
  | {readonly type: 'userUpdated'; readonly edit: UserEdit}
  | {readonly type: 'userRemoved'; readonly user: User}
  | {readonly type: 'friendAdded'; readonly userId: string; readonly friendId: string}
  | {readonly type: 'friendRemoved'; readonly userId: string; readonly friendId: string};

type UsersActions = {
  opened: () => UsersAction;
  serverUnreachable: () => UsersAction;
  usersArrived: (users: readonly User[]) => UsersAction;
  rosterRefused: () => UsersAction;
  userAdded: (user: NewUser) => UsersAction;
  userAddConfirmed: () => UsersAction;
  userAddRefused: () => UsersAction;
  userUpdated: (user: User) => UsersAction;
  userRemoved: (user: User) => UsersAction;
  friendAdded: (userId: string, friendId: string) => UsersAction;
  friendRemoved: (userId: string, friendId: string) => UsersAction;
};

export const usersActions: UsersActions = {
  opened: () => ({type: 'opened'}),
  serverUnreachable: () => ({type: 'serverUnreachable'}),
  usersArrived: users => ({type: 'usersArrived', users}),
  rosterRefused: () => ({type: 'rosterRefused'}),
  userAdded: user => ({type: 'userAdded', user}),
  userAddConfirmed: () => ({type: 'userAddConfirmed'}),
  userAddRefused: () => ({type: 'userAddRefused'}),
  userUpdated: ({friends: _friends, ...edit}) => ({type: 'userUpdated', edit}),
  userRemoved: user => ({type: 'userRemoved', user}),
  friendAdded: (userId, friendId) => ({type: 'friendAdded', userId, friendId}),
  friendRemoved: (userId, friendId) => ({type: 'friendRemoved', userId, friendId})
};
