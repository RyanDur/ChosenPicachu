import {Slice, sliced} from '@components/store';
import {Arrangement, arrangements} from '@components/DragSortableTable/model';
import {User} from './profile';
import {UsersAction} from './usersActions';
import {userColumns} from './columns';
import {Membership} from './memberships';

export type FriendsReport =
  | {readonly stage: 'quiet'}
  | {readonly stage: 'asked'; readonly userId: string; readonly membership: Membership};

export type UsersState = {
  readonly users: readonly User[];
  readonly arrangement: Arrangement;
  readonly friendsReport: FriendsReport;
};

const ids = (users: readonly User[]): readonly string[] => users.map(({id}) => id);

const roster = (users: readonly User[], action: UsersAction): readonly User[] =>
  action.type === 'usersArrived' ? action.users : users;

const reporting = (report: FriendsReport, action: UsersAction): FriendsReport => {
  switch (action.type) {
    case 'friendAdded':
      return {stage: 'asked', userId: action.userId, membership: {change: 'added', friendId: action.friendId}};
    case 'friendRemoved':
      return {stage: 'asked', userId: action.userId, membership: {change: 'removed', friendId: action.friendId}};
    default:
      return report;
  }
};

const seating = (arrangement: Arrangement, action: UsersAction): Arrangement =>
  arrangements.reducer(arrangement, action.type === 'usersArrived' ? arrangements.arrived(ids(action.users)) : action);

export const usersSlice: Slice<UsersState, UsersAction> = sliced<UsersState, UsersAction>({
  users: {initial: [], reduce: roster},
  arrangement: {initial: arrangements.of(userColumns.all.map(({name}) => name)), reduce: seating},
  friendsReport: {initial: {stage: 'quiet'}, reduce: reporting}
});
