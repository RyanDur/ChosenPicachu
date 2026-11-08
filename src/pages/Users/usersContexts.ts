import {Dispatch, createContext} from 'react';
import {UsersAction} from './usersActions';
import {UsersState, usersSlice} from './usersSlice';

type UsersContext = {
  readonly state: UsersState;
  readonly dispatch: Dispatch<UsersAction>;
};

export const usersContexts = {
  State: createContext<UsersContext>({state: usersSlice.initial, dispatch: () => undefined})
};
