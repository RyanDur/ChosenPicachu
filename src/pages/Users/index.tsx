import {Paths} from '@pages/Paths';
import {lazy} from 'react';

const UsersPage = lazy(() => import('@pages/Users/component').then(m => ({default: m.UsersPage})));

export const Users ={
  path: Paths.users,
  element: <UsersPage/>
};

