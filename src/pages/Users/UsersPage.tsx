import {FC, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {User, UserInformation, users as usersApi, UsersLinks} from '@components/Users';
import {equalAddresses} from './addresses';
import {Paths} from '@pages/Paths';
import {has} from '@ryandur/sand';
import {EagerHideAnimatedTable} from '@components/DragSortableTable';
import {Cell, Column, Row} from '@components/Table';
import {age, formatAge, FriendsList, UserMenu} from '@components/Users';
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
        <UsersLinks.Provider value={{users: Paths.users}}><UserInformation currentUser={currentUser}
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
        <EagerHideAnimatedTable id="users-table" draggableColumns draggableRows sortable resizableColumns>
          <Column name="fullName" className="full-name">Full Name</Column>
          <Column name="homeCity" className="home-city">Home City</Column>
          <Column name="age" className="age" sortable>Age</Column>
          <Column name="friends" className="friends">Friends</Column>
          <Column name="worksFromHome" className="works-from-home" sortable>Works from Home</Column>

          {users.map(user => {
            const name = `${user.info.firstName} ${user.info.lastName}`;
            const worksFromHome = equalAddresses(user.homeAddress, user.workAddress) ? 'Yes' : 'No';

            return <Row key={user.id}>
              <Cell column="fullName">{name}</Cell>
              <Cell column="homeCity">{user.homeAddress.city}</Cell>
              <Cell column="age" value={has(user.info.dob) ? -user.info.dob.getTime() : undefined}>
                {formatAge(age(user.info.dob))}
              </Cell>
              <Cell column="friends">
                <FriendsList user={user} users={users} onChange={update(user)}/>
              </Cell>
              <Cell column="worksFromHome" value={worksFromHome}>
                <section className="last-column">
                  {worksFromHome}
                  <UserMenu user={user} name={name}
                            onRemove={() => usersApi.delete(user)
                              .onSuccess(updateUsers)
                              .onSuccess(() => navigate(Paths.users))}/>
                </section>
              </Cell>
            </Row>;
          })}
        </EagerHideAnimatedTable>
      </section>
  </>;
};