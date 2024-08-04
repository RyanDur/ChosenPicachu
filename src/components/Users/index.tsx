import {FC, useEffect, useState} from 'react';
import {AddressInfo, User} from '../UserInfo/types';
import {UserInformation} from '../UserInfo';
import {Table} from '../Table';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {age, formatAge} from '../util';
import {useQuery} from '../hooks';
import {FriendsList} from '../SelectList';
import {data} from '../../data';
import {Paths} from '../../routes/Paths.ts';
import './Users.css';
import './Users.layout.css';

export const Users: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {queryObj: {id, mode}, nextQueryString, path} = useQuery<{ id: string, mode: string }>();
  const [users, updateUsers] = useState<User[]>([]);
  const [currentUser, updateCurrentUser] = useState<User>();

  useEffect(() => {
    data.usersApi.getAll().onSuccess(updateUsers);
  }, []);

  useEffect(() => {
    id && data.usersApi.get(id).onSuccess(updateCurrentUser);
  }, [id]);

  const equalAddresses = (address1: AddressInfo, address2: AddressInfo = {} as AddressInfo): boolean =>
    Object.keys(address1).reduce((_, key) =>
      address1[key as keyof AddressInfo] === address2[key as keyof AddressInfo], Boolean());

  const update = (user: User) => (newFriends: User[]) =>
    data.usersApi.update({...user, friends: newFriends})
      .onSuccess(updateUsers);

  return <>
    <section id="user-info" className="card users" key={currentUser?.id}>
      <h2 className="title">User Information</h2>
      <UserInformation currentUser={currentUser}
                       readOnly={mode === 'view'}
                       editing={mode === 'edit'}
                       onAdd={user => data.usersApi.add(user)
                         .onSuccess(updateUsers)}
                       onUpdate={user => data.usersApi.update(user)
                         .onSuccess(updateUsers)
                         .onSuccess(() => navigate(Paths.users))}/>
    </section>

    <section id="user-candidates" className="card users">
      <h2 className="title">User Candidates</h2>
      {mode === 'view' &&
        <Link to={Paths.users} id="add-new-user" className="button primary">Add New User</Link>}
      <Table
        id="users-table"
        tableClassName="fancy-table"
        theadClassName="header"
        trClassName="row"
        tbodyClassName="body"
        cellClassName="cell"
        columns={[
          {display: 'Full Name', column: 'fullName'},
          {display: 'Home City', column: 'homeCity'},
          {display: 'Age', column: 'age'},
          {display: 'Friends', column: 'friends'},
          {display: 'Works from Home', column: 'worksFromHome'}
        ]}
        rows={users.map(user => {
          const displayFullName = (user: {
            firstName: string,
            lastName: string
          }) => `${user.firstName} ${user.lastName}`;
          return ({
            fullName: {display: displayFullName(user.info)},
            homeCity: {display: user.homeAddress.city},
            age: {display: formatAge(age(user.info.dob))},
            friends: {
              display: <FriendsList user={user} users={users} onChange={update(user)}
                                    key={user.friends.length}/>
            },
            worksFromHome: {
              display: <section className="last-column">
                {equalAddresses(user.homeAddress, user.workAddress) ? 'Yes' : 'No'}
                <article tabIndex={0} className="menu-toggle rounded-corners" onKeyDown={event => {
                  event.preventDefault();
                  if (event.code === 'Space') {
                    event.currentTarget.classList.toggle('open');
                  }
                }} onBlur={event => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    event.currentTarget.classList.remove('open');
                  }
                }} onClick={event => event.currentTarget.classList.remove('open')}>
                  <nav className="menu rounded-corners">
                    <Link to={`${path}${nextQueryString({
                      id: user.id,
                      mode: 'view'
                    })}`}
                          className="item"
                          data-testid="view">View</Link>
                    <Link to={`${path}${nextQueryString({
                      id: user.id,
                      mode: 'edit'
                    })}`}
                          className="item"
                          data-testid="view">Edit</Link>
                    <Link to={id === user.id ? path : location.pathname}
                          className="item"
                          onClick={() => data.usersApi.delete(user)
                            .onSuccess(updateUsers)
                            .onSuccess(() => navigate(Paths.users))}
                          data-testid="remove">Remove</Link>
                    <Link to={`${path}${nextQueryString({id: user.id})}`}
                          className="item"
                          data-testid="clone">Clone</Link>
                  </nav>
                </article>
              </section>
            }
          });
        })}
      />
    </section>
  </>;
};
