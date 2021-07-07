import React, {FC, useState} from 'react';
import {UserInfo} from '../UserInfo/types';
import {UserInformation} from '../UserInfo';
import {Table} from '../Table';
import {createRandomUsers} from '../../__tests__/util';
import {Link, useLocation} from 'react-router-dom';
import {Paths} from '../../App';
import './Users.css';

const useQuery = <T extends Object>(): T => useLocation().search
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((acc, [key, value]) => ({...acc, [key]: value}), {} as T);

export const Users: FC = () => {
    const {user} = useQuery<{ user: string }>();
    const [users, updateNewUsers] = useState<UserInfo[]>(createRandomUsers());
    const currentUser = users.find(info => info.user.email === user);

    return <>
        <section id="user-info" className="card overhang gutter" key={currentUser?.user.email}>
            <h2 className="title">User Information</h2>
            <UserInformation currentUserInfo={currentUser}
                             onAdd={user => updateNewUsers([user, ...users])}/>
        </section>

        <section id="users" className="card overhang gutter">
            <h2 className="title">Users</h2>
            <Table
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
                rows={users.map(({user, homeAddress, workAddress}) => ({
                    fullName: {display: `${user.firstName} ${user.lastName}`},
                    homeCity: {display: homeAddress.city},
                    worksFromHome: {
                        display: <section className="last-column">
                            {homeAddress === workAddress ? 'Yes' : 'No'}
                            <article tabIndex={0} className="menu card" onKeyPress={event => {
                                event.preventDefault();
                                if (event.code === 'Space') {
                                    event.currentTarget.classList.toggle('open');
                                }
                            }} onBlur={event => {
                                if(!event.currentTarget.contains(event.relatedTarget as Node)) {
                                    event.currentTarget.classList.remove('open');
                                }
                            }} onClick={event => event.currentTarget.classList.remove('open')}>
                                <nav className="menu-list card">
                                    <Link to={`${Paths.users}?user=${user.email}`}
                                          className='item'
                                          data-testid="view">View</Link>
                                </nav>
                            </article>
                        </section>
                    }
                }))}
            />
        </section>
    </>;
};