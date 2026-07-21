import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {lazy} from 'react';

const UsersPage = lazy(() => import('@pages/Users/component').then(m => ({default: m.UsersPage})));

export const Users ={
  path: Paths.users,
  errorElement: <PageError/>,
  element: <UsersPage/>
};

