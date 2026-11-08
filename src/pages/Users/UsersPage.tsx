import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@frame/navigation';
import {UsersTable} from './UsersTable';
import {UsersProvider} from './UsersProvider';
import {UserInformation} from './UserInformation';
import {useOpened} from './useOpened';
import './UsersPage.css';

const FormAndRoster: FC = () => {
  const open = useOpened();
  return <>
    <UserInformation className="user-form users card rounded-corners lifted padded"/>

    <section id="user-candidates" aria-labelledby="roster-title" className="user-candidates users card rounded-corners lifted padded contained">
      <h2 id="roster-title" className="roster-title title bold">User Candidates</h2>
      {open.mode === 'viewing' &&
          <Link to={Paths.users} id="add-new-user" className="add-new-user button primary">Add New User</Link>}
      <UsersTable/>
    </section>
  </>;
};

export const UsersPage: FC = () => <UsersProvider>
  <FormAndRoster/>
</UsersProvider>;
