import {Slice, slices} from '@components/store';
import {Arrangement, arrangements} from '@components/DragSortableTable/model';
import {User} from './profile';
import {UsersAction} from './usersActions';
import {userColumns} from './columns';
import {Membership} from './memberships';

export type FriendsReports = Readonly<Partial<Record<string, Membership>>>;

export type UsersState = {
  readonly users: readonly User[];
  readonly arrangement: Arrangement;
  readonly friendsReports: FriendsReports;
  readonly confirmedAdds: number;
  readonly addInFlight: boolean;
};

const ids = (users: readonly User[]): readonly string[] => users.map(({id}) => id);

const roster = (users: readonly User[], action: UsersAction): readonly User[] =>
  action.type === 'usersArrived' ? action.users : users;

const reporting = (reports: FriendsReports, action: UsersAction): FriendsReports => {
  switch (action.type) {
    case 'friendAdded':
      return {...reports, [action.userId]: {change: 'added', friendId: action.friendId}};
    case 'friendRemoved':
      return {...reports, [action.userId]: {change: 'removed', friendId: action.friendId}};
    default:
      return reports;
  }
};

const confirming = (count: number, action: UsersAction): number =>
  action.type === 'userAddConfirmed' ? count + 1 : count;

const awaitingAdd = (inFlight: boolean, action: UsersAction): boolean => {
  switch (action.type) {
    case 'userAdded':
      return true;
    case 'userAddConfirmed':
    case 'userAddRefused':
      return false;
    default:
      return inFlight;
  }
};

const seating = (arrangement: Arrangement, action: UsersAction): Arrangement =>
  arrangements.reducer(arrangement, action.type === 'usersArrived' ? arrangements.arrived(ids(action.users)) : action);

export const usersSlice: Slice<UsersState, UsersAction> = slices.combined<UsersState, UsersAction>({
  users: {initial: [], reduce: roster},
  arrangement: {initial: arrangements.of(userColumns.all.map(({name}) => name)), reduce: seating},
  friendsReports: {initial: {}, reduce: reporting},
  confirmedAdds: {initial: 0, reduce: confirming},
  addInFlight: {initial: false, reduce: awaitingAdd}
});
