import {Maybe, maybe} from '@ryandur/sand';
import {arrangements, TableColumn} from '@components/DragSortableTable/model';
import {User} from './profile';
import {Candidate, userColumns} from './columns';
import {UsersState} from './usersSlice';

const inOrder = (users: readonly User[], order: readonly string[]): readonly User[] =>
  order.flatMap(id => users.filter(user => user.id === id));

const valueOf = (users: readonly User[]) => (row: string, column: string) =>
  userColumns.seated(users).find(({key}) => key === row)?.values[column];

type UsersSelectors = {
  users: (state: UsersState) => readonly User[];
  columns: (state: UsersState) => readonly TableColumn<Candidate>[];
  withId: (id?: string) => (state: UsersState) => Maybe<User>;
};

export const usersSelectors: UsersSelectors = {
  users: ({users, arrangement}) => inOrder(users, arrangements.standingOf(arrangement, valueOf(users))),
  columns: ({arrangement}) => arrangement.columns.map(name => ({
    name,
    data: userColumns.all.find(column => column.name === name)?.data ?? {label: name},
    sorted: arrangement.sort?.column === name ? arrangement.sort.direction : undefined
  })),
  withId: id => ({users}) => maybe(users.find(user => user.id === id))
};
