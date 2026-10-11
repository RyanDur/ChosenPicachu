import {FC, useEffect, useState, useSyncExternalStore} from 'react';
import {Link, useNavigate} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import * as schema from 'schemawax';
import {users as usersApi} from '@components/Users';
import {Paths} from '@pages/Paths';
import {UsersTable} from './UsersTable';
import {UsersProvider} from './Provider';
import {syncing} from './syncing';
import {opened, usersStore, userWithId} from './store';
import {UserInformation} from './UserInformation';
import {modeParam, openedOn} from './mode';
import './UsersPage.css';

export const UsersPage: FC = () => {
  const navigate = useNavigate();
  const {raise} = useBanners();
  const {id, mode: param} = useSearchParamsObject({id: schema.string, mode: modeParam});
  const [store] = useState(() => usersStore(syncing(usersApi, () => navigate(Paths.users), error => raise(troubleWith('the users')(error)))));
  const open = openedOn(userWithId(id)(useSyncExternalStore(store.subscribe, () => store.state)), param);

  useEffect(() => {
    store.dispatch(opened());
  }, [store]);

  return <UsersProvider store={store}>
    <UserInformation open={open} className="user-info users card rounded-corners lifted padded"/>

    <section id="user-candidates" aria-labelledby="roster-title" className="user-candidates users card rounded-corners lifted padded contained">
      <h2 id="roster-title" className="roster-title title bold">User Candidates</h2>
      {open.mode === 'viewing' &&
          <Link to={Paths.users} id="add-new-user" className="add-new-user button primary">Add New User</Link>}
      <UsersTable/>
    </section>
  </UsersProvider>;
};
