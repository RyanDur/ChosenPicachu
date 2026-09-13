import {FC, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {users as usersApi} from '@components/Users';
import {Paths} from '@pages/Paths';
import {UsersTable} from './UsersTable';
import {UsersProvider} from './Provider';
import {syncing} from './syncing';
import {opened, usersStore} from './store';
import {UserInformation} from './UserInformation';
import {modeOf} from './mode';
import './UsersPage.css';

export const UsersPage: FC = () => {
  const navigate = useNavigate();
  const {id, mode: param} = useSearchParamsObject({id: schema.string, mode: schema.string});
  const mode = modeOf(param);
  const [store] = useState(() => usersStore(syncing(usersApi, () => navigate(Paths.users))));

  useEffect(() => {
    store.dispatch(opened());
  }, [store]);

  return <UsersProvider store={store}>
    <section id="user-info" className="user-info users card rounded-corners lifted padded">
      <UserInformation id={id} mode={mode}/>
    </section>

    <section id="user-candidates" className="user-candidates users card rounded-corners lifted padded">
      <h2 className="roster-title title bold">User Candidates</h2>
      {mode === 'viewing' &&
          <Link to={Paths.users} id="add-new-user" className="add-new-user button primary">Add New User</Link>}
      <UsersTable/>
    </section>
  </UsersProvider>;
};
