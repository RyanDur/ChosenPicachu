import {Dispatch, PropsWithChildren, ReactNode, createContext, useContext, useSyncExternalStore} from 'react';
import {UsersAction, UsersState, UsersStore, usersSlice} from './store';

type UsersContext = {
  state: UsersState;
  dispatch: Dispatch<UsersAction>;
};

const Users = createContext<UsersContext>({state: usersSlice.initial, dispatch: () => undefined});

export const UsersProvider = ({store, children}: PropsWithChildren<{store: UsersStore}>): ReactNode => {
  const state = useSyncExternalStore(store.subscribe, () => store.state);

  return <Users.Provider value={{state, dispatch: store.dispatch}}>
    {children}
  </Users.Provider>;
};

export const useUsersSelector = <Slice,>(select: (state: UsersState) => Slice): Slice => select(useContext(Users).state);

export const useUsersDispatch = (): Dispatch<UsersAction> => useContext(Users).dispatch;
