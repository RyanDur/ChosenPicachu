import {has} from '@ryandur/sand';
import {Labelled, Seated} from '@components/DragSortableTable/model';
import {User} from './profile';

export type Candidate = Labelled;

type UserColumns = {
  all: readonly {name: string; data: Candidate}[];
  seated: (users: readonly User[]) => readonly Seated[];
  worksFromHome: (user: User) => string;
};

const worksFromHome = (user: User): string => user.work === 'home' ? 'Yes' : 'No';

export const userColumns: UserColumns = {
  all: [
    {name: 'full-name', data: {label: 'Full Name'}},
    {name: 'home-city', data: {label: 'Home City'}},
    {name: 'age', data: {label: 'Age'}},
    {name: 'friends', data: {label: 'Friends'}},
    {name: 'works-from-home', data: {label: 'Works from Home'}}
  ],
  seated: users => users.map(user => ({
    key: user.id,
    values: {
      age: has(user.person.dateOfBirth) ? -user.person.dateOfBirth.getTime() : undefined,
      'works-from-home': worksFromHome(user)
    }
  })),
  worksFromHome
};
