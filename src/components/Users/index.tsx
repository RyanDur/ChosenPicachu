import React, {FC, useState} from 'react';
import {UserInfo} from '../UserInfo/types';
import {UserInformation} from '../UserInfo';
import {Table} from '../Table';
import {createRandomUsers} from '../../__tests__/util';
import {Link, useLocation} from 'react-router-dom';
import {Paths} from '../../App';
import './Users.css';
import './Users.layout.css';

const useQuery = <T extends Object>(): T => useLocation().search
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((acc, [key, value]) => ({...acc, [key]: value}), {} as T);

export const Users: FC = () => {
    const {user, mode} = useQuery<{ user: string, mode: string }>();
    const [users, updateNewUsers] = useState<UserInfo[]>(createRandomUsers());
    const currentUser: UserInfo | undefined = users.find(info => info.user.email === user);
    const remove = <T extends Object>(item: T, list: T[] = []): T[] => {
        const index = list.indexOf(item);
        return [...list.slice(0, index), ...list.slice(index + 1)];
    };

    return <>
        <section id="user-info" className="card overhang gutter" key={currentUser?.user.email}>
            <h2 className="title">User Information</h2>
            <UserInformation currentUserInfo={currentUser}
                             readOnly={mode === 'view'}
                             editing={mode === 'edit'}
                             onAdd={user => updateNewUsers([user, ...users])}
                             onUpdate={user => {
                                 if (currentUser) updateNewUsers([user, ...remove(currentUser, users)]);
                             }}/>
        </section>

        <section id="users" className="card overhang gutter">
            <h2 className="title">Users</h2>
            {mode === 'view' &&
            <Link to={Paths.users} id="add-new-user" className="button primary ripple">Add New User</Link>}
            <Table
                id="users-table"
                tableClassName="fancy-table home-table"
                theadClassName="header"
                trClassName="row"
                tbodyClassName="body"
                cellClassName="cell"
                columns={{
                    fullName: {display: 'Full Name', key: 'fullName'},
                    homeCity: {display: 'Home City', key: 'homeCity'},
                    worksFromHome: {display: 'Works from Home', key: 'worksFromHome'}
                }}
                rows={users.map((userInfo) => ({
                    fullName: {display: `${userInfo.user.firstName} ${userInfo.user.lastName}`},
                    homeCity: {display: userInfo.homeAddress.city},
                    worksFromHome: {
                        display: <section className="last-column">
                            {userInfo.homeAddress === userInfo.workAddress ? 'Yes' : 'No'}
                            <article tabIndex={0} className="menu card" onKeyPress={event => {
                                event.preventDefault();
                                if (event.code === 'Space') {
                                    event.currentTarget.classList.toggle('open');
                                }
                            }} onBlur={event => {
                                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                                    event.currentTarget.classList.remove('open');
                                }
                            }} onClick={event => event.currentTarget.classList.remove('open')}>
                                <nav className="menu-list card">
                                    <Link to={`${Paths.users}?user=${userInfo.user.email}&mode=view`}
                                          className='item'
                                          data-testid="view">View</Link>
                                    <Link to={`${Paths.users}?user=${userInfo.user.email}&mode=edit`}
                                          className='item'
                                          data-testid="view">Edit</Link>
                                    <Link to={Paths.users}
                                          className='item'
                                          onClick={() => updateNewUsers(remove(userInfo, users))}
                                          data-testid="remove">Remove</Link>
                                    <Link to={`${Paths.users}?user=${userInfo.user.email}`}
                                          className='item'
                                          data-testid="clone">Clone</Link>
                                </nav>
                            </article>
                        </section>
                    }
                }))}
            />
        </section>
    </>;
};