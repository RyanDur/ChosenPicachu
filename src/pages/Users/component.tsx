import {FC, useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import * as D from 'schemawax';
import {User, UserInformation, users as usersApi, UsersLinks} from '@components/Users';
import {equalAddresses} from './addresses';
import {Paths} from '@pages/Paths';
import {has} from '@ryandur/sand';
import {EagerHideAnimatedTable} from '@components/DragSortableTable';
import {Menu} from '@components/Menu';
import {age, formatAge, FriendsList} from '@components/Users';
import './styles.css';
import './styles.layout.css';

export const UsersPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id, mode, createSearchParams} = useSearchParamsObject({id: D.string, mode: D.string});
  const [users, updateUsers] = useState<User[]>([]);
  const [currentUser, updateCurrentUser] = useState<User>();
  const path = location.pathname;

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
    <section id="user-info" className="user-info users card" key={currentUser?.id}>
        <h2 className="title heading">User Information</h2>
        <UsersLinks.Provider value={{users: Paths.users}}><UserInformation currentUser={currentUser}
                         readOnly={mode === 'view'}
                         editing={mode === 'edit'}
                         onAdd={user => usersApi.add(user)
                           .onSuccess(updateUsers)}
                         onUpdate={user => usersApi.update({...user, friends: currentFriendsOf(user)})
                           .onSuccess(updateUsers)
                           .onSuccess(() => navigate(Paths.users))}/></UsersLinks.Provider>
      </section>

      <section id="user-candidates" className="user-candidates users card">
        <h2 className="title heading">User Candidates</h2>
        {mode === 'view' &&
            <Link to={Paths.users} id="add-new-user" className="button primary">Add New User</Link>}
        <EagerHideAnimatedTable
          id="users-table"
          tableClassName="fancy-table"
          draggableColumns
          draggableRows
          sortable
          theadClassName="header"
          trClassName="row"
          tbodyClassName="body"
          cellClassName="cell"
          columns={[
            {display: 'Full Name', column: 'fullName', className: 'full-name'},
            {display: 'Home City', column: 'homeCity', className: 'home-city'},
            {display: 'Age', column: 'age', className: 'age'},
            {display: 'Friends', column: 'friends', className: 'friends'},
            {display: 'Works from Home', column: 'worksFromHome', className: 'works-from-home'}
          ]}
          resizableColumns
          rows={users.map(user => {
            const displayFullName = (user: {
              firstName: string,
              lastName: string
            }) => `${user.firstName} ${user.lastName}`;
            return ({
              fullName: {display: displayFullName(user.info), value: displayFullName(user.info)},
              homeCity: {display: user.homeAddress.city, value: user.homeAddress.city},
              age: {display: formatAge(age(user.info.dob)), value: has(user.info.dob) ? -user.info.dob.getTime() : undefined},
              friends: {
                display: <FriendsList user={user} users={users} onChange={update(user)}/>,
                value: user.friends.length
              },
              worksFromHome: {
                value: equalAddresses(user.homeAddress, user.workAddress) ? 'Yes' : 'No',
                display: <section className="last-column">
                  {equalAddresses(user.homeAddress, user.workAddress) ? 'Yes' : 'No'}
                  <Menu id={`menu-${user.id}`}
                        label={`Actions for ${displayFullName(user.info)}`}>
                      <Link to={`${path}${createSearchParams({
                        id: user.id,
                        mode: 'view'
                      })}`}
                            className="item">View</Link>
                      <Link to={`${path}${createSearchParams({
                        id: user.id,
                        mode: 'edit'
                      })}`}
                            className="item">Edit</Link>
                      <Link to={path}
                            className="item"
                            onClick={() => usersApi.delete(user)
                              .onSuccess(updateUsers)
                              .onSuccess(() => navigate(Paths.users))}>Remove</Link>
                      <Link to={`${path}${createSearchParams({id: user.id})}`}
                            className="item">Clone</Link>
                  </Menu>
                </section>
              }
            });
          })}
        />
      </section>
  </>;
};