import React, {FC, useEffect, useState} from 'react';
import {AddressInfo, User} from '../UserInfo/types';
import {UserInformation} from '../UserInfo';
import {Table} from '../Table';
import {Link, useHistory} from 'react-router-dom';
import {Paths} from '../../App';
import {age, formatAge} from '../util';
import {useQuery} from '../hooks';
import {FriendsList} from '../SelectList';
import {data} from '../../data';
import {AsyncState} from '@ryandur/sand';
import './Users.scss';
import './Users.layout.scss';

export const Users: FC = () => {
    const history = useHistory();
    const {queryObj: {email, mode}, nextQueryString, path} = useQuery<{ email: string, mode: string }>();
    const [users, updateNewUsers] = useState<User[]>([]);
    const currentUser: User | undefined = users.find(({info}) => info.email === email);

    useEffect(() => data.users.getAll().onAsyncEvent(event => {
        if (event.state === AsyncState.LOADED) updateNewUsers(event.data);
    }), []);

    const removeUserInfo = (item: User, list: User[] = []): User[] => {
        const index = list.indexOf(item);
        return [...list.slice(0, index), ...list.slice(index + 1)];
    };

    const equalAddresses = (address1: AddressInfo, address2: AddressInfo = {} as AddressInfo): boolean =>
        Object.keys(address1).reduce((acc, key) =>
            address1[key as keyof AddressInfo] === address2[key as keyof AddressInfo], Boolean());

    return <>
        <section id="user-info" className="card users" key={currentUser?.info.email}>
            <h2 className="title">User Information</h2>
            <UserInformation currentUserInfo={currentUser}
                             readOnly={mode === 'view'}
                             editing={mode === 'edit'}
                             onAdd={user => updateNewUsers([user, ...users])}
                             onUpdate={user => {
                                 currentUser && updateNewUsers([user, ...removeUserInfo(currentUser, users)]);
                                 history.push(Paths.users);
                             }}/>
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
                    const displayFullName = (user: { firstName: string, lastName: string }) => `${user.firstName} ${user.lastName}`;
                    return ({
                        fullName: {display: displayFullName(user.info)},
                        homeCity: {display: user.homeAddress.city},
                        age: {display: formatAge(age(user.info.dob))},
                        friends: {
                            display: <FriendsList users={users.filter(({info}) => info !== user.info)}
                                                  friends={user.friends}
                                                  onChange={newFriends => {
                                                      user.friends = newFriends;
                                                  }}/>
                        },
                        worksFromHome: {
                            display: <section className="last-column">
                                {equalAddresses(user.homeAddress, user.workAddress) ? 'Yes' : 'No'}
                                <article tabIndex={0} className="menu-toggle rounded-corners" onKeyPress={event => {
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
                                            email: user.info.email,
                                            mode: 'view'
                                        })}`}
                                              className='item'
                                              data-testid="view">View</Link>
                                        <Link to={`${path}${nextQueryString({
                                            email: user.info.email,
                                            mode: 'edit'
                                        })}`}
                                              className='item'
                                              data-testid="view">Edit</Link>
                                        <Link to={email === user.info.email ? path : history.location}
                                              className='item'
                                              onClick={() => updateNewUsers(removeUserInfo(user, users))}
                                              data-testid="remove">Remove</Link>
                                        <Link to={`${path}${nextQueryString({email: user.info.email})}`}
                                              className='item'
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