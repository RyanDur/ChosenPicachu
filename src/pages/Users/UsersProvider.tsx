import {FC, PropsWithChildren, useEffect, useState, useSyncExternalStore} from 'react';
import {useNavigate} from 'react-router';
import {Paths} from '@frame/navigation';
import {bannerChange, useBannerDispatch} from '@frame/notices/Banners';
import {troubleWith} from '@transport';
import {usersApi} from './resource';
import {syncing} from './syncing';
import {usersActions} from './usersActions';
import {usersSlice} from './usersSlice';
import {usersStore} from './usersStore';
import {usersContexts} from './usersContexts';

export const UsersProvider: FC<PropsWithChildren> = ({children}) => {
  const navigate = useNavigate();
  const dispatchBanner = useBannerDispatch();
  const [store] = useState(() => usersStore(syncing(
    usersApi,
    () => navigate(Paths.users),
    error => dispatchBanner(bannerChange.raised(troubleWith('the users')(error)))
  )));
  const state = useSyncExternalStore(store.subscribe, () => store.state, () => usersSlice.initial);

  useEffect(() => {
    store.dispatch(usersActions.opened());
  }, [store]);

  return <usersContexts.State.Provider value={{state, dispatch: store.dispatch}}>
    {children}
  </usersContexts.State.Provider>;
};
