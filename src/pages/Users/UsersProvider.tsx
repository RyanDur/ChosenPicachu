import {FC, PropsWithChildren, useEffect, useState, useSyncExternalStore} from 'react';
import {useNavigate} from 'react-router';
import {Paths} from '@navigation';
import {bannerChange, useBannerDispatch} from '@banners';
import {HTTPError, trouble} from '@transport';
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

  useEffect(() => {
    const unreachableBanner = bannerChange.raised(trouble.with('the users server')(HTTPError.NETWORK_ERROR));
    return usersServing.reach(maybe(navigator.serviceWorker), {
      reached: () => {
        dispatchBanner(bannerChange.lowered(unreachableBanner.banner.id));
        store.dispatch(usersActions.opened());
      },
      unreachable: () => {
        dispatchBanner(unreachableBanner);
        store.dispatch(usersActions.serverUnreachable());
      }
    });
  }, [store, dispatchBanner]);

  return <usersContexts.State.Provider value={{state, dispatch: store.dispatch}}>
    {children}
  </usersContexts.State.Provider>;
};
