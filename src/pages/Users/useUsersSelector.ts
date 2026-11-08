import {useContext} from 'react';
import {UsersState} from './usersSlice';
import {usersContexts} from './usersContexts';

export const useUsersSelector = <Slice>(select: (state: UsersState) => Slice): Slice =>
  select(useContext(usersContexts.State).state);
