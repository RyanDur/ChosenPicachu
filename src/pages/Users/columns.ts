import {has} from '@ryandur/sand';
import {Labelled, Seated} from '@components/DragSortableTable/table-state';
import {User} from '@components/Users';
import {equalAddresses} from './addresses';

export const worksFromHome = (user: User): string =>
  equalAddresses(user.homeAddress, user.workAddress) ? 'Yes' : 'No';

export type Candidate = Labelled;

export const columns: readonly {name: string; data: Candidate}[] = [
  {name: 'full-name', data: {label: 'Full Name'}},
  {name: 'home-city', data: {label: 'Home City'}},
  {name: 'age', data: {label: 'Age'}},
  {name: 'friends', data: {label: 'Friends'}},
  {name: 'works-from-home', data: {label: 'Works from Home'}}
];

// what the table is told about a user: their id, and what they rank by under each column that ranks
export const seated = (users: readonly User[]): readonly Seated[] =>
  users.map(user => ({
    key: user.id,
    values: {
      age: has(user.info.dob) ? -user.info.dob.getTime() : undefined,
      'works-from-home': worksFromHome(user)
    }
  }));
