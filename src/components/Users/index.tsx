import React, {FC, useState} from 'react';
import {AddressInfo, UserInfo} from '../UserInfo/types';
import {UserInformation} from '../UserInfo';
import {createRandomUsers} from '../../__tests__/util';
import {Link, useHistory} from 'react-router-dom';
import {Paths} from '../../App';
import {age, formatAge} from '../util';
import {useQuery} from '../hooks';
import {OldTable} from '../Table';
import {MyMenu} from '../MyMenu';
import {Button, Card} from '@material-ui/core';
import './Users.layout.scss';

export const Users: FC = () => {
    const history = useHistory();
    const {queryObj: {email, mode}, nextQueryString, path} = useQuery<{ email: string, mode: string }>();
    const [users, updateNewUsers] = useState<UserInfo[]>(createRandomUsers());
    const currentUser: UserInfo | undefined = users.find(info => info.user.email === email);

    const removeUserInfo = (item: UserInfo, list: UserInfo[] = []): UserInfo[] => {
        const index = list.indexOf(item);
        return [...list.slice(0, index), ...list.slice(index + 1)];
    };

    const equalAddresses = (address1: AddressInfo, address2: AddressInfo = {} as AddressInfo): boolean =>
        Object.keys(address1).reduce((acc, key) => address1[key] === address2[key], Boolean());

    return <>
        <Card component="section" id="user-info" className="users" key={currentUser?.user.email}>
            <h2 className="title">User Information</h2>
            <UserInformation currentUserInfo={currentUser}
                             readOnly={mode === 'view'}
                             editing={mode === 'edit'}
                             onAdd={user => updateNewUsers([user, ...users])}
                             onUpdate={user => {
                                 currentUser && updateNewUsers([user, ...removeUserInfo(currentUser, users)]);
                                 history.push(Paths.users);
                             }}/>
        </Card>

        <Card component="section" id="user-candidates" className="card users">
            <h2 className="title">User Candidates</h2>
            {mode === 'view' &&
            <Button component={Link} to={Paths.users} id="add-new-user" color="primary" variant="contained">Add New User</Button>}
            <OldTable
                id="users-table"
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
                            <MyMenu>
                                    <Link to={`${path}${nextQueryString({
                                        email: userInfo.user.email,
                                        mode: 'view'
                                    })}`}
                                          data-testid="view">View</Link>
                                    <Link to={`${path}${nextQueryString({
                                        email: userInfo.user.email,
                                        mode: 'edit'
                                    })}`}
                                          data-testid="view">Edit</Link>
                                    <Link to={email === userInfo.user.email ? path : history.location}
                                          onClick={() => updateNewUsers(removeUserInfo(userInfo, users))}
                                          data-testid="remove">Remove</Link>
                                    <Link to={`${path}${nextQueryString({email: userInfo.user.email})}`}
                                          data-testid="clone">Clone</Link>
                            </MyMenu>
                        </section>
                    }
                }))}
            />
        </Card>
    </>;
};