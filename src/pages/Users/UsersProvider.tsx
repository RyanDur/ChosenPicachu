import {FC, PropsWithChildren, useEffect, useState, useSyncExternalStore} from 'react';
import {useNavigate} from 'react-router';
import {Paths} from '@navigation';
import {bannerChange, useBannerDispatch} from '@banners';
import {trouble} from '@transport';
import {maybe} from '@ryandur/sand';
import {usersApi} from './usersApi';
import {syncing} from './syncing';
import {usersActions} from './usersActions';
import {usersSlice} from './usersSlice';
import {usersStore} from './usersStore';
import {usersContexts} from './usersContexts';
import {usersServing} from './usersServing';

export const UsersProvider: FC<PropsWithChildren> = ({children}) => {
  const navigate = useNavigate();
  const dispatchBanner = useBannerDispatch();
  const [store] = useState(() => usersStore(syncing(
    usersApi,
    () => navigate(Paths.users),
    error => dispatchBanner(bannerChange.raised(trouble.with('the users server')(error)))
  )));
  const state = useSyncExternalStore(store.subscribe, () => store.state, () => usersSlice.initial);

  useEffect(() => usersServing.reach(maybe(navigator.serviceWorker), {
    reached: () => store.dispatch(usersActions.opened()),
    unreachable: () => store.dispatch(usersActions.serverUnreachable())
  }), [store]);

  return <usersContexts.State.Provider value={{state, dispatch: store.dispatch}}>
    {children}
  </usersContexts.State.Provider>;
};
