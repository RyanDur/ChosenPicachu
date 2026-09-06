import {FC, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {User, UserInformation, users as usersApi, UsersLinks} from '@components/Users';
import {Paths} from '@pages/Paths';
import {EagerHideAnimatedTable, SeatedTable} from '@components/DragSortableTable/EagerHideAnimatedTable';
import {CandidatesTable, candidateValues, columns} from './CandidatesTable';
import './UsersPage.css';

export const UsersPage: FC = () => {
  const navigate = useNavigate();
  const {id, mode} = useSearchParamsObject({id: schema.string, mode: schema.string});
  const [users, updateUsers] = useState<User[]>([]);
  const [currentUser, updateCurrentUser] = useState<User>();

  useEffect(() => {
    usersApi.getAll().onSuccess(updateUsers);
  }, []);

  useEffect(() => {
    id && usersApi.get(id).onSuccess(updateCurrentUser);
  }, [id]);

  const update = (user: User) => (newFriends: string[]) =>
    usersApi.update({...user, friends: newFriends})
      .onSuccess(updateUsers);

  const currentFriendsOf = (user: User): string[] =>
    users.find(({id: userId}) => userId === user.id)?.friends ?? user.friends;

  return <>
    <section id="user-info" className="user-info users card rounded-corners lifted padded" key={currentUser?.id}>
      <UsersLinks.Provider value={{users: Paths.users}}>
        <UserInformation
          currentUser={currentUser}
          readOnly={mode === 'view'}
          editing={mode === 'edit'}
          onAdd={user => usersApi.add(user)
            .onSuccess(updateUsers)}
          onUpdate={user => usersApi.update({...user, friends: currentFriendsOf(user)})
            .onSuccess(updateUsers)
            .onSuccess(() => navigate(Paths.users))}/></UsersLinks.Provider>
    </section>

    <section id="user-candidates" className="user-candidates users card rounded-corners lifted padded">
      <h2 className="roster-title title bold">User Candidates</h2>
      {mode === 'view' &&
          <Link to={Paths.users} id="add-new-user" className="add-new-user button primary">Add New User</Link>}
      <SeatedTable columns={columns} values={users.map(candidateValues)}>
        <EagerHideAnimatedTable>
          <CandidatesTable
            users={users}
            onFriends={update}
            onRemove={user => usersApi.delete(user)
              .onSuccess(updateUsers)
              .onSuccess(() => navigate(Paths.users))}/>
        </EagerHideAnimatedTable>
      </SeatedTable>
    </section>
  </>;
};