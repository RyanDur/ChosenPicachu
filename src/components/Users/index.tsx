import React, {FC, useState} from 'react';
import {AddressInfo, UserInfo} from '../UserInfo/types';
import {UserInformation} from '../UserInfo';
import {Table} from '../Table';
import {createRandomUsers} from '../../__tests__/util';
import {Link, useHistory, useLocation} from 'react-router-dom';
import {Paths} from '../../App';
import {age, formatAge} from '../util';
import './Users.scss';
import './Users.layout.scss';

const useQuery = <T extends Object>(): T => useLocation().search
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((acc, [key, value]) => ({...acc, [key]: value}), {} as T);

export const Users: FC = () => {
    const history = useHistory();
    const {email, mode} = useQuery<{ email: string, mode: string }>();
    const [users, updateNewUsers] = useState<UserInfo[]>(createRandomUsers());
    const currentUser: UserInfo | undefined = users.find(info => info.user.email === email);

    const removeUserInfo = (item: UserInfo, list: UserInfo[] = []): UserInfo[] => {
        const index = list.indexOf(item);
        return [...list.slice(0, index), ...list.slice(index + 1)];
    };

    const equalAddresses = (address1: AddressInfo, address2: AddressInfo = {} as AddressInfo): boolean =>
        Object.keys(address1).reduce((acc, key) => address1[key] === address2[key], Boolean());

    return <>
        <section id="user-info" className="card users" key={currentUser?.user.email}>
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
                    {display: 'Works from Home', column: 'worksFromHome'}
                ]}
                rows={users.map((userInfo) => ({
                    fullName: {display: `${userInfo.user.firstName} ${userInfo.user.lastName}`},
                    homeCity: {display: userInfo.homeAddress.city},
                    age: {display: formatAge(age(userInfo.user.dob))},
                    worksFromHome: {
                        display: <section className="last-column">
                            {equalAddresses(userInfo.homeAddress, userInfo.workAddress) ? 'Yes' : 'No'}
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
                                    <Link to={`${Paths.users}?email=${userInfo.user.email}&mode=view`}
                                          className='item'
                                          data-testid="view">View</Link>
                                    <Link to={`${Paths.users}?email=${userInfo.user.email}&mode=edit`}
                                          className='item'
                                          data-testid="view">Edit</Link>
                                    <Link to={email === userInfo.user.email ? Paths.users : history.location}
                                          className='item'
                                          onClick={() => updateNewUsers(removeUserInfo(userInfo, users))}
                                          data-testid="remove">Remove</Link>
                                    <Link to={`${Paths.users}?email=${userInfo.user.email}`}
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