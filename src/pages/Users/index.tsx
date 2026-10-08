import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {UsersPage} from '@pages/Users/UsersPage';
import names from '@pages/names.json';

const UsersHeader = () => <Header title="Users" named={names.users}/>;

export const Users = {
  path: Paths.users,
  errorElement: <PageError/>,
  handle: {header: UsersHeader},
  element: <UsersPage/>
};
