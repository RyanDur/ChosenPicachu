import {FC, useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {User, UserInformation, users as usersApi, UsersLinks} from '@components/Users';
import {equalAddresses} from './addresses';
import {Paths} from '@pages/Paths';
import {has, maybe} from '@ryandur/sand';
import {EagerHideAnimatedTable} from '@components/DragSortableTable';
import {age, formatAge, FriendsList} from '@components/Users';
import './UsersPage.css';

export const UsersPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id, mode, createSearchParams} = useSearchParamsObject({id: schema.string, mode: schema.string});
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

  const dismissed = (id: string) => (): void => {
    maybe(document.getElementById(id)).map(menu => {
      if (menu.matches(':popover-open')) {
        menu.hidePopover();
      }
    });
  };

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
        <EagerHideAnimatedTable
          id="users-table"
          draggableColumns
          draggableRows
          sortable
          columns={[
            {display: 'Full Name', column: 'fullName', className: 'full-name'},
            {display: 'Home City', column: 'homeCity', className: 'home-city'},
            {display: 'Age', column: 'age', className: 'age', sortable: true},
            {display: 'Friends', column: 'friends', className: 'friends'},
            {display: 'Works from Home', column: 'worksFromHome', className: 'works-from-home', sortable: true}
          ]}
          resizableColumns
          rows={users.map(user => {
            const displayFullName = (user: {
              firstName: string,
              lastName: string
            }) => `${user.firstName} ${user.lastName}`;
            return ({
              fullName: {display: displayFullName(user.info)},
              homeCity: {display: user.homeAddress.city},
              age: {display: formatAge(age(user.info.dob)), value: has(user.info.dob) ? -user.info.dob.getTime() : undefined},
              friends: {
                display: <FriendsList user={user} users={users} onChange={update(user)}/>
              },
              worksFromHome: {
                value: equalAddresses(user.homeAddress, user.workAddress) ? 'Yes' : 'No',
                display: <section className="last-column">
                  {equalAddresses(user.homeAddress, user.workAddress) ? 'Yes' : 'No'}
                  <button type="button" className="menu-toggle rounded-corners raisable"
                          popoverTarget={`menu-${user.id}`}
                          aria-label={`Actions for ${displayFullName(user.info)}`}/>
                  <menu id={`menu-${user.id}`} popover="auto" className="menu card rounded-corners lifted">
                      <li className="entry"><Link to={`${path}${createSearchParams({
                        id: user.id,
                        mode: 'view'
                      })}`}
                            onClick={dismissed(`menu-${user.id}`)}
                            className="item sub-title">View</Link></li>
                      <li className="entry"><Link to={`${path}${createSearchParams({
                        id: user.id,
                        mode: 'edit'
                      })}`}
                            onClick={dismissed(`menu-${user.id}`)}
                            className="item sub-title">Edit</Link></li>
                      <li className="entry"><Link to={path}
                            className="item sub-title"
                            onClick={() => {
                              dismissed(`menu-${user.id}`)();
                              usersApi.delete(user)
                                .onSuccess(updateUsers)
                                .onSuccess(() => navigate(Paths.users));
                            }}>Remove</Link></li>
                      <li className="entry"><Link to={`${path}${createSearchParams({id: user.id})}`}
                            onClick={dismissed(`menu-${user.id}`)}
                            className="item sub-title">Clone</Link></li>
                  </menu>
                </section>
              }
            });
          })}
        />
      </section>
  </>;
};