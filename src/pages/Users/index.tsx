import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {lazy} from 'react';

const UsersPage = lazy(() => import('@pages/Users/component').then(m => ({default: m.UsersPage})));

const UsersHeader = () => <Header title="Users"/>;

export const Users = {
  path: Paths.users,
  errorElement: <PageError/>,
  handle: {header: UsersHeader},
  element: <UsersPage/>
};
