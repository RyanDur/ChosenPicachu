import {has, Maybe, maybe} from '@ryandur/sand';
import {arrangements, TableColumn} from '@components/DragSortableTable/model';
import {User} from './profile';
import {ColumnLabel, userColumns} from './columns';
import {Membership} from './memberships';
import {RosterRequest, UsersState} from './usersSlice';

const holdingAdds: ReadonlySet<RosterRequest> = new Set(['waiting', 'unreachable']);

const inOrder = (users: readonly User[], order: readonly string[]): readonly User[] =>
  order.flatMap(id => users.filter(user => user.id === id));

const valueOf = (users: readonly User[]) => (row: string, column: string) =>
  maybe(userColumns.seated(users).find(({key}) => key === row)).map(seated => seated.values[column]).orElse(undefined);

type UsersSelectors = {
  users: (state: UsersState) => readonly User[];
  columns: (state: UsersState) => readonly TableColumn<ColumnLabel>[];
  withId: (id?: string) => (state: UsersState) => Maybe<User>;
  friendsReportOf: (userId: string) => (state: UsersState) => Maybe<Membership>;
  confirmedAdds: (state: UsersState) => number;
  addInFlight: (state: UsersState) => boolean;
  addWaits: (state: UsersState) => boolean;
};

export const usersSelectors: UsersSelectors = {
  users: ({users, arrangement}) => inOrder(users, arrangements.standingOf(arrangement, valueOf(users))),
  columns: ({arrangement}) => arrangement.columns.map(name => ({
    name,
    data: maybe(userColumns.all.find(column => column.name === name)).map(column => column.data).orElse({label: name}),
    sorted: has(arrangement.sort) && arrangement.sort.column === name ? arrangement.sort.direction : undefined
  })),
  withId: id => ({users}) => maybe(users.find(user => user.id === id)),
  friendsReportOf: userId => ({friendsReports}) => maybe(friendsReports[userId]),
  confirmedAdds: ({confirmedAdds}) => confirmedAdds,
  addInFlight: ({addInFlight}) => addInFlight,
  addWaits: ({addInFlight, rosterRequest}) => addInFlight || holdingAdds.has(rosterRequest)
};
