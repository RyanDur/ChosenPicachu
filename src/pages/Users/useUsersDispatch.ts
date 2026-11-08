import {Dispatch, useContext} from 'react';
import {UsersAction} from './usersActions';
import {usersContexts} from './usersContexts';

export const useUsersDispatch = (): Dispatch<UsersAction> => useContext(usersContexts.State).dispatch;
