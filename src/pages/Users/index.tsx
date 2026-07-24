import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {UsersPage} from '@pages/Users/component';

const UsersHeader = () => <Header title="Users"/>;

export const Users = {
  path: Paths.users,
  errorElement: <PageError/>,
  handle: {header: UsersHeader},
  element: <UsersPage/>
};
